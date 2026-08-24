// Mesh Cutting Optimizer Module
export class MeshOptimizer {
    constructor(settings) {
        this.settings = settings;
        this.rollWidth = settings.rollWidth || 60; // inches (5ft)
        this.rollLength = settings.rollLength || 600; // inches (50ft)
        this.pricePerSqft = settings.pricePerSqft || 28;
    }

    optimize(meshPieces) {
        // Sort pieces by width descending for better packing
        const sortedPieces = [...meshPieces].sort((a, b) => b.width - a.width);
        const strips = [];
        let currentStrip = [];
        let currentWidth = 0;
        
        // 2D bin packing algorithm (first-fit decreasing)
        for (const piece of sortedPieces) {
            let placed = false;
            
            // Try to place in existing strip
            for (const strip of strips) {
                const usedWidth = strip.reduce((sum, p) => sum + p.width, 0);
                if (usedWidth + piece.width <= this.rollWidth) {
                    strip.push(piece);
                    placed = true;
                    break;
                }
            }
            
            if (!placed) {
                // Create new strip
                strips.push([piece]);
            }
        }
        
        // Calculate strip lengths and efficiency
        const maxStripHeight = meshPieces.reduce((max, p) => Math.max(max, p.height), 0);
        let totalLength = 0;
        let totalArea = 0;
        const stripDetails = [];
        
        for (const strip of strips) {
            const widthUsed = strip.reduce((sum, p) => sum + p.width, 0);
            const height = Math.max(...strip.map(p => p.height));
            const areaUsed = widthUsed * height;
            const areaWaste = (this.rollWidth - widthUsed) * height;
            
            // Add kerf allowance between pieces
            const effectiveLength = height + (strip.length - 1) * 0.5; // 0.5" kerf
            
            stripDetails.push({
                pieces: strip.map(p => ({ width: p.width, height: p.height })),
                widthUsed: widthUsed,
                length: effectiveLength,
                areaUsed: areaUsed,
                areaWaste: areaWaste,
                efficiency: (widthUsed / this.rollWidth) * 100
            });
            
            totalLength += effectiveLength;
            totalArea += areaUsed;
        }
        
        const totalAreaAvailable = this.rollWidth * this.rollLength;
        const totalAreaWaste = totalAreaAvailable - totalArea;
        
        return {
            strips: stripDetails,
            totalRollLength: totalLength,
            totalArea: totalArea,
            totalAreaWaste: totalAreaWaste,
            wastePercentage: (totalAreaWaste / totalAreaAvailable) * 100,
            efficiency: (totalArea / totalAreaAvailable) * 100,
            rollWidth: this.rollWidth,
            rollLength: this.rollLength,
            isSufficient: totalLength <= this.rollLength,
            remainingLength: Math.max(0, this.rollLength - totalLength),
            cost: (totalArea / 144) * this.pricePerSqft // Convert sq inches to sq ft
        };
    }

    // Alternative algorithm for better nesting
    optimizeAdvanced(meshPieces) {
        // Implement 2D bin packing with rotation
        const sortedPieces = meshPieces.map(p => ({
            ...p,
            area: p.width * p.height,
            canRotate: p.canRotate !== false
        })).sort((a, b) => b.area - a.area);
        
        // Try both orientations
        const withRotation = this.tryPacking(sortedPieces, true);
        const withoutRotation = this.tryPacking(sortedPieces, false);
        
        // Return the better packing
        return withRotation.efficiency >= withoutRotation.efficiency 
            ? withRotation 
            : withoutRotation;
    }

    tryPacking(pieces, allowRotation) {
        const strips = [];
        let currentStrip = [];
        let currentWidth = 0;
        
        for (const piece of pieces) {
            let placed = false;
            
            // Try to place in existing strip
            for (const strip of strips) {
                const usedWidth = strip.reduce((sum, p) => sum + p.width, 0);
                const pieceWidth = piece.width;
                
                if (usedWidth + pieceWidth <= this.rollWidth) {
                    strip.push(piece);
                    placed = true;
                    break;
                }
                
                // Try rotated orientation if allowed
                if (allowRotation && piece.height <= this.rollWidth) {
                    const rotatedWidth = piece.height;
                    if (usedWidth + rotatedWidth <= this.rollWidth) {
                        strip.push({
                            ...piece,
                            width: piece.height,
                            height: piece.width,
                            rotated: true
                        });
                        placed = true;
                        break;
                    }
                }
            }
            
            if (!placed) {
                // Try placing as new strip with rotation
                let width = piece.width;
                let height = piece.height;
                
                if (allowRotation && piece.height <= this.rollWidth) {
                    width = piece.height;
                    height = piece.width;
                }
                
                strips.push([{
                    ...piece,
                    width: width,
                    height: height,
                    rotated: width !== piece.width
                }]);
            }
        }
        
        // Calculate metrics
        const maxHeight = Math.max(...pieces.map(p => p.height));
        const totalLength = strips.reduce((sum, strip) => {
            const height = Math.max(...strip.map(p => p.height));
            return sum + height;
        }, 0);
        
        return {
            strips: strips,
            totalLength: totalLength,
            efficiency: this.calculateEfficiency(strips),
            isSufficient: totalLength <= this.rollLength
        };
    }

    calculateEfficiency(strips) {
        let totalArea = 0;
        let totalWaste = 0;
        
        for (const strip of strips) {
            const height = Math.max(...strip.map(p => p.height));
            const widthUsed = strip.reduce((sum, p) => sum + p.width, 0);
            totalArea += widthUsed * height;
            totalWaste += (this.rollWidth - widthUsed) * height;
        }
        
        const totalAvailable = strips.length * this.rollWidth * 
            Math.max(...strips.map(s => Math.max(...s.map(p => p.height))));
        
        return totalArea / (totalArea + totalWaste);
    }
              }

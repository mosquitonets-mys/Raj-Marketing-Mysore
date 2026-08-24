// Frame Calculator Module
export class FrameCalculator {
    constructor(settings) {
        this.settings = settings;
        this.reduction = settings.frameReduction || 1.5; // inches
        this.kerf = settings.kerf || 0.118; // inches (3mm)
    }

    calculate(measurements) {
        const frames = [];
        let totalFrames = 0;
        let totalMiddlePieces = 0;
        
        for (const measurement of measurements) {
            const quantity = measurement.quantity || 1;
            const middlePieces = measurement.middlePieces || 0;
            
            const finishedWidth = this.calculateFinishedWidth(measurement.width);
            const finishedHeight = this.calculateFinishedHeight(measurement.height);
            
            const frameData = {
                originalWidth: measurement.width,
                originalHeight: measurement.height,
                finishedWidth: finishedWidth,
                finishedHeight: finishedHeight,
                quantity: quantity,
                middlePieces: middlePieces,
                category: measurement.category || 'Standard',
                notes: measurement.notes || ''
            };
            
            frames.push(frameData);
            totalFrames += quantity;
            totalMiddlePieces += middlePieces * quantity;
        }
        
        return {
            frames: frames,
            totalFrames: totalFrames,
            totalMiddlePieces: totalMiddlePieces,
            summary: this.generateSummary(frames)
        };
    }

    calculateFinishedWidth(width) {
        return Math.round((width - this.reduction) * 100) / 100;
    }

    calculateFinishedHeight(height) {
        return Math.round((height - this.reduction) * 100) / 100;
    }

    generateSummary(frames) {
        const summary = {
            totalWidth: 0,
            totalHeight: 0,
            averageWidth: 0,
            averageHeight: 0,
            minWidth: Infinity,
            maxWidth: 0,
            minHeight: Infinity,
            maxHeight: 0
        };
        
        for (const frame of frames) {
            summary.totalWidth += frame.finishedWidth * frame.quantity;
            summary.totalHeight += frame.finishedHeight * frame.quantity;
            summary.minWidth = Math.min(summary.minWidth, frame.finishedWidth);
            summary.maxWidth = Math.max(summary.maxWidth, frame.finishedWidth);
            summary.minHeight = Math.min(summary.minHeight, frame.finishedHeight);
            summary.maxHeight = Math.max(summary.maxHeight, frame.finishedHeight);
        }
        
        const totalQuantity = frames.reduce((sum, f) => sum + f.quantity, 0);
        summary.averageWidth = summary.totalWidth / totalQuantity;
        summary.averageHeight = summary.totalHeight / totalQuantity;
        
        return summary;
    }

    getAluminiumCuts(frames) {
        const cuts = [];
        
        for (const frame of frames) {
            const width = frame.finishedWidth;
            const height = frame.finishedHeight;
            const qty = frame.quantity;
            
            // Each frame needs 2 width pieces and 2 height pieces
            for (let i = 0; i < qty; i++) {
                cuts.push(width, width);
                cuts.push(height, height);
            }
            
            // Middle pieces
            const middlePieces = frame.middlePieces || 0;
            for (let i = 0; i < middlePieces * qty; i++) {
                cuts.push(width);
            }
        }
        
        return cuts;
    }

    getMeshPieces(frames) {
        const pieces = [];
        
        for (const frame of frames) {
            const width = frame.finishedWidth;
            const height = frame.finishedHeight;
            const qty = frame.quantity;
            
            // Each frame needs one mesh piece
            for (let i = 0; i < qty; i++) {
                pieces.push({
                    width: width,
                    height: height,
                    originalWidth: frame.originalWidth,
                    originalHeight: frame.originalHeight,
                    quantity: 1,
                    area: width * height
                });
            }
        }
        
        return pieces;
    }
                                          }

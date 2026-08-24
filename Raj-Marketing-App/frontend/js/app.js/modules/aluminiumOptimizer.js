// Aluminium Cutting Optimizer Module
export class AluminiumOptimizer {
    constructor(settings) {
        this.settings = settings;
        this.stockLength = settings.stockLength || 144; // inches
        this.sawKerf = settings.sawKerf || 0.118; // inches (3mm)
        this.costPerStock = settings.costPerStock || 350;
    }

    optimize(cuts) {
        // Sort cuts in descending order
        const sortedCuts = [...cuts].sort((a, b) => b - a);
        const patterns = [];
        const waste = [];
        
        // First-Fit Decreasing algorithm with waste optimization
        const bins = [];
        const binRemainings = [];
        
        for (const cut of sortedCuts) {
            let placed = false;
            
            // Try to place in existing bin with best fit
            let bestFitIndex = -1;
            let bestRemaining = this.stockLength + 1;
            
            for (let i = 0; i < bins.length; i++) {
                const remaining = binRemainings[i] - cut - this.sawKerf;
                if (remaining >= 0 && remaining < bestRemaining) {
                    bestRemaining = remaining;
                    bestFitIndex = i;
                }
            }
            
            if (bestFitIndex !== -1) {
                bins[bestFitIndex].push(cut);
                binRemainings[bestFitIndex] = bestRemaining;
                placed = true;
            }
            
            if (!placed) {
                // Create new bin
                const remaining = this.stockLength - cut;
                bins.push([cut]);
                binRemainings.push(remaining);
            }
        }
        
        // Calculate waste and generate output
        const totalStock = bins.length;
        const totalUsed = bins.reduce((sum, bin) => 
            sum + bin.reduce((s, cut) => s + cut, 0), 0);
        const totalWaste = (totalStock * this.stockLength) - totalUsed;
        
        // Generate detailed output
        const cuttingPlan = bins.map((bin, index) => ({
            bar: index + 1,
            cuts: bin.sort((a, b) => a - b),
            totalUsed: bin.reduce((s, cut) => s + cut, 0),
            waste: this.stockLength - bin.reduce((s, cut) => s + cut, 0)
        }));
        
        return {
            totalBars: totalStock,
            totalLength: totalStock * this.stockLength,
            totalUsed: totalUsed,
            totalWaste: totalWaste,
            wastePercentage: (totalWaste / (totalStock * this.stockLength)) * 100,
            cuttingPlan: cuttingPlan,
            cost: totalStock * this.costPerStock,
            efficiency: (totalUsed / (totalStock * this.stockLength)) * 100
        };
    }

    // Alternative optimization using linear programming approach
    optimizeAdvanced(cuts) {
        // This implements a more sophisticated 1D cutting stock algorithm
        const sortedCuts = [...cuts].sort((a, b) => b - a);
        const patterns = this.generatePatterns(sortedCuts);
        
        // Solve using column generation or heuristic
        // For now, use the First-Fit Decreasing algorithm
        return this.optimize(cuts);
    }

    generatePatterns(cuts) {
        // Generate all possible cutting patterns
        const patterns = [];
        const maxPatterns = 1000; // Limit to prevent explosion
        
        // Recursive pattern generation
        const generate = (remaining, current, start) => {
            if (patterns.length >= maxPatterns) return;
            
            // Try to add each remaining cut
            for (let i = start; i < cuts.length; i++) {
                const cut = cuts[i];
                if (cut <= remaining) {
                    const newCurrent = [...current, cut];
                    patterns.push(newCurrent);
                    generate(remaining - cut - this.sawKerf, newCurrent, i + 1);
                }
            }
        };
        
        generate(this.stockLength, [], 0);
        return patterns;
    }

    // Validate if a set of cuts can fit in given number of bars
    validateCutCount(cuts, bars) {
        const totalLength = cuts.reduce((s, c) => s + c, 0);
        const totalCapacity = bars * this.stockLength;
        const kerfTotal = (cuts.length - bars) * this.sawKerf;
        
        return (totalLength + kerfTotal) <= totalCapacity;
    }
          }

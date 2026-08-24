// Accessory Calculator Module
export class AccessoryCalculator {
    constructor(settings) {
        this.settings = settings;
        this.accessories = settings.accessories || this.getDefaultAccessories();
    }

    getDefaultAccessories() {
        return {
            corners: {
                name: '90° Fibre Corner',
                unit: 'piece',
                price: 6,
                formula: (frames) => frames * 4,
                description: '4 per frame'
            },
            middleClips: {
                name: 'Middle Clip',
                unit: 'piece',
                price: 4,
                formula: (middlePieces) => middlePieces * 2,
                description: '2 per middle piece'
            },
            hinges: {
                name: 'Hinges',
                unit: 'piece',
                price: 6,
                formula: (frames) => frames * 2,
                description: '2 per frame'
            },
            stoppers: {
                name: 'Stopper Lock',
                unit: 'piece',
                price: 3,
                formula: (frames) => frames * 1,
                description: '1 per frame'
            },
            rubberBeading: {
                name: 'Rubber Beading',
                unit: 'metre',
                price: 12,
                formula: this.calculateBeading.bind(this),
                description: 'Perimetre + middle pieces'
            }
        };
    }

    calculate(frameData) {
        const totalFrames = frameData.totalFrames;
        const totalMiddlePieces = frameData.totalMiddlePieces;
        const frames = frameData.frames;
        
        const results = {};
        let totalCost = 0;
        
        for (const [key, accessory] of Object.entries(this.accessories)) {
            let quantity;
            if (typeof accessory.formula === 'function') {
                quantity = accessory.formula(frames, totalFrames, totalMiddlePieces);
            } else {
                quantity = accessory.formula(totalFrames, totalMiddlePieces);
            }
            
            const cost = quantity * accessory.price;
            results[key] = {
                name: accessory.name,
                quantity: Math.round(quantity),
                unit: accessory.unit,
                price: accessory.price,
                cost: cost,
                description: accessory.description
            };
            
            totalCost += cost;
        }
        
        return {
            accessories: results,
            totalCost: totalCost,
            summary: this.generateSummary(results)
        };
    }

    calculateBeading(frames, totalFrames, totalMiddlePieces) {
        let totalLength = 0;
        
        // Add perimeter of each frame
        for (const frame of frames) {
            const qty = frame.quantity;
            const perimeter = 2 * (frame.finishedWidth + frame.finishedHeight);
            totalLength += perimeter * qty;
        }
        
        // Add middle pieces length
        for (const frame of frames) {
            const qty = frame.quantity;
            const middlePieces = frame.middlePieces || 0;
            totalLength += frame.finishedWidth * middlePieces * qty;
        }
        
        // Convert inches to metres
        return totalLength / 39.3701;
    }

    generateSummary(results) {
        const summary = {
            totalItems: Object.keys(results).length,
            totalCost: 0,
            items: []
        };
        
        for (const [key, value] of Object.entries(results)) {
            summary.totalCost += value.cost;
            summary.items.push({
                key: key,
                name: value.name,
                quantity: value.quantity,
                cost: value.cost
            });
        }
        
        return summary;
    }

    updateAccessory(key, settings) {
        if (this.accessories[key]) {
            this.accessories[key] = {
                ...this.accessories[key],
                ...settings
            };
        }
    }

    addAccessory(key, settings) {
        if (!this.accessories[key]) {
            this.accessories[key] = {
                name: settings.name,
                unit: settings.unit || 'piece',
                price: settings.price,
                formula: settings.formula,
                description: settings.description || ''
            };
        }
    }
}

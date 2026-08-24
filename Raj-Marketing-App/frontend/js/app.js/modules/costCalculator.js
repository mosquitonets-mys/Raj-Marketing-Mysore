// Cost Calculator Module
export class CostCalculator {
    constructor(settings) {
        this.settings = settings;
    }

    calculateProjectCost(frameData, aluminiumResult, meshResult, accessoryResult) {
        const internalCost = this.calculateInternalCost(
            frameData,
            aluminiumResult,
            meshResult,
            accessoryResult
        );
        
        const customerCost = this.calculateCustomerPrice(internalCost);
        
        return {
            internal: internalCost,
            customer: customerCost,
            totalMaterialCost: internalCost.totalMaterialCost,
            breakdown: {
                aluminium: aluminiumResult,
                mesh: meshResult,
                accessories: accessoryResult
            }
        };
    }

    calculateInternalCost(frameData, aluminiumResult, meshResult, accessoryResult) {
        const materialCost = {
            aluminium: aluminiumResult.cost || 0,
            mesh: meshResult.cost || 0,
            accessories: accessoryResult.totalCost || 0
        };
        
        const totalMaterialCost = materialCost.aluminium + materialCost.mesh + materialCost.accessories;
        
        // Labour and overheads
        const labourCost = totalMaterialCost * 0.15; // 15% labour
        const transportCost = totalMaterialCost * 0.05; // 5% transport
        const otherExpenses = totalMaterialCost * 0.03; // 3% other
        
        const totalProjectCost = totalMaterialCost + labourCost + transportCost + otherExpenses;
        
        // Profit margin (configurable)
        const profitMargin = this.settings.profitMargin || 0.20; // 20%
        const profit = totalProjectCost * profitMargin;
        
        return {
            materialCost: materialCost,
            totalMaterialCost: totalMaterialCost,
            labourCost: labourCost,
            transportCost: transportCost,
            otherExpenses: otherExpenses,
            totalProjectCost: totalProjectCost,
            profit: profit,
            sellingPrice: totalProjectCost + profit
        };
    }

    calculateCustomerPrice(internalCost) {
        // Round up to nearest 100 for customer pricing
        const basePrice = internalCost.sellingPrice;
        const roundedPrice = Math.ceil(basePrice / 100) * 100;
        
        return {
            sellingPrice: roundedPrice,
            roundedUp: roundedPrice - basePrice,
            discount: 0,
            finalPrice: roundedPrice
        };
    }

    calculateWasteCost(aluminiumResult, meshResult) {
        const aluminiumWaste = aluminiumResult.totalWaste || 0;
        const meshWaste = meshResult.totalAreaWaste || 0;
        
        // Convert waste to cost
        const aluminiumWasteCost = (aluminiumWaste / aluminiumResult.totalLength) * 
            aluminiumResult.cost;
        const meshWasteCost = (meshWaste / (meshResult.rollWidth * meshResult.rollLength)) * 
            meshResult.cost;
        
        return {
            aluminiumWaste: aluminiumWaste,
            aluminiumWasteCost: aluminiumWasteCost,
            meshWaste: meshWaste,
            meshWasteCost: meshWasteCost,
            totalWasteCost: aluminiumWasteCost + meshWasteCost
        };
    }
}

import { FrameCalculator } from '../../frontend/js/modules/frameCalculator.js';
import { AluminiumOptimizer } from '../../frontend/js/modules/aluminiumOptimizer.js';
import { MeshOptimizer } from '../../frontend/js/modules/meshOptimizer.js';
import { AccessoryCalculator } from '../../frontend/js/modules/accessoryCalculator.js';
import { CostCalculator } from '../../frontend/js/modules/costCalculator.js';
import { Project } from '../models/Project.js';
import { Settings } from '../models/Settings.js';
import { calculateProject } from '../../frontend/js/modules/calculationService.js';

export class CalculationController {
    async calculateProject(req, res) {
        try {
            const { projectId } = req.params;
            const project = await Project.findById(projectId);
            
            if (!project) {
                return res.status(404).json({ error: 'Project not found' });
            }
            
            // Get settings
            const settings = await Settings.getSettings();
            
            // Initialize calculators
            const frameCalc = new FrameCalculator(settings.frame);
            const aluminiumCalc = new AluminiumOptimizer(settings.aluminium);
            const meshCalc = new MeshOptimizer(settings.mesh);
            const accessoryCalc = new AccessoryCalculator(settings.accessories);
            const costCalc = new CostCalculator(settings.cost);
            
            // Calculate frames
            const frameData = frameCalc.calculate(project.measurements);
            
            // Calculate aluminium cuts
            const aluminiumCuts = frameCalc.getAluminiumCuts(frameData.frames);
            const aluminiumResult = aluminiumCalc.optimize(aluminiumCuts);
            
            // Calculate mesh pieces
            const meshPieces = frameCalc.getMeshPieces(frameData.frames);
            const meshResult = meshCalc.optimize(meshPieces);
            
            // Calculate accessories
            const accessoryResult = accessoryCalc.calculate(frameData);
            
            // Calculate costs
            const costResult = costCalc.calculateProjectCost(
                frameData,
                aluminiumResult,
                meshResult,
                accessoryResult
            );
            
            // Save results
            project.calculationResults = {
                frameData,
                aluminiumResult,
                meshResult,
                accessoryResult,
                costResult
            };
            project.status = 'Calculation Complete';
            await project.save();
            
            res.json({
                success: true,
                data: {
                    frameData,
                    aluminiumResult,
                    meshResult,
                    accessoryResult,
                    costResult
                }
            });
        } catch (error) {
            console.error('Calculation error:', error);
            res.status(500).json({ error: 'Calculation failed' });
        }
    }

    async getCalculationResults(req, res) {
        try {
            const { projectId } = req.params;
            const project = await Project.findById(projectId);
            
            if (!project) {
                return res.status(404).json({ error: 'Project not found' });
            }
            
            if (!project.calculationResults) {
                return res.status(404).json({ error: 'No calculation results found' });
            }
            
            res.json({
                success: true,
                data: project.calculationResults
            });
        } catch (error) {
            console.error('Error retrieving results:', error);
            res.status(500).json({ error: 'Failed to retrieve results' });
        }
    }

    async recalculateProject(req, res) {
        try {
            const { projectId } = req.params;
            const { measurements } = req.body;
            
            // Update measurements if provided
            if (measurements) {
                await Project.updateMeasurements(projectId, measurements);
            }
            
            // Recalculate
            return this.calculateProject(req, res);
        } catch (error) {
            console.error('Recalculation error:', error);
            res.status(500).json({ error: 'Recalculation failed' });
        }
    }

    async getCuttingPlan(req, res) {
        try {
            const { projectId } = req.params;
            const project = await Project.findById(projectId);
            
            if (!project || !project.calculationResults) {
                return res.status(404).json({ error: 'No calculation results found' });
            }
            
            const { aluminiumResult, meshResult } = project.calculationResults;
            
            res.json({
                success: true,
                data: {
                    aluminium: aluminiumResult.cuttingPlan,
                    mesh: meshResult.strips
                }
            });
        } catch (error) {
            console.error('Error getting cutting plan:', error);
            res.status(500).json({ error: 'Failed to get cutting plan' });
        }
    }
}

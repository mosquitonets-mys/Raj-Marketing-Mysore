import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { authRoutes } from './routes/auth.js';
import { projectRoutes } from './routes/projects.js';
import { measurementRoutes } from './routes/measurements.js';
import { materialRoutes } from './routes/materials.js';
import { accessoryRoutes } from './routes/accessories.js';
import { meshRoutes } from './routes/mesh.js';
import { settingsRoutes } from './routes/settings.js';
import { whatsappRoutes } from './routes/whatsapp.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authenticate } from './middleware/auth.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:8080'],
    credentials: true
}));
app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', authenticate, projectRoutes);
app.use('/api/measurements', authenticate, measurementRoutes);
app.use('/api/materials', authenticate, materialRoutes);
app.use('/api/accessories', authenticate, accessoryRoutes);
app.use('/api/mesh', authenticate, meshRoutes);
app.use('/api/settings', authenticate, settingsRoutes);
app.use('/api/whatsapp', whatsappRoutes);

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`Raj Marketing API running on port ${PORT}`);
});

export default app;

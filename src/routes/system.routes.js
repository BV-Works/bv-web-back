import { Router } from 'express';

import { checkHealth } from '../controllers/system.controller';

const router = Router();

// GET /system/health
router.get('/health', checkHealth); //-> devuelve el estado de salud del sistema (base de datos, uptime, etc)

export default router;

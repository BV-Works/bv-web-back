import sequelize from '../config/db_pg.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const checkHealth = async (req, res) => {
  console.log('[HEALTH]', {
    time: new Date().toISOString(),
    ip: req.ip,
    userAgent: req.get('user-agent'),
    forwardedFor: req.get('x-forwarded-for'),
    cfConnectingIp: req.get('cf-connecting-ip'),
  });

  try {
    await sequelize.authenticate();

    return res.status(200).json(
      successResponse(
        {
          database: 'connected',
          uptime: process.uptime(),
          timestamp: new Date().toISOString(),
        },
        'System healthy',
      ),
    );
  } catch (error) {
    return res
      .status(500)
      .json(errorResponse('Database disconnected', 'DB_ERROR'));
  }
};
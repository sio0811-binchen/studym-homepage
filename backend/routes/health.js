/**
 * Health Check 라우트
 */

import { Router } from 'express';
import { query, getPool } from '../utils/database.js';

const router = Router();

/**
 * GET /api/health
 * 서버 상태 확인
 */
router.get('/', async (req, res) => {
    let dbStatus = 'disconnected';
    let dbLatency = null;

    try {
        const start = Date.now();
        await query('SELECT 1');
        dbLatency = Date.now() - start;
        dbStatus = 'connected';
    } catch (e) {
        dbStatus = `error: ${e.message}`;
    }

    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: {
            status: dbStatus,
            latency: dbLatency ? `${dbLatency}ms` : null
        },
        memory: {
            used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
            total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`
        },
        env: process.env.NODE_ENV || 'development'
    });
});

/**
 * GET /api/health/db
 * 데이터베이스 상태 상세 확인
 */
router.get('/db', async (req, res) => {
    try {
        const pool = getPool();

        // 연결 수 확인
        const poolInfo = {
            totalCount: pool.totalCount,
            idleCount: pool.idleCount,
            waitingCount: pool.waitingCount
        };

        // 간단한 쿼리 실행
        const start = Date.now();
        await query('SELECT NOW()');
        const latency = Date.now() - start;

        res.json({
            status: 'ok',
            pool: poolInfo,
            latency: `${latency}ms`
        });
    } catch (e) {
        res.status(503).json({
            status: 'error',
            error: e.message
        });
    }
});

export default router;

/**
 * Health Check 라우트
 */

import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query, getPool } from '../utils/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

    // SPA 상태 확인
    const projectRoot = path.resolve(__dirname, '../../');
    const indexPath = path.join(projectRoot, 'dist', 'index.html');
    const spaStatus = fs.existsSync(indexPath) ? 'ok' : 'missing';

    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: {
            status: dbStatus,
            latency: dbLatency ? `${dbLatency}ms` : null
        },
        spa: {
            status: spaStatus,
            indexHtml: spaStatus === 'ok' ? 'found' : 'not found',
            path: spaStatus === 'ok' ? '/dist/index.html' : null
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

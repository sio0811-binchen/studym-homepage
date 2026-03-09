/**
 * 데이터베이스 유틸리티
 *
 * PostgreSQL 연결 및 쿼리 래퍼
 */

import pg from 'pg';

const { Pool } = pg;

let pool = null;

/**
 * 데이터베이스 풀 초기화
 */
export function initDatabase() {
    if (pool) {
        return pool;
    }

    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    });

    // 에러 처리
    pool.on('error', (err) => {
        console.error('PostgreSQL 풀 에러:', err);
    });

    return pool;
}

/**
 * 쿼리 실행
 *
 * @param {string} text - SQL 쿼리
 * @param {Array} params - 파라미터
 * @returns {Promise<Object>}
 */
export async function query(text, params = []) {
    const client = await getPool().connect();
    try {
        const result = await client.query(text, params);
        return result;
    } finally {
        client.release();
    }
}

/**
 * 트랜잭션 실행
 *
 * @param {Function} callback - 트랜잭션 내 실행할 함수
 */
export async function transaction(callback) {
    const client = await getPool().connect();
    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

/**
 * 풀 가져오기
 */
export function getPool() {
    if (!pool) {
        initDatabase();
    }
    return pool;
}

/**
 * 연결 종료
 */
export async function closePool() {
    if (pool) {
        await pool.end();
        pool = null;
    }
}

/**
 * 테이블 존재 확인
 */
export async function tableExists(tableName) {
    const result = await query(
        `SELECT EXISTS (
            SELECT FROM information_schema.tables
            WHERE table_name = $1
        )`,
        [tableName]
    );
    return result.rows[0].exists;
}

/**
 * 테이블 스키마 버전 관리
 */
export async function getSchemaVersion() {
    try {
        const result = await query(
            `SELECT version FROM schema_version ORDER BY applied_at DESC LIMIT 1`
        );
        return result.rows[0]?.version || 0;
    } catch {
        return 0;
    }
}

export default {
    initDatabase,
    query,
    transaction,
    getPool,
    closePool,
    tableExists,
    getSchemaVersion
};

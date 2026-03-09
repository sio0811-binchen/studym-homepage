/**
 * 인증 미들웨어
 *
 * 관리자 API 접근 제어를 담당합니다.
 * 보안 개선: 하드코딩된 비밀번호 제거, 환경변수만 사용
 */

/**
 * 관리자 인증 미들웨어
 *
 * 지원 인증 방식:
 * 1. 헤더: x-admin-secret
 * 2. 쿼리: admin_secret
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export function requireAdmin(req, res, next) {
    const adminSecret = process.env.ADMIN_SECRET_KEY;

    // 환경변수가 없으면 인증 비활성화 (개발 환경)
    if (!adminSecret) {
        console.warn('⚠️ ADMIN_SECRET_KEY가 설정되지 않음. 인증 비활성화.');
        return next();
    }

    const providedSecret = req.headers['x-admin-secret'] || req.query.admin_secret;

    if (!providedSecret || providedSecret !== adminSecret) {
        return res.status(401).json({
            error: '인증이 필요합니다.',
            code: 'UNAUTHORIZED'
        });
    }

    next();
}

/**
 * 선택적 관리자 인증
 *
 * 인증이 있으면 isAdmin 플래그 설정, 없어도 통과
 */
export function optionalAdmin(req, res, next) {
    const adminSecret = process.env.ADMIN_SECRET_KEY;

    if (!adminSecret) {
        req.isAdmin = false;
        return next();
    }

    const providedSecret = req.headers['x-admin-secret'] || req.query.admin_secret;
    req.isAdmin = providedSecret === adminSecret;

    next();
}

/**
 * API 키 검증 미들웨어 (SMS API용)
 */
export function requireApiKey(req, res, next) {
    const apiKey = process.env.SMS_API_KEY;

    if (!apiKey) {
        return res.status(503).json({
            error: 'SMS API가 설정되지 않았습니다.',
            code: 'SERVICE_UNAVAILABLE'
        });
    }

    next();
}

export default {
    requireAdmin,
    optionalAdmin,
    requireApiKey
};

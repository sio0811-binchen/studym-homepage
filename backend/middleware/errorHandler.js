/**
 * 에러 처리 미들웨어
 *
 * 통합 에러 처리로 일관된 응답 형식을 제공합니다.
 */

/**
 * 커스텀 API 에러 클래스
 */
export class ApiError extends Error {
    constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * 자주 사용하는 에러 팩토리
 */
export const Errors = {
    NotFound: (resource = '리소스') => new ApiError(`${resource}를 찾을 수 없습니다.`, 404, 'NOT_FOUND'),
    BadRequest: (message = '잘못된 요청입니다.') => new ApiError(message, 400, 'BAD_REQUEST'),
    Unauthorized: (message = '인증이 필요합니다.') => new ApiError(message, 401, 'UNAUTHORIZED'),
    Forbidden: (message = '접근 권한이 없습니다.') => new ApiError(message, 403, 'FORBIDDEN'),
    Conflict: (message = '중복된 데이터입니다.') => new ApiError(message, 409, 'CONFLICT'),
    Internal: (message = '서버 오류가 발생했습니다.') => new ApiError(message, 500, 'INTERNAL_ERROR'),
};

/**
 * 비동기 핸들러 래퍼
 *
 * try-catch 없이 async 함수를 안전하게 처리합니다.
 *
 * @example
 * router.get('/data', asyncHandler(async (req, res) => {
 *     const data = await fetchData();
 *     res.json(data);
 * }));
 */
export function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

/**
 * 전역 에러 핸들러
 *
 * app.use()의 마지막에 배치합니다.
 */
export function globalErrorHandler(err, req, res, next) {
    // 로깅
    console.error(`[${new Date().toISOString()}] Error:`, {
        message: err.message,
        code: err.code,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    // 운영 에러 vs 프로그래밍 에러 구분
    const isOperational = err.isOperational ?? false;
    const statusCode = err.statusCode || 500;

    // 응답
    res.status(statusCode).json({
        error: err.message || '서버 오류가 발생했습니다.',
        code: err.code || 'INTERNAL_ERROR',
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
}

/**
 * 404 핸들러
 */
export function notFoundHandler(req, res, next) {
    next(Errors.NotFound(`경로 ${req.path}를 찾을 수 없습니다.`));
}

export default {
    ApiError,
    Errors,
    asyncHandler,
    globalErrorHandler,
    notFoundHandler
};

# StudyM Homepage Backend

> **리팩토링 일시**: 2026-03-07
> **목적**: 1072줄 server.js를 모듈화하여 유지보수성 향상

## 폴더 구조

```
backend/
├── routes/
│   ├── blog.js            # 블로그 API (WordPress 프록시 + PostgreSQL)
│   ├── consultations.js   # 상담 API
│   ├── payments.js        # 결제 API (Toss)
│   ├── franchise.js       # 가맹점 API
│   ├── sms.js             # SMS 발송 API
│   ├── seo.js             # Sitemap, RSS
│   ├── health.js          # Health Check
│   └── wordpress.js       # WordPress REST API 프록시
├── middleware/
│   ├── auth.js            # 인증 미들웨어
│   └── errorHandler.js    # 에러 처리
├── services/
│   ├── solapi.js          # SMS 서비스
│   └── toss.js            # 결제 서비스
└── utils/
    └── database.js        # PostgreSQL 유틸리티
```

## 진입점

- `server-modular.js` - 새로운 모듈화된 서버 (현재 사용중)
- `server.legacy.js` - 기존 1072줄 서버 (백업)

## 보안 개선사항

### ❌ 이전 (위험)
```javascript
const SOLAPI_API_KEY = process.env.SOLAPI_API_KEY || 'NCS2S7JFYO8QSACF';
```

### ✅ 이후 (안전)
```javascript
const apiKey = process.env.SOLAPI_API_KEY;
if (!apiKey) {
    throw new Error('SOLAPI_API_KEY가 설정되지 않았습니다.');
}
```

## 사용법

### 새 server.js 예시

```javascript
import express from 'express';
import { globalErrorHandler, notFoundHandler } from './backend/middleware/errorHandler.js';
import { requireAdmin } from './backend/middleware/auth.js';

// 라우트
import blogRoutes from './backend/routes/blog.js';
import consultationRoutes from './backend/routes/consultations.js';
import paymentRoutes from './backend/routes/payments.js';
import franchiseRoutes from './backend/routes/franchise.js';

const app = express();

// 미들웨어
app.use(express.json());

// 라우트 마운트
app.use('/api/blog', blogRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/franchise', franchiseRoutes);

// 에러 처리
app.use(notFoundHandler);
app.use(globalErrorHandler);

app.listen(3000);
```

## 환경 변수

```env
# 필수
DATABASE_URL=postgresql://...

# SMS (선택)
SOLAPI_API_KEY=NCS2S7JFYO8QSACF
SOLAPI_API_SECRET=...
SOLAPI_SENDER_PHONE=01098051011

# 결제 (선택)
TOSS_SECRET_KEY=live_sk_...

# 인증
ADMIN_SECRET_KEY=your-secure-key

# 알림
ADMIN_PHONE=01098051011
```

## 중복 라우트 수정

### ❌ 이전
```javascript
// Line 528
app.post('/api/payment-confirm/confirm/', ...)

// Line 716 (중복!)
app.post('/api/payment-confirm/confirm/', ...)
```

### ✅ 이후
```javascript
// routes/payments.js - 1회만 정의
router.post('/confirm/', asyncHandler(async (req, res) => { ... }));
```

## API 엔드포인트

| 라우트 | 메서드 | 설명 |
|--------|--------|------|
| `/api/health` | GET | 서버 상태 확인 |
| `/api/blog` | GET | 블로그 목록 |
| `/api/blog/:slug` | GET | 블로그 상세 |
| `/api/blog` | POST | 블로그 생성 (관리자) |
| `/api/consultations` | POST | 상담 신청 |
| `/api/consultations` | GET | 상담 목록 (관리자) |
| `/api/payments` | GET | 결제 목록 |
| `/api/payments` | POST | 결제 생성 |
| `/api/payments/confirm/` | POST | 결제 승인 |
| `/api/payments/test_init` | POST | 테스트 결제 생성 (심사용) |
| `/api/franchise/inquire` | POST | 가맹 문의 |
| `/api/sms/send` | POST | SMS 발송 |
| `/sitemap.xml` | GET | SEO 사이트맵 |
| `/rss.xml` | GET | RSS 피드 |

## 실행 방법

```bash
# 개발 (프론트엔드)
npm run dev

# 프로덕션 (빌드 후)
npm run build
npm start

# 레거시 서버 (필요시)
npm run start:legacy
```

/**
 * SEO Pre-rendering Middleware
 * 
 * SPA의 index.html을 서빙할 때 경로(path)에 맞는 메타 태그를 서버에서 주입합니다.
 * 이를 통해 Googlebot이 JavaScript를 실행하지 않아도 올바른 title, description,
 * canonical, og 태그를 인식할 수 있습니다.
 * 
 * [해결하는 문제]
 * - Google Search Console: "적절한 표준 태그가 포함된 대체 페이지"
 * - Google Search Console: "중복 페이지, Google에서 사용자와 다른 표준을 선택함"
 * - 모든 페이지가 동일한 title/description/canonical 반환
 */

const BASE_URL = process.env.BASE_URL || 'https://studym.co.kr';

/**
 * 경로별 메타데이터 정의
 * App.tsx의 라우트와 일치해야 합니다.
 */
export const PAGE_META = {
    '/': {
        title: 'STUDY M - 상위 1% 학습 경영 시스템',
        description: '데이터 기반 맞춤형 학습 관리로 상위 1% 성적 달성. 학생과 학부모가 함께 성장하는 STUDY M.',
        keywords: '관리형스터디카페, 관리형독서실, 메타인지, 관리형, 평촌관리형, 평촌관리형스터디카페, 평촌관리형독서실, 학습 관리, 학습 분석, 스터디엠, 순공시간 관리',
    },
    '/story': {
        title: 'STUDY M 이야기 | 학습 관리의 새로운 패러다임',
        description: 'STUDY M이 어떻게 학생들의 학습 습관을 변화시키고 성적 향상을 이끌어내는지 확인하세요.',
        keywords: '스터디엠 이야기, 학습관리 성공사례, 관리형 스터디 효과',
    },
    '/blog': {
        title: '입시 교육 블로그 | STUDY M 교육연구소',
        description: '입시 전략, 효과적인 학습법, 교육 트렌드 등 학부모와 학생을 위한 전문 교육 칼럼.',
        keywords: '입시 블로그, 교육 칼럼, 학습법, 학부모 가이드, 교육 트렌드',
    },
    '/diagnosis': {
        title: '학습 진단 | STUDY M',
        description: '무료 학습 진단으로 자녀의 학습 유형과 개선 포인트를 파악하세요. STUDY M 전문 진단 시스템.',
        keywords: '학습 진단, 학습 유형 검사, 메타인지 진단, 학습 분석',
    },
    '/programs/standard': {
        title: '정규반 프로그램 | STUDY M',
        description: '체계적인 학습 관리와 1:1 맞춤 지도로 성적 향상을 보장하는 STUDY M 정규반 프로그램.',
        keywords: '관리형 정규반, 학습 관리 프로그램, 자기주도학습, 성적향상',
    },
    '/programs/weekly': {
        title: '주말반 프로그램 | STUDY M',
        description: '주말 집중 학습으로 부족한 부분을 보완하는 STUDY M 주말반 프로그램.',
        keywords: '주말반, 주말 학습, 보충 학습, 집중 프로그램',
    },
    '/programs/winter-school': {
        title: '윈터스쿨 프로그램 | STUDY M',
        description: '방학 기간 집중 학습으로 선행학습과 취약 부분을 보완하는 STUDY M 윈터스쿨.',
        keywords: '윈터스쿨, 겨울방학 프로그램, 방학 집중반, 선행학습',
    },
    '/franchise': {
        title: '가맹 문의 | STUDY M 프랜차이즈',
        description: 'STUDY M 프랜차이즈 가맹에 관심이 있으신가요? 검증된 학습 관리 시스템으로 함께 성장하세요.',
        keywords: '스터디엠 가맹, 관리형 독서실 프랜차이즈, 교육 프랜차이즈, 가맹 문의',
    },
    '/branches': {
        title: '지점별 신규 등록 혜택 및 이벤트 | STUDY M',
        description: 'STUDY M 각 지점에서 진행 중인 신규 등록 혜택, 프로모션, 한정 이벤트를 한눈에 확인하세요.',
        keywords: '스터디엠 신규혜택, 관리형 스터디카페 프로모션, 평촌 스터디카페 이벤트, 등록 혜택',
    },
    '/locations': {
        title: '오시는 길 — 지점 위치·교통편·주차 안내 | STUDY M',
        description: '가까운 STUDY M을 빠르게 찾으세요. 지점별 주소, 지하철·버스 교통편, 주차 안내를 제공합니다.',
        keywords: '스터디엠 오시는 길, 지점 위치, 평촌 스터디카페 주차, 관리형 독서실 교통편',
    },
    '/about': {
        title: '회사 소개 | STUDY M',
        description: 'STUDY M의 비전, 미션, 그리고 교육 철학을 소개합니다.',
        keywords: '스터디엠 소개, 회사 소개, 교육 철학',
    },
    '/features': {
        title: '서비스 특징 | STUDY M',
        description: 'STUDY M만의 차별화된 학습 관리 시스템과 핵심 기능을 소개합니다.',
        keywords: '학습 관리 시스템, 순공시간 측정, 메타인지 학습, AI 학습 분석',
    },
    '/privacy': {
        title: '개인정보처리방침 | STUDY M',
        description: 'STUDY M의 개인정보 수집, 이용, 보호에 관한 정책입니다.',
        keywords: '',
    },
    '/manual': {
        title: '운영 매뉴얼 및 이용약관 | STUDY M',
        description: 'STUDY M의 운영 지침, 이용약관, 환불 정책 등 회원이 알아야 할 모든 약관과 정책을 확인하세요.',
        keywords: 'STUDY M 이용약관, 운영 매뉴얼, 환불 정책, 관리형 스터디카페 약관',
    },
};

/**
 * index.html 내용에서 메타 태그를 경로에 맞게 교체합니다.
 * 
 * @param {string} html - 원본 index.html 내용
 * @param {string} pathname - 요청 경로 (예: '/blog')
 * @returns {string} - 메타 태그가 교체된 HTML
 */
export function injectSEOMeta(html, pathname) {
    // 정확한 경로 매칭 (trailing slash 제거)
    const cleanPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
    const meta = PAGE_META[cleanPath];

    if (!meta) {
        // 매칭되는 메타 없으면 canonical만 현재 경로로 수정
        const pageUrl = `${BASE_URL}${cleanPath}`;
        return html
            .replace(
                /<link rel="canonical" href="[^"]*" ?\/?>/,
                `<link rel="canonical" href="${pageUrl}" />`
            )
            .replace(
                /<meta property="og:url" content="[^"]*" ?\/?>/,
                `<meta property="og:url" content="${pageUrl}" />`
            )
            .replace(
                /<meta name="twitter:url" content="[^"]*" ?\/?>/,
                `<meta name="twitter:url" content="${pageUrl}" />`
            );
    }

    const pageUrl = `${BASE_URL}${cleanPath}`;

    let result = html;

    // Title
    result = result.replace(
        /<title>[^<]*<\/title>/,
        `<title>${meta.title}</title>`
    );

    // Meta description
    result = result.replace(
        /<meta name="description" content="[^"]*" ?\/?>/,
        `<meta name="description" content="${meta.description}" />`
    );

    // Meta keywords (if provided)
    if (meta.keywords) {
        result = result.replace(
            /<meta name="keywords"\s*\n?\s*content="[^"]*" ?\/?>/,
            `<meta name="keywords" content="${meta.keywords}" />`
        );
    }

    // Canonical URL
    result = result.replace(
        /<link rel="canonical" href="[^"]*" ?\/?>/,
        `<link rel="canonical" href="${pageUrl}" />`
    );

    // Open Graph
    result = result.replace(
        /<meta property="og:url" content="[^"]*" ?\/?>/,
        `<meta property="og:url" content="${pageUrl}" />`
    );
    result = result.replace(
        /<meta property="og:title" content="[^"]*" ?\/?>/,
        `<meta property="og:title" content="${meta.title}" />`
    );
    result = result.replace(
        /<meta property="og:description" content="[^"]*" ?\/?>/,
        `<meta property="og:description" content="${meta.description}" />`
    );

    // Twitter Card
    result = result.replace(
        /<meta name="twitter:url" content="[^"]*" ?\/?>/,
        `<meta name="twitter:url" content="${pageUrl}" />`
    );
    result = result.replace(
        /<meta name="twitter:title" content="[^"]*" ?\/?>/,
        `<meta name="twitter:title" content="${meta.title}" />`
    );
    result = result.replace(
        /<meta name="twitter:description" content="[^"]*" ?\/?>/,
        `<meta name="twitter:description" content="${meta.description}" />`
    );

    return result;
}

/**
 * 블로그 상세 페이지(/blog/:slug)용 메타 태그 주입
 * DB에서 포스트 정보를 가져와 동적으로 설정합니다.
 * 
 * @param {string} html - 원본 index.html 내용
 * @param {object} post - { title, excerpt, slug, thumbnail }
 * @returns {string} - 메타 태그가 교체된 HTML
 */
export function injectBlogPostMeta(html, post) {
    if (!post || !post.title) {
        return html;
    }

    const pageUrl = `${BASE_URL}/blog/${post.slug}`;
    const title = `${post.title} | STUDY M 교육연구소`;
    const description = post.excerpt || post.title;
    const image = post.thumbnail || `${BASE_URL}/og-image.png`;

    let result = html;

    // Title
    result = result.replace(
        /<title>[^<]*<\/title>/,
        `<title>${title}</title>`
    );

    // Meta description
    result = result.replace(
        /<meta name="description" content="[^"]*" ?\/?>/,
        `<meta name="description" content="${description}" />`
    );

    // Canonical URL
    result = result.replace(
        /<link rel="canonical" href="[^"]*" ?\/?>/,
        `<link rel="canonical" href="${pageUrl}" />`
    );

    // Open Graph
    result = result.replace(
        /<meta property="og:url" content="[^"]*" ?\/?>/,
        `<meta property="og:url" content="${pageUrl}" />`
    );
    result = result.replace(
        /<meta property="og:title" content="[^"]*" ?\/?>/,
        `<meta property="og:title" content="${title}" />`
    );
    result = result.replace(
        /<meta property="og:description" content="[^"]*" ?\/?>/,
        `<meta property="og:description" content="${description}" />`
    );
    result = result.replace(
        /<meta property="og:image" content="[^"]*" ?\/?>/,
        `<meta property="og:image" content="${image}" />`
    );

    // Twitter Card
    result = result.replace(
        /<meta name="twitter:url" content="[^"]*" ?\/?>/,
        `<meta name="twitter:url" content="${pageUrl}" />`
    );
    result = result.replace(
        /<meta name="twitter:title" content="[^"]*" ?\/?>/,
        `<meta name="twitter:title" content="${title}" />`
    );
    result = result.replace(
        /<meta name="twitter:description" content="[^"]*" ?\/?>/,
        `<meta name="twitter:description" content="${description}" />`
    );
    result = result.replace(
        /<meta name="twitter:image" content="[^"]*" ?\/?>/,
        `<meta name="twitter:image" content="${image}" />`
    );

    return result;
}

export default { injectSEOMeta, injectBlogPostMeta, PAGE_META };

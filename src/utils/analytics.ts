import ReactGA from 'react-ga4';

// Google Analytics 초기화
export const initGA = () => {
    // Google Analytics Measurement ID
    const measurementId = 'G-3B3YR4JYYS';

    if (measurementId) {
        ReactGA.initialize(measurementId);
        console.log('Google Analytics initialized');
    } else {
        console.warn('Google Analytics Measurement ID not configured');
    }
};

// 페이지 뷰 추적
export const logPageView = (path: string, title?: string) => {
    ReactGA.send({ hitType: 'pageview', page: path, title });
};

// 이벤트 추적
export const logEvent = (category: string, action: string, label?: string, value?: number) => {
    ReactGA.event({
        category,
        action,
        label,
        value,
    });
};

// 상담 신청 완료 이벤트
export const logConsultationSubmit = (success: boolean) => {
    logEvent(
        'Consultation',
        success ? 'Submit Success' : 'Submit Failed',
        success ? 'Consultation form submitted successfully' : 'Consultation form submission failed'
    );
};

// 가맹 문의 완료 이벤트
export const logFranchiseInquiry = (success: boolean) => {
    logEvent(
        'Franchise',
        success ? 'Inquiry Success' : 'Inquiry Failed',
        success ? 'Franchise inquiry submitted successfully' : 'Franchise inquiry submission failed'
    );
};

// 버튼 클릭 이벤트
export const logButtonClick = (buttonName: string, location: string) => {
    logEvent('Button', 'Click', `${buttonName} - ${location}`);
};

// 스크롤 이벤트
export const logScroll = (percentage: number) => {
    if (percentage === 25 || percentage === 50 || percentage === 75 || percentage === 100) {
        logEvent('Scroll', 'Depth', `${percentage}%`, percentage);
    }
};

/**
 * Mock Data for PE Style Admin Dashboard
 * Management by Exception: Only show students/inquiries that need attention
 */

export interface AlertStudent {
    id: string;
    name: string;
    grade: string;
    alertType: 'late' | 'sleeping' | 'low_performance';
    severity: 'red' | 'yellow';
    planVsActual: {
        plan: number; // 계획 학습 시간 (분)
        actual: number; // 실제 학습 시간 (분)
        gap: number; // 괴리율 (%)
    };
    recentIssues: string[];
    lastSeen: string;
}

export interface Inquiry {
    id: string;
    studentName: string;
    parentName: string;
    phone: string;
    targetUniversity: string;
    weakSubject: string;
    status: 'pending' | 'contacted' | 'registered';
    createdAt: string;
    notes?: string;
}

export interface FinancialMetrics {
    revenue: {
        current: number;
        target: number;
        percentage: number;
    };
    occupancyRate: number;
    momGrowth: number;
    dailyRevenue: Array<{ date: string; value: number }>;
}

// Alert Students (Management by Exception - Red/Yellow only)
export const mockAlertStudents: AlertStudent[] = [
    {
        id: 'AS001',
        name: '김민수',
        grade: '고3',
        alertType: 'low_performance',
        severity: 'red',
        planVsActual: {
            plan: 360, // 6시간
            actual: 180, // 3시간
            gap: 50, // 50% 미달성
        },
        recentIssues: ['성취율 45%', '3일 연속 목표 미달', '수학 진도 지연'],
        lastSeen: '2시간 전',
    },
    {
        id: 'AS002',
        name: '이서연',
        grade: '고2',
        alertType: 'sleeping',
        severity: 'red',
        planVsActual: {
            plan: 300,
            actual: 150,
            gap: 50,
        },
        recentIssues: ['졸음 3회 감지', '집중도 저하', '자습실 이탈 2회'],
        lastSeen: '10분 전',
    },
    {
        id: 'AS003',
        name: '박준혁',
        grade: '고3',
        alertType: 'late',
        severity: 'yellow',
        planVsActual: {
            plan: 420,
            actual: 300,
            gap: 29,
        },
        recentIssues: ['지각 1회', '성취율 71%'],
        lastSeen: '30분 전',
    },
    {
        id: 'AS004',
        name: '최유진',
        grade: '고1',
        alertType: 'low_performance',
        severity: 'yellow',
        planVsActual: {
            plan: 240,
            actual: 180,
            gap: 25,
        },
        recentIssues: ['성취율 75%', '영어 취약', '진도율 저조'],
        lastSeen: '1시간 전',
    },
];

// Inquiry Kanban Board
export const mockInquiries: Inquiry[] = [
    // Pending
    {
        id: 'INQ001',
        studentName: '정예린',
        parentName: '정재훈',
        phone: '010-1234-5678',
        targetUniversity: '연세대',
        weakSubject: '수학',
        status: 'pending',
        createdAt: '2025-12-14T09:30:00',
    },
    {
        id: 'INQ002',
        studentName: '강태민',
        parentName: '강성희',
        phone: '010-2345-6789',
        targetUniversity: '고려대',
        weakSubject: '영어',
        status: 'pending',
        createdAt: '2025-12-14T10:15:00',
    },

    // Contacted
    {
        id: 'INQ003',
        studentName: '송하은',
        parentName: '송민철',
        phone: '010-3456-7890',
        targetUniversity: '서울대',
        weakSubject: '과학',
        status: 'contacted',
        createdAt: '2025-12-13T14:20:00',
        notes: '12/15 방문 상담 예정',
    },
    {
        id: 'INQ004',
        studentName: '윤지호',
        parentName: '윤수연',
        phone: '010-4567-8901',
        targetUniversity: '성균관대',
        weakSubject: '국어',
        status: 'contacted',
        createdAt: '2025-12-13T16:45:00',
    },

    // Registered
    {
        id: 'INQ005',
        studentName: '한도윤',
        parentName: '한미영',
        phone: '010-5678-9012',
        targetUniversity: '한양대',
        weakSubject: '수학',
        status: 'registered',
        createdAt: '2025-12-12T11:00:00',
        notes: '12/20 입학 예정',
    },
];

// Financial KPI
export const mockFinancialMetrics: FinancialMetrics = {
    revenue: {
        current: 45800000, // 4,580만원
        target: 50000000, // 5,000만원
        percentage: 91.6,
    },
    occupancyRate: 87.5, // 가동률 87.5%
    momGrowth: 12.3, // 전월 대비 12.3% 성장
    dailyRevenue: [
        { date: '12/01', value: 1200000 },
        { date: '12/02', value: 1350000 },
        { date: '12/03', value: 1150000 },
        { date: '12/04', value: 1400000 },
        { date: '12/05', value: 1550000 },
        { date: '12/06', value: 1600000 },
        { date: '12/07', value: 1450000 },
        { date: '12/08', value: 1700000 },
        { date: '12/09', value: 1650000 },
        { date: '12/10', value: 1800000 },
        { date: '12/11', value: 1750000 },
        { date: '12/12', value: 1900000 },
        { date: '12/13', value: 1850000 },
        { date: '12/14', value: 2000000 },
    ],
};

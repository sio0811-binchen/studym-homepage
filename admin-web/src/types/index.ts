export interface User {
    id: string;
    email: string;
    name: string;
    phone: string;
    role: string;
    branchId: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Plan {
    id: string;
    subject: string;
    targetMin: number;
}

export interface Record {
    id: string;
    userId: string;
    subject: string;
    startTime: string;
    endTime: string | null;
    pureMin: number;
    pauseMin: number;
    drowsinessCount: number;
    user: {
        id: string;
        name: string;
        email: string;
    };
    plan?: Plan;
}

export interface DashboardStats {
    totalStudents: number;
    studyingNow: number;
    drowsinessDetected: number;
}

export interface StudentCardData {
    userId: string;
    name: string;
    currentSubject: string | null;
    status: 'studying' | 'completed' | 'drowsy' | 'offline';
    todayTotalMinutes: number;
    currentRecordId: string | null;
    startTime: string | null;
}

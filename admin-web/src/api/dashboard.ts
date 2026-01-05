import client from './client';

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    branchId: string;
}

interface Record {
    id: string;
    userId: string;
    subject: string;
    startTime: string;
    endTime: string | null;
    pureMin: number;
    drowsinessCount: number;  // Django API에서 drowsiness_count
}

interface DashboardStats {
    totalStudents: number;
    studyingNow: number;
    drowsinessDetected: number;
}

interface StudentCardData {
    userId: string;
    name: string;
    currentSubject: string | null;
    status: 'studying' | 'completed' | 'drowsy' | 'offline';
    todayTotalMinutes: number;
    currentRecordId: string | null;
    startTime: string | null;
}

export const fetchDashboardData = async () => {
    const [recordsResponse, usersResponse] = await Promise.all([
        client.get<Record[]>('/api/sessions/'),
        client.get<User[]>('/api/users/'),
    ]);

    const records = recordsResponse.data;
    const users = usersResponse.data;

    const students = users.filter(user => user.role === 'STUDENT');

    const stats: DashboardStats = {
        totalStudents: students.length,
        studyingNow: 0,
        drowsinessDetected: 0,
    };

    const studentCards: StudentCardData[] = students.map(student => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const studentRecords = records.filter(record => {
            if (record.userId !== student.id) return false;
            const recordDate = new Date(record.startTime);
            return recordDate >= today;
        });

        const currentRecord = studentRecords.find(r => !r.endTime);

        const todayTotalMinutes = studentRecords
            .filter(r => r.endTime)
            .reduce((sum, r) => sum + r.pureMin, 0);

        let status: StudentCardData['status'] = 'offline';
        if (currentRecord) {
            stats.studyingNow++;
            // Check for drowsiness (drowsinessCount > 0)
            if (currentRecord.drowsinessCount > 0) {
                status = 'drowsy';
                stats.drowsinessDetected++;
            } else {
                status = 'studying';
            }
        } else if (studentRecords.length > 0) {
            status = 'completed';
        }

        return {
            userId: student.id,
            name: student.name,
            currentSubject: currentRecord?.subject || null,
            status,
            todayTotalMinutes,
            currentRecordId: currentRecord?.id || null,
            startTime: currentRecord?.startTime || null,
        };
    });

    return {
        stats,
        students: studentCards,
    };
};

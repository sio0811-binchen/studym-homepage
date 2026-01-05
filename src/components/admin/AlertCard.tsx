import { motion } from 'framer-motion';
import { AlertCircle, Bell, User } from 'lucide-react';
import type { AlertStudent } from '../../utils/mockData';

interface AlertCardProps {
    student: AlertStudent;
    onNotifyParent: (studentId: string) => void;
    onWakeStudent: (studentId: string) => void;
}

const AlertCard = ({ student, onNotifyParent, onWakeStudent }: AlertCardProps) => {
    const getSeverityColor = () => {
        return student.severity === 'red'
            ? 'border-red-500 bg-red-50'
            : 'border-yellow-500 bg-yellow-50';
    };

    const getSeverityBadge = () => {
        return student.severity === 'red'
            ? 'bg-red-500 text-white'
            : 'bg-yellow-500 text-white';
    };

    const getAlertTypeLabel = () => {
        switch (student.alertType) {
            case 'late': return '지각';
            case 'sleeping': return '졸음';
            case 'low_performance': return '성취율 저조';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className={`p-6 rounded-2xl border-2 ${getSeverityColor()} shadow-lg transition-all cursor-pointer`}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center">
                        <User className="w-6 h-6 text-slate-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-brand-navy">{student.name}</h3>
                        <p className="text-sm text-slate-600">{student.grade}</p>
                    </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getSeverityBadge()}`}>
                    {getAlertTypeLabel()}
                </span>
            </div>

            {/* Plan vs Actual */}
            <div className="mb-4 p-4 bg-white rounded-lg">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Plan vs Actual</span>
                    <span className="text-2xl font-mono font-bold text-red-600">
                        {student.planVsActual.gap}% ↓
                    </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-slate-500">계획</p>
                        <p className="font-bold text-brand-navy">{student.planVsActual.plan}분</p>
                    </div>
                    <div>
                        <p className="text-slate-500">실제</p>
                        <p className="font-bold text-slate-700">{student.planVsActual.actual}분</p>
                    </div>
                </div>
            </div>

            {/* Issues */}
            <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-xs font-semibold text-slate-700">Recent Issues</span>
                </div>
                <div className="space-y-1">
                    {student.recentIssues.map((issue, idx) => (
                        <p key={idx} className="text-xs text-slate-600 bg-white px-2 py-1 rounded">
                            • {issue}
                        </p>
                    ))}
                </div>
            </div>

            {/* Last Seen */}
            <p className="text-xs text-slate-500 mb-4">마지막 확인: {student.lastSeen}</p>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onNotifyParent(student.id)}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-brand-navy text-white rounded-lg text-sm font-semibold hover:bg-brand-navy/90 transition-colors"
                >
                    <Bell className="w-4 h-4" />
                    <span>학부모 알림</span>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onWakeStudent(student.id)}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-brand-gold text-white rounded-lg text-sm font-semibold hover:bg-brand-gold/90 transition-colors"
                >
                    <AlertCircle className="w-4 h-4" />
                    <span>학생 깨우기</span>
                </motion.button>
            </div>
        </motion.div>
    );
};

export default AlertCard;

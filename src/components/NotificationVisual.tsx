import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Bell, Clock, UserCheck, AlertTriangle } from 'lucide-react';

type Notification = {
    id: number;
    title: string;
    message: string;
    time: string;
    type: 'success' | 'warning' | 'info';
};

const NOTIFICATIONS: Notification[] = [
    { id: 1, title: '등원 완료', message: '김민수 학생이 입실했습니다.', time: '08:00 AM', type: 'success' },
    { id: 2, title: '휴대폰 수거', message: '학습 전 휴대폰 제출 완료.', time: '08:05 AM', type: 'info' },
    { id: 3, title: '이석 경고', message: '20분 이상 장기 이석 감지됨.', time: '10:30 AM', type: 'warning' },
    { id: 4, title: '식사 시간', message: '점심 식사 시간입니다. (60분)', time: '12:00 PM', type: 'info' },
    { id: 5, title: '귀가 알림', message: '김민수 학생이 퇴실했습니다.', time: '10:00 PM', type: 'success' },
];

const NotificationVisual = () => {
    const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex < NOTIFICATIONS.length) {
                setVisibleNotifications(prev => {
                    const next = [...prev, NOTIFICATIONS[currentIndex]];
                    if (next.length > 3) next.shift(); // Keep only last 3
                    return next;
                });
                currentIndex++;
            } else {
                currentIndex = 0;
                setVisibleNotifications([]);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <UserCheck className="w-5 h-5 text-green-500" />;
            case 'warning': return <AlertTriangle className="w-5 h-5 text-red-500" />;
            default: return <Clock className="w-5 h-5 text-blue-500" />;
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto p-4 bg-slate-900/50 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden h-[400px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-brand-navy rounded-full flex items-center justify-center border border-white/20">
                        <Bell className="w-4 h-4 text-brand-gold" />
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-sm">Real-time Alert</h4>
                        <p className="text-xs text-slate-400">학부모 안심 알림 서비스</p>
                    </div>
                </div>
                <div className="text-xs text-slate-500 font-mono">LIVE</div>
            </div>

            {/* Notification List */}
            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {visibleNotifications.filter(n => n && n.type).map((noti) => (
                        <motion.div
                            key={noti.id}
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                            layout
                            className={`p-4 rounded-xl border backdrop-blur-md shadow-lg ${noti.type === 'warning'
                                ? 'bg-red-500/10 border-red-500/30'
                                : 'bg-slate-800/80 border-slate-700'
                                }`}
                        >
                            <div className="flex gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${noti.type === 'warning' ? 'bg-red-900/30' : 'bg-slate-900/50'
                                    }`}>
                                    {getIcon(noti.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h5 className={`font-bold text-sm truncate ${noti.type === 'warning' ? 'text-red-400' : 'text-white'
                                            }`}>{noti.title}</h5>
                                        <span className="text-[10px] text-slate-500">{noti.time}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 leading-relaxed max-w-[200px] truncate">{noti.message}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {visibleNotifications.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-600 text-xs">
                        시스템 동기화 중...
                    </div>
                )}
            </div>

            {/* Background Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-brand-gold/10 rounded-full blur-[50px] pointer-events-none"></div>
        </div>
    );
};

export default NotificationVisual;

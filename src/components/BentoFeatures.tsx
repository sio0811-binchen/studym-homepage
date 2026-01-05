import { motion } from 'framer-motion';
import { Clock, Brain, FileText, AlertCircle } from 'lucide-react';

const BentoFeatures = () => {
    const features = [
        {
            id: 1,
            title: "순공 타이머",
            subtitle: "Real-time Study Tracker",
            desc: "졸음 감지와 연동된 정확한 순공시간 측정. 목표 대비 실시간 달성률 표시.",
            icon: Clock,
            size: "large", // 2x2
            mockup: (
                <div className="mt-4 bg-brand-navy/80 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-brand-gold/20">
                    <div className="text-center mb-4">
                        <div className="text-3xl sm:text-4xl md:text-6xl font-bold text-brand-gold font-mono">
                            02:34:18
                        </div>
                        <div className="text-slate-400 text-xs sm:text-sm mt-2">오늘 순공 시간</div>
                    </div>
                    <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="text-slate-300">목표: 4시간</span>
                        <span className="text-success-teal font-bold">64% 달성</span>
                    </div>
                    <div className="mt-3 h-2 sm:h-3 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: '64%' }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full bg-gradient-to-r from-success-teal to-brand-gold"
                        />
                    </div>
                </div>
            )
        },
        {
            id: 2,
            title: "AI 코치",
            subtitle: "Gemini-Powered Assistant",
            desc: "학습 격차를 분석하고 즉시 조정 전략을 제안하는 AI 어시스턴트.",
            icon: Brain,
            size: "medium", // 1x2
            mockup: (
                <div className="mt-4 space-y-3">
                    <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none">
                        <p className="text-sm text-brand-navy">
                            오늘 수학 목표 달성이 힘들 것 같아요...
                        </p>
                    </div>
                    <div className="bg-gradient-to-r from-brand-gold to-yellow-500 p-4 rounded-2xl rounded-tr-none">
                        <p className="text-sm text-brand-navy font-medium">
                            남은 시간: 2시간 20분<br />
                            영어 시간 30분 줄이고 수학에 집중하면 85% 달성 가능합니다!
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 3,
            title: "부모 안심 리포트",
            subtitle: "AI Daily Report",
            desc: "Gemini가 분석한 학습 데이터를 매일 학부모님께 자동 전송.",
            icon: FileText,
            size: "medium", // 1x2
            mockup: (
                <div className="mt-4 bg-gradient-to-br from-white to-slate-50 p-5 rounded-2xl border border-slate-200 shadow-xl">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-success-teal rounded-full animate-pulse" />
                        <span className="text-xs font-bold text-slate-500">오늘의 리포트</span>
                    </div>
                    <p className="text-sm text-brand-navy leading-relaxed">
                        "오늘 수학 학습량은 부족했으나, <strong>집중도는 상위 5%</strong>였습니다.
                        내일은 환기 시간을 늘려 더 나은 성과를 지원하겠습니다."
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            AI
                        </div>
                        <span className="text-xs text-slate-400">Powered by Gemini</span>
                    </div>
                </div>
            )
        },
        {
            id: 4,
            title: "엄격 관리",
            subtitle: "Management by Exception",
            desc: "이슈 학생만 자동 필터링하여 매니저의 효율적 관리 지원.",
            icon: AlertCircle,
            size: "large", // 2x1
            mockup: (
                <div className="mt-4 grid grid-cols-2 gap-3">
                    {[
                        { name: "김OO", issue: "지각 10분", color: "red" },
                        { name: "이OO", issue: "졸음 감지", color: "orange" },
                    ].map((student, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.2 }}
                            className={`p-4 rounded-xl ${student.color === 'red' ? 'bg-alert-red' : 'bg-orange-500'} text-white`}
                        >
                            <div className="font-bold text-lg">{student.name}</div>
                            <div className="text-sm opacity-90">{student.issue}</div>
                            <button className="mt-3 w-full bg-white/20 hover:bg-white/30 py-2 rounded-lg text-xs font-medium transition-colors">
                                부모 알림 전송
                            </button>
                        </motion.div>
                    ))}
                </div>
            )
        }
    ];

    return (
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="text-brand-gold font-bold text-sm uppercase tracking-wider">
                        Core Functions
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-brand-navy mt-4 mb-6">
                        데이터가 만드는 <span className="text-brand-gold">완벽한 통제</span>
                    </h2>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                        시스템이 자동으로 측정하고, AI가 분석하고, 매니저가 즉시 개입합니다
                    </p>
                </motion.div>

                {/* Bento Grid - Asymmetric Layout */}
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={feature.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.15 }}
                            className={`
                                group relative overflow-hidden rounded-3xl p-8
                                bg-gradient-to-br from-white to-slate-50
                                border border-slate-200
                                hover:shadow-2xl hover:-translate-y-2
                                transition-all duration-300
                                ${feature.size === 'large' ? 'md:col-span-2' : 'md:col-span-1'}
                            `}
                            style={{
                                boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
                            }}
                        >
                            {/* Glassmorphism Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Icon */}
                            <div className="relative z-10 w-14 h-14 bg-brand-navy rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                {<feature.icon className="w-7 h-7 text-brand-gold" />}
                            </div>

                            {/* Content */}
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold text-brand-navy mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-brand-gold text-sm font-semibold mb-3">
                                    {feature.subtitle}
                                </p>
                                <p className="text-slate-600 mb-4">
                                    {feature.desc}
                                </p>

                                {/* Mockup */}
                                {feature.mockup}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BentoFeatures;

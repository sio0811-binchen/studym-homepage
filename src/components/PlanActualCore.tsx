import { motion } from 'framer-motion';
import { Target, Timer, TrendingUp, ChevronRight } from 'lucide-react';

const PlanActualCore = () => {
    const steps = [
        {
            icon: Target,
            step: 'Step 1. Plan',
            title: '막연함은 NO.',
            subtitle: '시간/분량별 정량 목표 설정',
            description: '오늘 수학 2시간이 아니라, 미적분 12페이지 + 문제 15개처럼 구체적으로 계획합니다.',
            highlight: false,
        },
        {
            icon: Timer,
            step: 'Step 2. Actual',
            title: '거짓 없는 기록.',
            subtitle: '아이의 진짜 공부 체력 확인',
            description: '실제로 얼마나 공부했는지, 어디서 막혔는지 솔직하게 기록합니다.',
            highlight: false,
        },
        {
            icon: TrendingUp,
            step: 'Step 3. Gap 분석',
            title: '성적 향상의 열쇠',
            subtitle: '계획과 실행의 차이를 분석',
            description: '왜 계획이 무너졌는지, 어떤 과목이 취약한지 데이터로 보여줍니다.',
            highlight: true, // 3번째 카드 강조
        },
    ];

    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="inline-block px-4 py-2 bg-brand-gold/10 text-brand-gold text-sm font-semibold rounded-full mb-4">
                            The Core Method
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-brand-navy mb-6">
                            성적 정체기, 원인은 '계획'과 '실행'의
                            <br className="hidden md:block" />
                            <span className="text-brand-gold"> 틈(Gap)</span>에 있습니다.
                        </h2>
                        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                            상위 1% 기업들이 쓰는 성과 관리 기법(PE Logic)을 학습에 적용했습니다.
                            <br />
                            3개월만 반복하면, 아이는 스스로 공부 습관을 만들어갑니다.
                        </p>
                    </motion.div>

                    {/* 3-Step Cards */}
                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {steps.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                                {/* Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.2 }}
                                    className={`flex-1 bg-white rounded-2xl p-8 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all ${item.highlight
                                        ? 'border-2 border-blue-500 bg-blue-50/30'
                                        : 'border border-slate-200'
                                        }`}
                                >
                                    {/* Icon */}
                                    <div
                                        className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${item.highlight
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-brand-gold/10 text-brand-gold'
                                            }`}
                                    >
                                        <item.icon className="w-8 h-8" />
                                    </div>

                                    {/* Step Label */}
                                    <div className="text-sm font-bold text-brand-gold mb-2">
                                        {item.step}
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-2xl font-bold text-brand-navy mb-4">
                                        {item.title}
                                        <br />
                                        <span className="text-lg text-slate-600 font-normal">
                                            {item.subtitle}
                                        </span>
                                    </h3>

                                    {/* Description */}
                                    <p className="text-slate-600 leading-relaxed">
                                        {item.description}
                                    </p>
                                </motion.div>

                                {/* Arrow (except last item) */}
                                {idx < steps.length - 1 && (
                                    <div className="hidden md:block">
                                        <ChevronRight className="w-8 h-8 text-brand-gold/40" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Plan vs Actual Progress Bars - NEW */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                        className="mt-16 bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-slate-200"
                    >
                        <div className="mb-8">
                            <h3 className="text-2xl md:text-3xl font-bold text-brand-navy mb-2">
                                Plan vs Actual 한눈에 보기
                            </h3>
                            <p className="text-slate-600">
                                예시: 한 학생의 주간 학습 데이터입니다. Gap이 클수록 개선이 시급합니다.
                            </p>
                        </div>

                        <div className="space-y-8">
                            {[
                                { label: '주간 완전 학습', plan: 100, actual: 94, color: 'bg-amber-500' },
                                { label: '생활 루틴 이행', plan: 100, actual: 98, color: 'bg-amber-500' },
                                { label: '순공 시간 확보', plan: 100, actual: 85, color: 'bg-amber-500' },
                            ].map((metric, idx) => {
                                const gap = metric.plan - metric.actual;
                                return (
                                    <div key={idx}>
                                        <div className="flex justify-between text-sm mb-3 font-medium">
                                            <span className="text-brand-navy">{metric.label}</span>
                                            <div className="flex items-center gap-4">
                                                <span className="text-blue-600">Plan: {metric.plan}%</span>
                                                <span className="text-brand-gold font-bold">Actual: {metric.actual}%</span>
                                                <span className="text-red-600 font-bold">GAP: -{gap}%</span>
                                            </div>
                                        </div>
                                        <div className="relative h-10 bg-slate-100 rounded-full overflow-hidden">
                                            {/* Plan Bar (Ghost - Dashed Border) */}
                                            <div className="absolute top-0 left-0 h-full w-full border-2 border-dashed border-slate-300 rounded-full"></div>

                                            {/* Actual Bar */}
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${metric.actual}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1, delay: idx * 0.2 }}
                                                className={`absolute top-0 left-0 h-full ${metric.color} rounded-full`}
                                            ></motion.div>

                                            {/* Gap Indicator (Red Pattern) */}
                                            <div
                                                className="absolute top-0 h-full bg-red-500/10 border-l-2 border-red-500"
                                                style={{ left: `${metric.actual}%`, width: `${gap}%` }}
                                            >
                                                <div className="h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(239,68,68,0.1)_10px,rgba(239,68,68,0.1)_20px)]"></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-xl">
                            <p className="text-sm text-red-800 font-medium">
                                <span className="font-bold">Gap 분석 결과</span>: 순공 시간 확보율이 85%로 가장 낮습니다.
                                집중력 관리와 휴대폰 사용 통제가 필요합니다.
                            </p>
                        </div>
                    </motion.div>

                    {/* Bottom Highlight Box */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8 }}
                        className="mt-16 p-8 bg-gradient-to-r from-brand-navy to-slate-800 rounded-2xl text-white text-center shadow-xl"
                    >
                        <p className="text-xl md:text-2xl font-semibold">
                            이 과정을 3개월만 반복하면, 아이는 스스로
                            <br className="hidden md:block" />
                            <span className="text-brand-gold"> "뭘 공부해야 하는지 아는 학생"</span>으로 성장합니다.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default PlanActualCore;

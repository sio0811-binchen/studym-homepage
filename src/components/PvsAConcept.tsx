import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Clock, AlertTriangle, Bot } from 'lucide-react';

const PvsAConcept = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Gap closes as user scrolls
    const gapWidth = useTransform(scrollYProgress, [0, 0.5, 1], [100, 20, 0]);

    const features = [
        {
            title: "실시간 측정",
            desc: "초 단위로 순공시간을 정확히 기록",
            icon: Clock
        },
        {
            title: "위기감 조성",
            desc: "달성률 70% 미만 시 붉은 경고",
            icon: AlertTriangle
        },
        {
            title: "자동 코칭",
            desc: "AI가 격차 해소 전략 제안",
            icon: Bot
        }
    ];

    return (
        <section ref={containerRef} className="py-24 bg-gradient-to-br from-brand-navy to-slate-900 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5"
                style={{ backgroundImage: 'radial-gradient(circle, #F59E0B 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-5xl mx-auto"
                >
                    <div className="text-center mb-16">
                        <span className="text-brand-gold font-bold text-sm uppercase tracking-wider">
                            Core Philosophy
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
                            Plan vs Actual
                        </h2>
                        <p className="text-slate-300 text-lg">
                            계획과 실행의 격차를 시각화하고, 시스템이 자동으로 줄여갑니다
                        </p>
                    </div>

                    {/* Interactive Circle Visualization */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-16">
                        {/* Plan Circle */}
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, type: 'spring' }}
                            className="relative"
                        >
                            <div className="w-48 h-48 rounded-full border-8 border-brand-gold flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-brand-gold">Plan</div>
                                    <div className="text-sm text-slate-300 mt-2">계획</div>
                                </div>
                            </div>
                            <div className="absolute -top-3 -right-3 bg-brand-gold text-brand-navy px-3 py-1 rounded-full text-xs font-bold">
                                목표 40시간
                            </div>
                        </motion.div>

                        {/* Gap Indicator with Animation */}
                        <motion.div className="flex flex-col items-center">
                            <motion.div
                                style={{ width: gapWidth }}
                                className="h-1 bg-alert-red rounded-full mb-2"
                            />
                            <motion.div
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="text-alert-red font-bold text-sm"
                            >
                                Gap
                            </motion.div>
                            <div className="text-slate-400 text-xs mt-1">격차</div>
                        </motion.div>

                        {/* Actual Circle */}
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, type: 'spring' }}
                            className="relative"
                        >
                            <div className="w-48 h-48 rounded-full border-8 border-slate-400 flex items-center justify-center opacity-70">
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-slate-300">Actual</div>
                                    <div className="text-sm text-slate-400 mt-2">실행</div>
                                </div>
                            </div>
                            <div className="absolute -top-3 -right-3 bg-alert-red text-white px-3 py-1 rounded-full text-xs font-bold">
                                실제 28시간
                            </div>
                        </motion.div>
                    </div>

                    {/* Key Features Grid */}
                    <div className="grid md:grid-cols-3 gap-6">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.15 }}
                                className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-all"
                            >
                                <div className="w-12 h-12 bg-brand-gold/20 rounded-xl flex items-center justify-center mb-4">
                                    <feature.icon className="w-6 h-6 text-brand-gold" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-slate-400 text-sm">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default PvsAConcept;


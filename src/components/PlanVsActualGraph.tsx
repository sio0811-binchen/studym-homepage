import { useEffect, useRef } from 'react';
import { motion, useSpring, useTransform, useInView } from 'framer-motion';

const data = [
    { label: '주간 완전 학습', plan: 100, actual: 94, gap: 6 },
    { label: '생활 루틴 이행', plan: 100, actual: 98, gap: 2 },
    { label: '순공 시간 확보', plan: 100, actual: 85, gap: 15 },
];

const Counter = ({ value }: { value: number }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
    const rounded = useTransform(spring, (latest) => Math.round(latest));
    const isInView = useInView(ref, { once: true, margin: "-20px" });

    useEffect(() => {
        if (isInView) {
            spring.set(value);
        }
    }, [isInView, value, spring]);

    return <motion.span ref={ref}>{rounded}</motion.span>;
};

const PlanVsActualGraph = () => {
    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-slate-900/50 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h3 className="text-white text-lg font-bold tracking-wider">PERFORMANCE METRICS</h3>
                    <p className="text-slate-400 text-sm mt-1">계획(Plan) vs 실행(Actual) 갭 분석</p>
                </div>
                <div className="flex gap-4 text-xs font-mono">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-slate-700/50 rounded-sm border border-slate-600"></div>
                        <span className="text-slate-400">PLAN</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-brand-gold rounded-sm shadow-[0_0_10px_rgba(197,160,89,0.5)]"></div>
                        <span className="text-brand-gold font-bold">ACTUAL</span>
                    </div>
                </div>
            </div>

            {/* Graph Area */}
            <div className="space-y-8">
                {data.map((item, index) => (
                    <motion.div
                        key={index}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.6 }}
                        variants={{
                            hidden: { opacity: 0, x: -20 },
                            visible: { opacity: 1, x: 0, transition: { delay: index * 0.2, duration: 0.5 } }
                        }}
                        className="relative"
                    >
                        {/* Labels & Values */}
                        <div className="flex justify-between text-sm font-medium mb-2">
                            <span className="text-slate-300">{item.label}</span>
                            <div className="flex gap-1 text-brand-gold">
                                <Counter value={item.actual} />
                                <span>%</span>
                            </div>
                        </div>

                        {/* Bar Container */}
                        <div className="h-10 bg-slate-800/50 rounded-lg relative overflow-hidden ring-1 ring-white/5">
                            {/* Plan Marker (The 100% Line) */}
                            <div className="absolute right-0 top-0 bottom-0 w-px bg-white/10 z-10 dashed opacity-50"></div>

                            {/* Actual Bar (Animated) */}
                            <motion.div
                                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-brand-gold/80 to-brand-gold shadow-[0_0_20px_rgba(197,160,89,0.3)]"
                                variants={{
                                    hidden: { width: "0%" },
                                    visible: {
                                        width: `${item.actual}%`,
                                        transition: { type: "spring", stiffness: 60, damping: 15, delay: index * 0.2 }
                                    }
                                }}
                            >
                                {/* Shine Effect */}
                                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
                            </motion.div>

                            {/* Gap Visualization (Red zone for missing %) */}
                            <motion.div
                                className="absolute right-0 top-0 bottom-0 bg-red-500/20 striped-pattern"
                                style={{ width: `${item.gap}%` }}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1, transition: { delay: (index * 0.2) + 1.2 } }}
                                viewport={{ once: true }}
                            />
                        </div>

                        {/* Tooltip Popup */}
                        <motion.div
                            className="absolute -top-10 right-0 bg-red-500/90 text-white text-xs font-bold px-2 py-1 rounded shadow-lg backdrop-blur"
                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1, transition: { delay: (index * 0.2) + 1.5, type: 'spring' } }}
                            viewport={{ once: true }}
                        >
                            GAP -{item.gap}%
                            <div className="absolute bottom-[-4px] right-4 w-2 h-2 bg-red-500/90 rotate-45"></div>
                        </motion.div>
                    </motion.div>
                ))}
            </div>

            {/* Bottom Legend / Insight */}
            <motion.div
                className="mt-10 pt-6 border-t border-white/10 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 2.5 }}
            >
                <p className="text-slate-400 text-sm">
                    <span className="text-brand-gold font-bold">Insight:</span> "측정되지 않는 것은 관리될 수 없다."<br />
                    매일의 Gap을 줄이는 것이 성적 상승의 핵심입니다.
                </p>
            </motion.div>

            <style>{`
                .striped-pattern {
                    background-image: linear-gradient(45deg, rgba(239, 68, 68, 0.15) 25%, transparent 25%, transparent 50%, rgba(239, 68, 68, 0.15) 50%, rgba(239, 68, 68, 0.15) 75%, transparent 75%, transparent);
                    background-size: 10px 10px;
                }
            `}</style>
        </div>
    );
};

export default PlanVsActualGraph;

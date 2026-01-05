import { motion } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';

const InteractiveCharts = () => {
    const pvaData = [
        { subject: '국어', plan: 5, actual: 4.5 },
        { subject: '수학', plan: 5, actual: 3 },
        { subject: '영어', plan: 4, actual: 4.2 },
        { subject: '과탐1', plan: 3, actual: 2.5 },
        { subject: '과탐2', plan: 3, actual: 2.8 },
    ];

    return (
        <section className="py-24 bg-gradient-to-br from-slate-900 to-brand-navy text-white">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="text-brand-gold font-bold text-sm uppercase tracking-wider">
                        Data Visualization
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
                        데이터로 증명하는 <span className="text-brand-gold">관리력</span>
                    </h2>
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                        Plan vs Actual 분석으로 성적 향상을 과학적으로 추적합니다
                    </p>
                </motion.div>

                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
                    {/* P vs A Radar Chart */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10"
                    >
                        <h3 className="text-2xl font-bold mb-6 text-center">P vs A Radar Chart</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <RadarChart data={pvaData}>
                                <PolarGrid stroke="#fff" strokeOpacity={0.2} />
                                <PolarAngleAxis dataKey="subject" stroke="#fff" />
                                <Radar name="Plan" dataKey="plan" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} />
                                <Radar name="Actual" dataKey="actual" stroke="#FF4D4F" fill="#FF4D4F" fillOpacity={0.5} />
                            </RadarChart>
                        </ResponsiveContainer>
                        <div className="mt-6 flex justify-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-brand-gold rounded-full" />
                                <span>Plan (목표)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-alert-red rounded-full" />
                                <span>Actual (실행)</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Achievement Gauge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10"
                    >
                        <h3 className="text-2xl font-bold mb-6 text-center">Achievement Gauge</h3>
                        <div className="relative w-64 h-64 mx-auto">
                            {/* Circular Progress */}
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="128"
                                    cy="128"
                                    r="110"
                                    fill="none"
                                    stroke="rgba(255,255,255,0.1)"
                                    strokeWidth="20"
                                />
                                <motion.circle
                                    cx="128"
                                    cy="128"
                                    r="110"
                                    fill="none"
                                    stroke="url(#gradient)"
                                    strokeWidth="20"
                                    strokeLinecap="round"
                                    initial={{ strokeDasharray: "0 691" }}
                                    whileInView={{ strokeDasharray: "485 691" }} // 70% = 0.7 * 691
                                    transition={{ duration: 2, ease: "easeOut" }}
                                />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#FF4D4F" />
                                        <stop offset="100%" stopColor="#F59E0B" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <div className="text-6xl font-bold text-brand-gold">68%</div>
                                <div className="text-sm text-slate-300 mt-2">목표 달성률</div>
                                <div className="text-xs text-alert-red mt-1 font-semibold animate-pulse">
                                    70% 미만 경고
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Ranking Widget */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="md:col-span-2 bg-gradient-to-r from-brand-gold/20 to-alert-red/20 backdrop-blur-md p-8 rounded-3xl border border-brand-gold/30"
                    >
                        <h3 className="text-2xl font-bold mb-6 text-center">Targeted Ranking</h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { label: '타겟 그룹', value: '재수생', desc: '전체 120명' },
                                { label: '내 순위', value: '상위 35%', desc: '42등 / 120명' },
                                { label: '격차', value: '-3시간', desc: '상위 10%까지' },
                            ].map((stat, idx) => (
                                <div key={idx} className="text-center">
                                    <div className="text-sm text-slate-300 mb-2">{stat.label}</div>
                                    <div className="text-3xl font-bold text-brand-gold mb-1">{stat.value}</div>
                                    <div className="text-xs text-slate-400">{stat.desc}</div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 p-4 bg-white/10 rounded-xl text-center">
                            <p className="text-sm">
                                💡 <strong>상위 10% 진입을 위해</strong> 하루 1시간 추가 학습이 필요합니다
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default InteractiveCharts;

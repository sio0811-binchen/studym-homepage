import { motion } from 'framer-motion';
import { User, Shield, BarChart3 } from 'lucide-react';

const PersonaSections = () => {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="text-brand-gold font-bold text-sm uppercase tracking-wider">
                        For Everyone
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-brand-navy mt-4 mb-6">
                        모두를 위한 <span className="text-brand-gold">맞춤 경험</span>
                    </h2>
                </motion.div>

                <div className="max-w-7xl mx-auto space-y-16">
                    {/* Student Section - Crisis */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 gap-12 items-center"
                    >
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <User className="w-8 h-8 text-alert-red" />
                                <h3 className="text-3xl font-bold text-brand-navy">학생 - 위기감</h3>
                            </div>
                            <p className="text-2xl font-bold text-alert-red mb-4">불편해야 공부한다</p>
                            <p className="text-slate-600 text-lg mb-6">
                                데이터가 보여주는 냉정한 현실. 달성률 70% 미만 시 화면 전체가 붉게 변하며 즉각적인 행동 변화를 유도합니다.
                            </p>
                            <ul className="space-y-3 text-slate-700">
                                <li className="flex items-start gap-2">
                                    <span className="text-alert-red mt-1">●</span>
                                    <span>다크 모드 기본 제공 - 장시간 학습에 최적화</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-alert-red mt-1">●</span>
                                    <span>실시간 P vs A 그래프 - 격차를 시각적으로 인지</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-alert-red mt-1">●</span>
                                    <span>타겟 그룹 랭킹 - "재수생 상위 10%보다 3시간 부족"</span>
                                </li>
                            </ul>
                        </div>
                        <div className="relative">
                            {/* Dark Mode Preview */}
                            <div className="bg-gradient-to-br from-slate-900 to-brand-navy p-8 rounded-3xl shadow-2xl border-4 border-alert-red/30">
                                <div className="text-center mb-6">
                                    <div className="text-5xl font-bold text-white mb-2">68%</div>
                                    <div className="text-alert-red font-semibold animate-pulse">달성률 미달</div>
                                </div>
                                <div className="space-y-3">
                                    {['국어', '수학', '영어'].map((subject, idx) => (
                                        <div key={idx} className="bg-white/5 p-3 rounded-lg">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-slate-300">{subject}</span>
                                                <span className="text-alert-red">-40분</span>
                                            </div>
                                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${60 + idx * 10}%` }}
                                                    transition={{ delay: idx * 0.2 }}
                                                    className="h-full bg-alert-red"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Parent Section - Trust */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 gap-12 items-center"
                    >
                        <div className="order-2 md:order-1">
                            {/* Light Professional UI */}
                            <div className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-3xl shadow-2xl border border-slate-200">
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-sm font-semibold text-slate-500">오늘의 리포트</span>
                                    <span className="text-xs bg-success-teal/10 text-success-teal px-3 py-1 rounded-full font-bold">AI 분석</span>
                                </div>
                                <div className="bg-white p-5 rounded-2xl shadow-sm mb-4">
                                    <p className="text-brand-navy text-sm leading-relaxed">
                                        "오늘 총 순공시간 <strong className="text-brand-gold">6시간 20분</strong>으로 목표를 초과 달성했습니다.
                                        수학 집중도가 지난주 대비 15% 향상되었으며, 꾸준한 성장세를 보이고 있습니다."
                                    </p>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { label: '순공시간', value: '6h 20m', good: true },
                                        { label: '집중도', value: '92%', good: true },
                                        { label: '지각', value: '0회', good: true },
                                    ].map((stat, idx) => (
                                        <div key={idx} className="bg-slate-50 p-3 rounded-xl text-center">
                                            <div className={`text-xl font-bold ${stat.good ? 'text-success-teal' : 'text-alert-red'}`}>
                                                {stat.value}
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2">
                            <div className="flex items-center gap-3 mb-4">
                                <Shield className="w-8 h-8 text-success-teal" />
                                <h3 className="text-3xl font-bold text-brand-navy">학부모 - 신뢰</h3>
                            </div>
                            <p className="text-2xl font-bold text-success-teal mb-4">보여야 안심한다</p>
                            <p className="text-slate-600 text-lg mb-6">
                                금융 앱 수준의 전문적인 리포트. AI가 분석한 정성적 코멘트로 학부모의 불안을 해소합니다.
                            </p>
                            <ul className="space-y-3 text-slate-700">
                                <li className="flex items-start gap-2">
                                    <span className="text-success-teal mt-1">●</span>
                                    <span>실시간 입퇴실 알림 - 센터 도착 즉시 Push</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-success-teal mt-1">●</span>
                                    <span>AI 일일 리포트 - 데이터 + 인사이트 자동 생성</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-success-teal mt-1">●</span>
                                    <span>투명한 소통 - 학생/매니저와 3자 채팅</span>
                                </li>
                            </ul>
                        </div>
                    </motion.div>

                    {/* Manager Section - Efficiency */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 gap-12 items-center"
                    >
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <BarChart3 className="w-8 h-8 text-brand-gold" />
                                <h3 className="text-3xl font-bold text-brand-navy">매니저 - 효율</h3>
                            </div>
                            <p className="text-2xl font-bold text-brand-gold mb-4">시스템이 일한다</p>
                            <p className="text-slate-600 text-lg mb-6">
                                1명이 200명을 관리. 이슈가 있는 학생만 자동 필터링되어 즉시 조치 가능합니다.
                            </p>
                            <ul className="space-y-3 text-slate-700">
                                <li className="flex items-start gap-2">
                                    <span className="text-brand-gold mt-1">●</span>
                                    <span>예외 관리 - 정상 학생은 숨기고 이슈만 표시</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-brand-gold mt-1">●</span>
                                    <span>원터치 액션 - 부모 알림, 학생 깨우기 즉시 실행</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-brand-gold mt-1">●</span>
                                    <span>AI 답장 제안 - Gemini가 3가지 답변 옵션 생성</span>
                                </li>
                            </ul>
                        </div>
                        <div className="relative">
                            {/* Dashboard Preview */}
                            <div className="bg-gradient-to-br from-brand-navy to-slate-800 p-6 rounded-3xl shadow-2xl">
                                <div className="text-white font-bold mb-4 flex items-center justify-between">
                                    <span>이슈 학생</span>
                                    <span className="text-alert-red">3명</span>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { name: '김OO', issue: '지각 15분', color: 'bg-alert-red' },
                                        { name: '이OO', issue: '졸음 감지', color: 'bg-orange-500' },
                                        { name: '박OO', issue: '달성률 45%', color: 'bg-yellow-500' },
                                    ].map((student, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.15 }}
                                            className={`${student.color} p-4 rounded-xl text-white`}
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-bold">{student.name}</span>
                                                <span className="text-sm">{student.issue}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="flex-1 bg-white/20 py-2 rounded-lg text-xs font-medium hover:bg-white/30">
                                                    알림
                                                </button>
                                                <button className="flex-1 bg-white/20 py-2 rounded-lg text-xs font-medium hover:bg-white/30">
                                                    상담
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default PersonaSections;

import { motion } from 'framer-motion';
import { BarChart3, Eye, Bell, FileText, CheckCircle, TrendingUp } from 'lucide-react';
import Navbar from '../components/layout/Navbar';

const DiagnosisPage = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            {/* Hero */}
            <section className="py-20 pt-32 bg-gradient-to-br from-brand-navy to-slate-900 text-white">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            학습 정밀 진단
                        </h1>
                        <p className="text-xl text-slate-300">
                            Plan vs Actual 분석으로 정확하게, 시스템으로 관리하기
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl font-bold text-brand-navy mb-4">
                                진단 & 처방 프로세스
                            </h2>
                            <p className="text-lg text-slate-600">
                                3단계 시스템으로 정확하게 관리합니다
                            </p>
                        </motion.div>

                        <div className="space-y-8">
                            {[
                                {
                                    step: '1단계',
                                    title: '정밀 진단',
                                    icon: <Eye className="w-10 h-10" />,
                                    desc: '학습 시간, 집중도, 과목별 투입 시간을 QR 체크인으로 자동 추적',
                                    color: 'from-blue-500 to-blue-600'
                                },
                                {
                                    step: '2단계',
                                    title: 'Plan vs Actual 분석',
                                    icon: <BarChart3 className="w-10 h-10" />,
                                    desc: '목표 대비 실제 달성률을 실시간으로 시각화하여 격차 확인',
                                    color: 'from-brand-gold to-amber-500'
                                },
                                {
                                    step: '3단계',
                                    title: '자동 알림 & 개입',
                                    icon: <Bell className="w-10 h-10" />,
                                    desc: '목표 미달 시 학생, 학부모, 담임에게 자동 알림 발송',
                                    color: 'from-red-500 to-red-600'
                                }
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.2 }}
                                    className="flex items-start gap-6 p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-slate-200"
                                >
                                    <div className={`p-4 bg-gradient-to-br ${item.color} text-white rounded-xl flex-shrink-0`}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <div className="text-sm text-brand-gold font-semibold mb-2">{item.step}</div>
                                        <h3 className="text-2xl font-bold text-brand-navy mb-3">{item.title}</h3>
                                        <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-4xl font-bold text-brand-navy mb-4">
                                핵심 기능
                            </h2>
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { icon: <CheckCircle className="w-8 h-8" />, title: 'QR 체크인', desc: '자동 출결 및 시간 기록' },
                                { icon: <TrendingUp className="w-8 h-8" />, title: '실시간 대시보드', desc: '학생별 학습 현황 한눈에' },
                                { icon: <FileText className="w-8 h-8" />, title: '주간 리포트', desc: '데이터 기반 학습 분석' }
                            ].map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all"
                                >
                                    <div className="text-brand-gold mb-4">{feature.icon}</div>
                                    <h3 className="text-xl font-bold text-brand-navy mb-2">{feature.title}</h3>
                                    <p className="text-slate-600">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-brand-navy to-slate-900 text-white">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <h2 className="text-4xl font-bold mb-6">
                            지금 바로 진단하세요
                        </h2>
                        <p className="text-xl text-slate-300 mb-8">
                            우리 아이의 학습 상태를 정확히 파악하고 맞춤 관리를 받으세요
                        </p>
                        <a
                            href="/#consultation"
                            className="inline-block px-10 py-4 bg-brand-gold text-brand-navy font-bold text-lg rounded-xl hover:bg-amber-400 transition-all shadow-2xl hover:scale-105"
                        >
                            무료 진단 신청하기
                        </a>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default DiagnosisPage;

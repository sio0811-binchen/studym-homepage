import { motion } from 'framer-motion';
import { Target, Eye, BarChart3, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Features = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-slate-900">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-white max-w-4xl mx-auto"
                    >
                        <p className="text-slate-400 text-sm tracking-widest uppercase mb-4">
                            Core System
                        </p>
                        <h1 className="text-3xl md:text-5xl font-light mb-6">
                            Plan vs Actual System
                        </h1>
                        <div className="w-16 h-px bg-slate-600 mx-auto mb-8"></div>
                        <p className="text-xl text-slate-300 font-light">
                            "계획은 누구나 세웁니다.<br />
                            차이는 <span className="text-white font-medium">'실행(Actual)'의 관리</span>에서 나옵니다."
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Feature 1: Plan */}
            <section className="py-20 border-b border-slate-100">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 bg-slate-900 rounded flex items-center justify-center">
                                    <Target className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-widest">Step 01</p>
                                    <h2 className="text-2xl font-medium text-slate-900">Plan (목표 설계)</h2>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-slate-50 rounded-lg p-8">
                                    <h3 className="font-medium text-slate-900 mb-3">Life-Cycle Planning</h3>
                                    <p className="text-slate-600 text-[15px] leading-relaxed">
                                        단순한 주간 시간표가 아닙니다. 입시부터 취업까지,
                                        학생의 <strong>생애 주기 관점</strong>에서 오늘의 학습 목표를 할당합니다.
                                    </p>
                                </div>

                                <div className="bg-slate-50 rounded-lg p-8">
                                    <h3 className="font-medium text-slate-900 mb-3">Budgeting (시간 예산)</h3>
                                    <p className="text-slate-600 text-[15px] leading-relaxed">
                                        기업이 예산을 짜듯, 학생의 가용 시간을 <strong>'자본금'</strong>으로 정의하고
                                        과목별 투입 전략을 수립합니다.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Feature 2: Actual */}
            <section className="py-20 border-b border-slate-100 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 bg-slate-900 rounded flex items-center justify-center">
                                    <Eye className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-widest">Step 02</p>
                                    <h2 className="text-2xl font-medium text-slate-900">Actual (실행 통제) with AI 시스템</h2>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-white rounded-lg p-8 border border-slate-200">
                                    <h3 className="font-medium text-slate-900 mb-3">Vision AI Monitoring</h3>
                                    <p className="text-slate-600 text-[15px] leading-relaxed">
                                        계획된 시간에 실제로 공부하고 있는지, Edge AI 카메라가
                                        <strong>0.1초 단위</strong>로 'Actual Data(순공 여부)'를 감지합니다.
                                    </p>
                                </div>

                                <div className="bg-white rounded-lg p-8 border border-slate-200">
                                    <h3 className="font-medium text-slate-900 mb-3">Real-time Nudge</h3>
                                    <p className="text-slate-600 text-[15px] leading-relaxed">
                                        졸음이나 딴짓으로 실행 오차가 발생하면, 매니저가 아닌
                                        <strong>AI 시스템이 즉각 개입</strong>(조명/진동)하여 본궤도로 돌려놓습니다.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Feature 3: Review */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 bg-slate-900 rounded flex items-center justify-center">
                                    <BarChart3 className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-widest">Step 03</p>
                                    <h2 className="text-2xl font-medium text-slate-900">Review (성과 분석)</h2>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-slate-50 rounded-lg p-8">
                                    <h3 className="font-medium text-slate-900 mb-3">Variance Analysis (차이 분석)</h3>
                                    <p className="text-slate-600 text-[15px] leading-relaxed">
                                        PE가 월간 보고서를 쓰듯, 계획(Plan) 대비 실제 학습(Actual)의 차이를 분석한
                                        <strong>'AI 경영 리포트'</strong>를 매일 제공합니다.
                                    </p>
                                </div>

                                <div className="bg-slate-50 rounded-lg p-8">
                                    <h3 className="font-medium text-slate-900 mb-3">Feedback Loop</h3>
                                    <p className="text-slate-600 text-[15px] leading-relaxed">
                                        "왜 계획을 못 지켰는가?"에 대한 원인을 데이터로 규명하고,
                                        다음 날의 계획을 수정하여 <strong>성취율을 100%</strong>로 끌어올립니다.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-slate-900">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-slate-400 mb-4">Study M의 운영 방식이 궁금하신가요?</p>
                    <Link
                        to="/manual"
                        className="inline-flex items-center gap-2 text-white hover:text-slate-300 transition-colors"
                    >
                        운영지침 안내 보기 <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Features;

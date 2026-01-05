import { motion } from 'framer-motion';
import { Target, TrendingUp, BarChart3, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const StoryPage = () => {
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
                            Brand Story
                        </p>
                        <h1 className="text-3xl md:text-5xl font-light mb-8 leading-tight">
                            우리는 왜 티칭이 아닌,<br />
                            <span className="text-white font-medium">진단하고 코칭</span>하는가?
                        </h1>
                        <div className="w-16 h-px bg-slate-600 mx-auto"></div>
                    </motion.div>
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <p className="text-xs text-slate-500 uppercase tracking-widest mb-4">Philosophy</p>
                            <h2 className="text-2xl md:text-3xl font-light text-slate-900 mb-10">
                                티칭이 아닌 <span className="font-medium">코칭</span>
                            </h2>

                            <div className="space-y-6 text-slate-600 text-[16px] leading-[1.9]">
                                <p>
                                    일반 스터디공간은 자리만 제공합니다. 하지만 우리는 <strong className="text-slate-900">진단하고 코칭</strong>합니다.
                                </p>
                                <p>
                                    왜? 성적 향상의 핵심은 '더 많이 티칭하는 것'이 아니라
                                    <strong className="text-slate-900">'정확히 진단하고 시스템을 제공하는 것'</strong>이기 때문입니다.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Comparison Section */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-white border border-slate-200 rounded-lg p-8">
                                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-4">Traditional</p>
                                    <h3 className="text-xl font-medium text-slate-900 mb-4">일반 스터디공간</h3>
                                    <ul className="space-y-3 text-slate-600 text-[15px]">
                                        <li className="pl-4 border-l-2 border-slate-200">강의 중심</li>
                                        <li className="pl-4 border-l-2 border-slate-200">일방적 티칭</li>
                                        <li className="pl-4 border-l-2 border-slate-200">성적은 학생 책임</li>
                                    </ul>
                                </div>

                                <div className="bg-slate-900 text-white rounded-lg p-8">
                                    <p className="text-xs text-slate-400 uppercase tracking-widest mb-4">Study M</p>
                                    <h3 className="text-xl font-medium mb-4">Plan vs Actual 시스템</h3>
                                    <ul className="space-y-3 text-slate-300 text-[15px]">
                                        <li className="pl-4 border-l-2 border-slate-600">진단 중심</li>
                                        <li className="pl-4 border-l-2 border-slate-600">시스템 코칭</li>
                                        <li className="pl-4 border-l-2 border-slate-600">데이터 기반 성과 관리</li>
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mb-16"
                        >
                            <p className="text-xs text-slate-500 uppercase tracking-widest mb-4">Core Values</p>
                            <h2 className="text-2xl md:text-3xl font-light text-slate-900">
                                Study M의 핵심 가치
                            </h2>
                        </motion.div>

                        <div className="space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="flex gap-6"
                            >
                                <div className="w-12 h-12 bg-slate-900 rounded flex items-center justify-center flex-shrink-0">
                                    <Target className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-slate-900 mb-2">정밀 진단</h3>
                                    <p className="text-slate-600 text-[15px] leading-relaxed">
                                        PE가 기업을 인수할 때 가장 먼저 하는 일은 '실사(Due Diligence)'입니다.
                                        우리는 학생의 학습 습관, 집중력, 취약 영역을 정밀하게 진단합니다.
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="flex gap-6"
                            >
                                <div className="w-12 h-12 bg-slate-900 rounded flex items-center justify-center flex-shrink-0">
                                    <TrendingUp className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-slate-900 mb-2">실행 통제</h3>
                                    <p className="text-slate-600 text-[15px] leading-relaxed">
                                        계획은 누구나 세웁니다. 차이는 실행에서 나옵니다.
                                        AI 학습 관리 시스템이 계획 대비 실제 학습을 0.1초 단위로 추적합니다.
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="flex gap-6"
                            >
                                <div className="w-12 h-12 bg-slate-900 rounded flex items-center justify-center flex-shrink-0">
                                    <BarChart3 className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-slate-900 mb-2">성과 분석</h3>
                                    <p className="text-slate-600 text-[15px] leading-relaxed">
                                        PE가 매월 경영 리포트를 작성하듯, 우리는 매일 AI 분석 리포트를 제공합니다.
                                        Plan vs Actual 차이 분석으로 다음 날 전략을 수정합니다.
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-slate-900">
                <div className="container mx-auto px-6">
                    <div className="max-w-2xl mx-auto text-center">
                        <p className="text-slate-400 mb-4">CEO의 이야기가 궁금하신가요?</p>
                        <Link
                            to="/about"
                            className="inline-flex items-center gap-2 text-white hover:text-slate-300 transition-colors"
                        >
                            회사 소개 보기 <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default StoryPage;

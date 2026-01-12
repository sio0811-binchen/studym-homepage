import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const CompanyAbout = () => {
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
                            경영 철학 (Philosophy)
                        </p>
                        <h1 className="text-3xl md:text-5xl font-light mb-8 leading-tight">
                            기업가치를 10배로 키우던 원칙,<br />
                            이제 <span className="text-white font-medium">학생의 미래가치</span>에 투자합니다.
                        </h1>
                        <div className="w-16 h-px bg-slate-600 mx-auto"></div>
                    </motion.div>
                </div>
            </section>

            {/* CEO Message */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <p className="text-xs text-slate-500 uppercase tracking-widest mb-4">CEO Message (대표 인사말)</p>
                            <h2 className="text-2xl md:text-3xl font-light text-slate-900 mb-10 leading-relaxed">
                                "인생에도 재무제표가 있다면,<br />
                                당신의 아이는 성장하고 있습니까?"
                            </h2>

                            <div className="space-y-6 text-slate-600 text-[16px] leading-[1.9]">
                                <p>
                                    안녕하십니까, Study M 대표 박윤완입니다.
                                </p>

                                <p>
                                    저는 지난 18년간 Global Private Equity(PE)의 전문경영인으로서
                                    수많은 기업을 인수하고 경영했습니다.
                                </p>

                                <p>
                                    PE가 기업을 인수할 때 목표는 단 하나입니다.
                                    기업가치를 2~3배가 아닌, <strong className="text-slate-900">5배, 10배로 키워 매각</strong>하는 것입니다.
                                    이를 위해 우리는 치열하게 계획(Plan)을 수립하고, 매일매일 실행 결과(Actual)를 비교하며,
                                    오차를 줄여나가는 과정을 끊임없이 반복합니다.
                                </p>

                                <div className="bg-slate-50 border-l-4 border-slate-900 p-6 my-8">
                                    <p className="text-slate-800 font-medium">
                                        하지만 정작 우리 아이들의 현실은 어떻습니까?
                                    </p>
                                    <p className="text-slate-600 mt-2">
                                        초중고 12년, 재수, N수, 군대, 편입, 그리고 취업 준비까지...
                                        명확한 계획 없이 막연한 '열심히'만 강요받으며, 소중한 20대까지
                                        '수험생'이라는 이름으로 정체되어 있는 모습을 볼 때마다 깊은 안타까움을 느꼈습니다.
                                    </p>
                                </div>

                                <p className="text-slate-900 font-medium text-lg">
                                    공부도 기업 경영과 똑같습니다.<br />
                                    목표 없는 공부는 밑 빠진 독에 물 붓기입니다.
                                </p>

                                <p>
                                    Study M은 기업가치를 올리던 <strong className="text-slate-900">Plan vs Actual 경영 기법</strong>을
                                    입시에 그대로 이식했습니다. 삼성전자 출신 기술진이 만든 AI 시스템이
                                    실행 과정(Actual)을 빈틈없이 기록하고, 전문경영인의 노하우로 성과를 분석합니다.
                                </p>

                                <p className="text-slate-900">
                                    12년의 방황을 끝내고, 아이의 미래가치(Future Value)가 J커브를 그리며 폭발하는 그 시작점.
                                </p>
                            </div>

                            <div className="mt-12 pt-8 border-t border-slate-200">
                                <p className="text-slate-900 font-medium text-lg mb-2">
                                    여기는 단순한 스터디공간이 아닌,<br />
                                    '학생의 인생을 경영하는 곳' Study M입니다.
                                </p>
                                <p className="text-slate-500 mt-6">
                                    대표이사 박윤완
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-slate-900">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-slate-400 mb-4">Plan vs Actual 시스템이 궁금하신가요?</p>
                    <Link
                        to="/features"
                        className="inline-flex items-center gap-2 text-white hover:text-slate-300 transition-colors"
                    >
                        기능 소개 보기 <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default CompanyAbout;

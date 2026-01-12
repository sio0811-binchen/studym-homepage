import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, TrendingUp, ArrowRight } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const StandardPage = () => {
    const navigate = useNavigate();

    const handleCTA = () => {
        navigate('/#consultation', { state: { program: 'Standard Membership' } });
        setTimeout(() => {
            document.getElementById('consultation')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const features = [
        { icon: Clock, title: "지정석 보장", desc: "본인만의 공간에서 집중력 극대화" },
        { icon: CheckCircle, title: "생활 관리", desc: "출결/졸음/휴대폰 통제 시스템" },
        { icon: TrendingUp, title: "순공시간 30% 향상", desc: "데이터 기반 즉시 개선" }
    ];

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-brand-navy to-slate-900 text-white py-32 overflow-hidden">
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle, #F59E0B 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <span className="text-brand-gold font-bold text-sm uppercase tracking-wider">Standard Membership</span>
                        <h1 className="text-5xl md:text-6xl font-bold mt-6 mb-8 leading-tight">
                            의지력은 고갈되지만,<br />
                            <span className="text-brand-gold">시스템은 지치지 않습니다.</span>
                        </h1>
                        <p className="text-xl text-slate-300 mb-12">
                            자기주도학습을 원하지만 환경과 통제가 필요한 학생을 위한 최적의 솔루션
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Problems & Solutions */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <span className="text-alert-red font-bold text-sm uppercase">문제점</span>
                                <h2 className="text-3xl font-bold text-brand-navy mt-4 mb-6">
                                    우리 아이는 왜 안 될까?
                                </h2>
                                <ul className="space-y-4 text-slate-600">
                                    <li className="flex items-start gap-3">
                                        <span className="text-red-500 mt-1">✗</span>
                                        <span>집에서는 유혹이 너무 많아요 (게임, TV, 침대...)</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-red-500 mt-1">✗</span>
                                        <span>일반 스터디공간은 자리가 없거나 불편해요</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-red-500 mt-1">✗</span>
                                        <span>혼자서는 휴대폰을 멀리할 수가 없어요</span>
                                    </li>
                                </ul>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <span className="text-success-teal font-bold text-sm uppercase">우리의 해결책</span>
                                <h2 className="text-3xl font-bold text-brand-navy mt-4 mb-6">
                                    이렇게 관리합니다
                                </h2>
                                <ul className="space-y-4 text-slate-700">
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-500 mt-1">✓</span>
                                        <span><strong>전용 지정석</strong> - 개인 사물함, 조명, 쾌적한 환경</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-500 mt-1">✓</span>
                                        <span><strong>입퇴실 알림</strong> - 학부모님께 실시간 알림</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-500 mt-1">✓</span>
                                        <span><strong>휴대폰 보관함</strong> - 강제 수거로 집중력 보장</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-500 mt-1">✓</span>
                                        <span><strong>졸음 관리</strong> - 실시간 모니터링 및 알림</span>
                                    </li>
                                </ul>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Visual Evidence */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <h2 className="text-4xl font-bold text-brand-navy mb-4">즉시 확인 가능한 효과</h2>
                        <p className="text-slate-600 text-lg">데이터가 증명하는 학습 환경의 힘</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="group bg-gradient-to-br from-brand-navy to-slate-800 text-white p-8 rounded-2xl shadow-2xl backdrop-blur-sm border border-white/10 hover:shadow-brand-gold/20 hover:-translate-y-2 transition-all duration-300"
                            >
                                <div className="w-14 h-14 bg-brand-gold/20 rounded-full flex items-center justify-center mb-6">
                                    {<feature.icon className="w-7 h-7 text-brand-gold" />}
                                </div>
                                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-slate-300">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-16 max-w-3xl mx-auto bg-brand-gold/10 border-l-4 border-brand-gold p-8 rounded-r-2xl">
                        <p className="text-lg text-brand-navy font-bold mb-2">
                            실제 데이터 (입소 1주 후)
                        </p>
                        <p className="text-slate-700 text-xl">
                            순공시간: <span className="text-green-600 font-bold text-2xl">+30%</span> 향상<br />
                            휴대폰 사용: <span className="text-red-600 font-bold text-2xl">-80%</span> 감소
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-br from-brand-navy to-slate-900 text-white">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            지금 시작하세요
                        </h2>
                        <p className="text-xl text-slate-300 mb-12">
                            상담 신청 후 24시간 내 전문 컨설턴트가 연락드립니다
                        </p>
                        <button
                            onClick={handleCTA}
                            className="px-12 py-5 bg-brand-gold text-brand-navy font-bold text-lg rounded-xl hover:bg-yellow-500 transition-all transform hover:scale-105 shadow-2xl shadow-brand-gold/20 flex items-center justify-center gap-3 mx-auto"
                        >
                            이 프로그램으로 상담받기 <ArrowRight className="w-6 h-6" />
                        </button>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default StandardPage;

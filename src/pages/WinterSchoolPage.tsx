import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, Coffee, Moon, Sun, ArrowRight, AlertTriangle } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const WinterSchoolPage = () => {
    const navigate = useNavigate();

    const handleCTA = () => {
        navigate('/#consultation', { state: { program: 'Deep Focus Term' } });
        setTimeout(() => {
            document.getElementById('consultation')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const dailySchedule = [
        { time: "08:00", activity: "입실 & 오전 학습 시작", icon: Sun },
        { time: "12:00", activity: "점심 식사", icon: Coffee },
        { time: "13:00", activity: "오후 집중 학습", icon: Clock },
        { time: "18:00", activity: "저녁 식사", icon: Coffee },
        { time: "19:00", activity: "야간 몰입 학습", icon: Moon },
        { time: "22:00", activity: "퇴실", icon: Moon }
    ];

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            {/* Hero Section with Urgency */}
            <section className="relative bg-gradient-to-br from-brand-navy via-slate-900 to-brand-navy text-white py-32 overflow-hidden">
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle, #F59E0B 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                </div>

                {/* Urgency Badge */}
                <div className="absolute top-8 right-8 z-20">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: 'spring' }}
                        className="bg-red-600 text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2"
                    >
                        <AlertTriangle className="w-5 h-5" />
                        조기 마감 주의
                    </motion.div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <span className="text-brand-gold font-bold text-sm uppercase tracking-wider">Deep Focus Term - Winter School</span>
                        <h1 className="text-5xl md:text-6xl font-bold mt-6 mb-8 leading-tight">
                            아침 8시부터 밤 10시까지,<br />
                            <span className="text-brand-gold">인생을 바꾸는 14시간의 기적</span>
                        </h1>
                        <p className="text-xl text-slate-300 mb-12">
                            방학 동안 드라마틱한 변화를 원하는 학생을 위한 집중 프로그램
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
                                    방학이 두려우신가요?
                                </h2>
                                <ul className="space-y-4 text-slate-600">
                                    <li className="flex items-start gap-3">
                                        <span className="text-red-500 mt-1">✗</span>
                                        <span>"방학이 끝나면 오히려 성적이 떨어져요"</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-red-500 mt-1">✗</span>
                                        <span>"집에서는 게임만 하고 공부를 안 해요"</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-red-500 mt-1">✗</span>
                                        <span>"강의만 듣고 나머지 시간은 낭비돼요"</span>
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
                                    14시간 풀타임 관리
                                </h2>
                                <ul className="space-y-4 text-slate-700">
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-500 mt-1">✓</span>
                                        <span><strong>08:00 - 22:00</strong> - 아침 입실부터 밤 퇴실까지 완벽 통제</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-500 mt-1">✓</span>
                                        <span><strong>식사 제공</strong> - 점심/저녁 제공으로 시간 낭비 제로</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-green-500 mt-1">✓</span>
                                        <span><strong>휴대폰 차단</strong> - 14시간 동안 완벽한 몰입 환경</span>
                                    </li>
                                </ul>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Daily Routine Table */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-brand-navy mb-4">하루 일과표</h2>
                            <p className="text-slate-600 text-lg">빈틈없는 14시간 루틴</p>
                        </div>

                        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl shadow-2xl p-8 md:p-12 border border-slate-200">
                            <div className="space-y-4">
                                {dailySchedule.map((schedule, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="flex items-center gap-6 bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow"
                                    >
                                        <div className="w-16 h-16 bg-brand-navy rounded-full flex items-center justify-center flex-shrink-0">
                                            {<schedule.icon className="w-8 h-8 text-brand-gold" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-brand-gold font-bold text-lg">{schedule.time}</div>
                                            <div className="text-brand-navy font-semibold text-xl">{schedule.activity}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-8 p-6 bg-brand-gold/10 border-l-4 border-brand-gold rounded-r-xl">
                                <p className="text-brand-navy font-bold text-xl mb-2">
                                    = 순공시간 <span className="text-3xl">10시간+</span> 보장
                                </p>
                                <p className="text-slate-600">
                                    식사 시간 제외, 실제 학습에만 집중하는 10시간 이상 확보
                                </p>
                            </div>
                        </div>

                        {/* Results */}
                        <div className="mt-16 grid md:grid-cols-3 gap-6">
                            {[
                                { label: "윈터스쿨 기간", value: "4주" },
                                { label: "총 학습 시간", value: "280시간+" },
                                { label: "학생 만족도", value: "98%" }
                            ].map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.15 }}
                                    className="bg-gradient-to-br from-brand-navy to-slate-800 text-white p-8 rounded-2xl shadow-2xl text-center"
                                >
                                    <div className="text-brand-gold text-4xl font-bold mb-2">{stat.value}</div>
                                    <div className="text-slate-300">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section with Urgency */}
            <section className="py-24 bg-gradient-to-br from-brand-navy to-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-red-600/10"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <div className="inline-block mb-6 px-6 py-2 bg-red-600 rounded-full font-bold text-sm animate-pulse">
                            선착순 30명 한정
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            이번 겨울이 마지막 기회입니다
                        </h2>
                        <p className="text-xl text-slate-300 mb-12">
                            개학 전 완벽한 준비로 새 학기 1등급 시작하세요
                        </p>
                        <button
                            onClick={handleCTA}
                            className="px-12 py-5 bg-brand-gold text-brand-navy font-bold text-lg rounded-xl hover:bg-yellow-500 transition-all transform hover:scale-105 shadow-2xl shadow-brand-gold/20 flex items-center justify-center gap-3 mx-auto"
                        >
                            지금 바로 상담 신청하기 <ArrowRight className="w-6 h-6" />
                        </button>
                        <p className="text-sm text-slate-400 mt-6">* 조기 마감 시 대기 리스트 운영</p>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default WinterSchoolPage;

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Target, LineChart, Users, ArrowRight, AlertCircle } from 'lucide-react';

const WeeklyPage = () => {
    const navigate = useNavigate();

    const handleCTA = () => {
        navigate('/#consultation', { state: { program: 'Weekly Consulting' } });
        setTimeout(() => {
            document.getElementById('consultation')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-brand-navy via-slate-900 to-brand-navy text-white py-32 overflow-hidden">
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle, #F59E0B 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <span className="text-brand-gold font-bold text-sm uppercase tracking-wider">Weekly Consulting</span>
                        <h1 className="text-5xl md:text-6xl font-bold mt-6 mb-8 leading-tight">
                            열심(Hard Work)과<br />
                            <span className="text-brand-gold">전략(Strategy)은 다릅니다.</span>
                        </h1>
                        <p className="text-xl text-slate-300 mb-12">
                            열심히는 하는데 성적이 안 오르는 학생을 위한 메타인지 코칭
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
                                    이런 고민 있으신가요?
                                </h2>
                                <ul className="space-y-4 text-slate-600">
                                    <li className="flex items-start gap-3">
                                        <AlertCircle className="text-red-500 w-5 h-5 mt-1 flex-shrink-0" />
                                        <span>"공부는 열심히 하는데 성적이 안 올라요"</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <AlertCircle className="text-red-500 w-5 h-5 mt-1 flex-shrink-0" />
                                        <span>"계획은 세우는데 왜 안 지켜질까요?"</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <AlertCircle className="text-red-500 w-5 h-5 mt-1 flex-shrink-0" />
                                        <span>"어디서부터 손대야 할지 모르겠어요"</span>
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
                                    주 1회 전략 리뷰
                                </h2>
                                <ul className="space-y-4 text-slate-700">
                                    <li className="flex items-start gap-3">
                                        <LineChart className="text-green-500 w-5 h-5 mt-1 flex-shrink-0" />
                                        <span><strong>Plan vs Actual 분석</strong> - 계획 대비 실제 학습 패턴 시각화</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Target className="text-green-500 w-5 h-5 mt-1 flex-shrink-0" />
                                        <span><strong>맞춤 전략 수립</strong> - 데이터 기반 다음 주 액션플랜</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Users className="text-green-500 w-5 h-5 mt-1 flex-shrink-0" />
                                        <span><strong>1:1 전문 컨설턴트</strong> - 매주 같은 매니저가 관리</span>
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
                        <h2 className="text-4xl font-bold text-brand-navy mb-4">실제 컨설팅 리포트</h2>
                        <p className="text-slate-600 text-lg">매주 받아보는 데이터 기반 학습 분석</p>
                    </div>

                    {/* Plan vs Actual Graph Mockup */}
                    <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-50 to-slate-100 p-12 rounded-3xl shadow-2xl border border-slate-200 mb-12">
                        <h3 className="text-2xl font-bold text-brand-navy mb-8 text-center">
                            이번 주 학습 분석 리포트
                        </h3>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white p-6 rounded-xl shadow">
                                <div className="text-sm text-slate-500 mb-2">계획 시간</div>
                                <div className="text-4xl font-bold text-brand-navy">40시간</div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow">
                                <div className="text-sm text-slate-500 mb-2">실제 시간</div>
                                <div className="text-4xl font-bold text-success-teal">38시간</div>
                            </div>
                        </div>
                        <div className="mt-8 p-6 bg-brand-gold/10 border-l-4 border-brand-gold rounded-r-xl">
                            <p className="text-brand-navy font-bold mb-2">✓ 컨설턴트 코멘트</p>
                            <p className="text-slate-700">
                                "계획 대비 95% 달성! 수학 문제 풀이 시간이 예상보다 길어졌습니다.
                                다음 주는 개념 이해 후 문제 풀이 권장합니다."
                            </p>
                        </div>
                    </div>

                    {/* Weekly Cycle */}
                    <div className="max-w-3xl mx-auto">
                        <h3 className="text-2xl font-bold text-brand-navy mb-8 text-center">주간 컨설팅 사이클</h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { step: "Mon", title: "계획 수립", desc: "이번 주 목표 설정" },
                                { step: "Thu", title: "중간 점검", desc: "진행 상황 확인" },
                                { step: "Sun", title: "1:1 리뷰", desc: "데이터 분석 & 피드백" }
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.15 }}
                                    className="bg-brand-navy text-white p-6 rounded-xl shadow-lg"
                                >
                                    <div className="text-brand-gold font-bold text-sm mb-2">{item.step}</div>
                                    <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                                    <p className="text-slate-300 text-sm">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
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
                            전략이 바뀌면 성적이 바뀝니다
                        </h2>
                        <p className="text-xl text-slate-300 mb-12">
                            이번 주부터 달라지는 학습 경험을 시작하세요
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
        </div>
    );
};

export default WeeklyPage;

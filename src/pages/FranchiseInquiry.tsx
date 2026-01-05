import { motion } from 'framer-motion';
import { useState } from 'react';
import { TrendingUp, Users, Shield, CheckCircle, ArrowRight, MapPin } from 'lucide-react';

const FranchiseInquiry = () => {
    const [formData, setFormData] = useState({
        applicant_name: '',
        phone: '',
        email: '',
        region: '',
        budget: '',
        has_property: false,
        education_experience: '',
    });

    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('https://study-manager-production-826b.up.railway.app/api/franchise/inquire/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSubmitted(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (error) {
            console.error('Error:', error);
            alert('문의 접수 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    const highlights = [
        {
            icon: TrendingUp,
            title: '검증된 수익 모델',
            desc: '파일럿 지점 순수익률 35% 달성',
            color: 'text-brand-gold',
        },
        {
            icon: Users,
            title: '표준화된 운영',
            desc: '관리자 1명이 200명 관리 가능',
            color: 'text-success-teal',
        },
        {
            icon: Shield,
            title: '종합 지원 시스템',
            desc: '입지 분석부터 매니저 교육까지',
            color: 'text-brand-gold',
        },
    ];

    if (submitted) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-2xl w-full text-center"
                >
                    <div className="w-24 h-24 bg-success-teal/10 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle className="w-16 h-16 text-success-teal" />
                    </div>
                    <h1 className="text-4xl font-bold text-brand-navy mb-4">
                        가맹 문의가 접수되었습니다
                    </h1>
                    <p className="text-xl text-slate-600 mb-8">
                        담당자 검토 후 24시간 내에 연락드리겠습니다.
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="px-8 py-3 bg-brand-navy text-white rounded-xl hover:bg-brand-gold transition-colors"
                    >
                        홈으로 돌아가기
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-brand-navy to-slate-900 text-white py-24">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            검증된 수익 모델,<br />
                            <span className="text-brand-gold">함께 성장하세요</span>
                        </h1>
                        <p className="text-xl text-slate-300 mb-8">
                            Space to SaaS 비전으로 차별화된 관리형 스터디카페 프랜차이즈
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Investment Highlights */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-4xl font-bold text-brand-navy text-center mb-16">
                            Study M의 경쟁력
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {highlights.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.15 }}
                                    className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all"
                                >
                                    <div className={`w-16 h-16 ${item.color} bg-opacity-10 rounded-full flex items-center justify-center mb-6`}>
                                        <item.icon className={`w-8 h-8 ${item.color}`} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-brand-navy mb-3">{item.title}</h3>
                                    <p className="text-slate-600">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* 수익성 데이터 */}
                        <div className="mt-16 bg-gradient-to-br from-brand-navy to-slate-800 p-12 rounded-3xl text-white">
                            <h3 className="text-3xl font-bold mb-8 text-center">파일럿 지점 실제 성과</h3>
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="text-center">
                                    <div className="text-5xl font-bold text-brand-gold mb-2">200명</div>
                                    <div className="text-slate-300">평균 재원생</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-5xl font-bold text-brand-gold mb-2">35%</div>
                                    <div className="text-slate-300">순수익률</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-5xl font-bold text-brand-gold mb-2">95%</div>
                                    <div className="text-slate-300">재등록률</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Inquiry Form */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-4xl font-bold text-brand-navy text-center mb-4">
                            가맹 문의하기
                        </h2>
                        <p className="text-slate-600 text-center mb-12">
                            상세한 사업 설명서와 함께 24시간 내 연락드리겠습니다
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* 신청자 정보 */}
                            <div>
                                <label className="block text-brand-navy font-semibold mb-2">
                                    신청자 성함 <span className="text-alert-red">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.applicant_name}
                                    onChange={(e) => setFormData({ ...formData, applicant_name: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold"
                                    placeholder="홍길동"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-brand-navy font-semibold mb-2">
                                        연락처 <span className="text-alert-red">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold"
                                        placeholder="010-1234-5678"
                                    />
                                </div>
                                <div>
                                    <label className="block text-brand-navy font-semibold mb-2">
                                        이메일
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold"
                                        placeholder="example@email.com"
                                    />
                                </div>
                            </div>

                            {/* 창업 계획 */}
                            <div>
                                <label className="block text-brand-navy font-semibold mb-2">
                                    <MapPin className="inline w-5 h-5 mr-1" />
                                    창업 희망 지역 <span className="text-alert-red">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.region}
                                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold"
                                    placeholder="예: 서울 강남구 대치동"
                                />
                            </div>

                            <div>
                                <label className="block text-brand-navy font-semibold mb-2">
                                    투자 가능 예산 <span className="text-alert-red">*</span>
                                </label>
                                <select
                                    required
                                    value={formData.budget}
                                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold"
                                >
                                    <option value="">선택하세요</option>
                                    <option value="UNDER_200M">2억 미만</option>
                                    <option value="200M_300M">2-3억</option>
                                    <option value="OVER_300M">3억 이상</option>
                                </select>
                            </div>

                            <div>
                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={formData.has_property}
                                        onChange={(e) => setFormData({ ...formData, has_property: e.target.checked })}
                                        className="w-5 h-5 text-brand-gold focus:ring-brand-gold rounded"
                                    />
                                    <span className="text-brand-navy font-semibold">적합한 점포를 이미 보유하고 있습니다</span>
                                </label>
                            </div>

                            <div>
                                <label className="block text-brand-navy font-semibold mb-2">
                                    교육업 경험 (선택)
                                </label>
                                <textarea
                                    value={formData.education_experience}
                                    onChange={(e) => setFormData({ ...formData, education_experience: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold"
                                    rows={4}
                                    placeholder="스터디카페 운영, 교육 서비스 경영 등 관련 경험을 자유롭게 작성해주세요"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full px-8 py-4 bg-brand-gold text-brand-navy font-bold text-lg rounded-xl hover:bg-yellow-500 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                            >
                                가맹 문의 접수하기 <ArrowRight className="w-6 h-6" />
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl font-bold text-brand-navy text-center mb-12">
                            자주 묻는 질문
                        </h2>
                        <div className="space-y-6">
                            {[
                                {
                                    q: '최소 투자 금액은 얼마인가요?',
                                    a: '입지와 규모에 따라 다르지만, 평균적으로 3.5억 원 내외의 초기 투자가 필요합니다. (보증금, 인테리어, 집기 포함)',
                                },
                                {
                                    q: '손익분기점은 언제인가요?',
                                    a: '파일럿 지점 기준, 개원 후 6개월 내 손익분기점에 도달했습니다. 입지와 운영 역량에 따라 차이가 있을 수 있습니다.',
                                },
                                {
                                    q: '교육업 경험이 없어도 가능한가요?',
                                    a: '가능합니다. 입지 선정부터 매니저 교육, 시스템 운영까지 본사에서 종합 지원합니다.',
                                },
                            ].map((faq, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-white p-6 rounded-xl shadow"
                                >
                                    <h3 className="text-xl font-bold text-brand-navy mb-3">Q. {faq.q}</h3>
                                    <p className="text-slate-600">A. {faq.a}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FranchiseInquiry;

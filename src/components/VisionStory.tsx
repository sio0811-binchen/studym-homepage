import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const VisionStory = () => {
    const features = [
        { category: "핵심 가치", old: "공간 제공", new: "데이터 기반 성적 관리" },
        { category: "측정 방식", old: "단순 시간 체크", new: "Plan vs Actual 시각화" },
        { category: "관리 주체", old: "관리자 의존적", new: "시스템 자동화" },
        { category: "결과 추적", old: "측정 불가", new: "성적 향상 강제" },
        { category: "학부모 소통", old: "문의 시에만", new: "AI 일일 리포트 자동 발송" },
    ];

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-5xl mx-auto"
                >
                    <div className="text-center mb-16">
                        <span className="text-brand-gold font-bold text-sm uppercase tracking-wider">
                            Vision Story
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-brand-navy mt-4 mb-6">
                            Space → <span className="text-brand-gold">SaaS</span>
                        </h2>
                        <p className="text-slate-600 text-lg sm:text-xl">
                            단순한 공간 임대를 넘어, 데이터 기반 교육 플랫폼으로
                        </p>
                    </div>

                    {/* Comparison Table */}
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl p-6 md:p-12 shadow-2xl border border-slate-200">
                        {/* Desktop: Grid Table */}
                        <div className="hidden md:grid md:grid-cols-3 gap-6">
                            {/* Header */}
                            <div className="text-slate-500 font-semibold text-sm uppercase tracking-wider">
                                구분
                            </div>
                            <div className="text-slate-500 font-semibold text-sm uppercase tracking-wider">
                                일반 스터디카페
                            </div>
                            <div className="text-brand-gold font-semibold text-sm uppercase tracking-wider">
                                STUDY M
                            </div>

                            {/* Rows */}
                            {features.map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="contents"
                                >
                                    <div className="bg-white p-4 rounded-lg font-medium text-brand-navy">
                                        {feature.category}
                                    </div>
                                    <div className="bg-white p-4 rounded-lg text-slate-600 flex items-center gap-2">
                                        <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                                        <span>{feature.old}</span>
                                    </div>
                                    <div className="bg-gradient-to-r from-brand-gold/10 to-brand-gold/5 p-4 rounded-lg text-brand-navy font-semibold flex items-center gap-2 border border-brand-gold/20">
                                        <Check className="w-5 h-5 text-success-teal flex-shrink-0" />
                                        <span>{feature.new}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Mobile: Card Stack */}
                        <div className="md:hidden space-y-6">
                            {features.map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white rounded-xl p-5 shadow-md"
                                >
                                    <div className="font-bold text-brand-navy mb-4 text-lg">
                                        {feature.category}
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                                            <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <div className="text-sm text-slate-500 mb-1">일반 스터디카페</div>
                                                <div className="text-slate-700 text-base">{feature.old}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 p-3 bg-brand-gold/10 rounded-lg border border-brand-gold/30">
                                            <Check className="w-5 h-5 text-success-teal flex-shrink-0 mt-0.5" />
                                            <div>
                                                <div className="text-sm text-brand-gold mb-1 font-semibold">STUDY M</div>
                                                <div className="text-brand-navy font-semibold text-base">{feature.new}</div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>


                        {/* Bottom Highlight */}
                        <div className="mt-8 p-6 bg-brand-navy rounded-xl text-white text-center">
                            <p className="text-lg font-bold mb-2">
                                STUDY M의 차별점
                            </p>
                            <p className="text-slate-300">
                                CEO와 CTO의 현장 운영 노하우를 100% 알고리즘화하여,
                                지점별 관리자 역량 차이 없이 균일한 품질을 보장합니다.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default VisionStory;

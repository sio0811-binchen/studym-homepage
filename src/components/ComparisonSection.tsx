import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

const ComparisonSection = () => {
    const comparisons = [
        {
            problem: '엑셀 파일 관리',
            solution: '클라우드 통합 관리',
            problems: ['파일 분실 위험', '동기화 오류', '버전 관리 어려움'],
            solutions: ['자동 백업', '실시간 동기화', '변경 이력 추적'],
        },
        {
            problem: '수기 출결 체크',
            solution: 'QR 자동 출결',
            problems: ['누락 및 오기입', '시간 낭비', '통계 산출 어려움'],
            solutions: ['자동 기록', '1초 처리', '실시간 분석'],
        },
        {
            problem: '학부모 개별 연락',
            solution: '자동 알림 시스템',
            problems: ['시간 소모', '누락 발생', '기록 부재'],
            solutions: ['자동 전송', '일괄 관리', '발송 이력'],
        },
        {
            problem: '학습 계획 수립',
            solution: 'Plan vs Actual 분석',
            problems: ['주관적 판단', '진도 파악 어려움', '효과 측정 불가'],
            solutions: ['데이터 기반', '실시간 진도', '성과 가시화'],
        },
    ];

    return (
        <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold text-slate-900 mb-4">
                        왜 <span className="text-brand-gold">STUDY M</span>인가?
                    </h2>
                    <p className="text-xl text-slate-600">
                        기존 관리 방식의 한계를 완전히 극복합니다
                    </p>
                </motion.div>

                {/* Comparison Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {comparisons.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden"
                        >
                            {/* Header */}
                            <div className="grid grid-cols-2 divide-x divide-slate-200">
                                <div className="px-6 py-4 bg-red-50">
                                    <div className="flex items-center space-x-2">
                                        <XCircle className="text-red-500" size={20} />
                                        <span className="font-semibold text-slate-700">기존 방식</span>
                                    </div>
                                    <p className="text-sm text-slate-600 mt-1">{item.problem}</p>
                                </div>
                                <div className="px-6 py-4 bg-green-50">
                                    <div className="flex items-center space-x-2">
                                        <CheckCircle2 className="text-green-500" size={20} />
                                        <span className="font-semibold text-slate-700">Study M</span>
                                    </div>
                                    <p className="text-sm text-brand-gold font-medium mt-1">{item.solution}</p>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="grid grid-cols-2 divide-x divide-slate-200">
                                <div className="px-6 py-6 bg-red-50/30">
                                    <ul className="space-y-2">
                                        {item.problems.map((prob, idx) => (
                                            <li key={idx} className="flex items-start space-x-2 text-sm text-slate-600">
                                                <XCircle className="text-red-400 flex-shrink-0 mt-0.5" size={16} />
                                                <span>{prob}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="px-6 py-6 bg-green-50/30">
                                    <ul className="space-y-2">
                                        {item.solutions.map((sol, idx) => (
                                            <li key={idx} className="flex items-start space-x-2 text-sm text-slate-700 font-medium">
                                                <CheckCircle2 className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
                                                <span>{sol}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-16"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            const element = document.querySelector('#consultation');
                            if (element) element.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="inline-flex items-center space-x-2 bg-brand-gold text-white px-8 py-4 rounded-xl hover:bg-brand-gold/90 font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                    >
                        <span>지금 바로 시작하기</span>
                        <ArrowRight size={20} />
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
};

export default ComparisonSection;

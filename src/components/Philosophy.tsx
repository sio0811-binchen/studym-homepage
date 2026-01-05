import { motion } from 'framer-motion';
import PlanVsActualGraph from './PlanVsActualGraph';

const Philosophy = () => {
    return (
        <section className="py-32 bg-brand-navy overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row gap-20 items-stretch">

                    {/* Left: Manifesto */}
                    <div className="w-full md:w-1/2 flex flex-col justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-sm font-bold text-brand-gold tracking-[0.2em] mb-4 uppercase">
                                Global PE Insight
                            </h2>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-10 leading-snug">
                                기업을 경영하듯,<br />
                                <span className="text-brand-gold">학생의 하루</span>를 경영합니다.
                            </h1>

                            <div className="space-y-8">
                                <div className="pl-6 border-l-2 border-brand-gold/30">
                                    <h3 className="text-xl font-bold text-white mb-2">Plan vs Actual</h3>
                                    <p className="text-slate-400 leading-relaxed">
                                        글로벌 사모펀드(PE)의 포트폴리오 전문 경영인은 기업의 가치를 높이기 위해 <span className="text-white font-bold">계획(Plan)과 실제(Actual)의 차이(Gap)</span>를 집요하게 파고듭니다. 성적 향상의 원리도 다르지 않습니다.
                                    </p>
                                </div>

                                <div className="pl-6 border-l-2 border-slate-700">
                                    <h3 className="text-xl font-bold text-white mb-2">The Solution</h3>
                                    <p className="text-slate-400 leading-relaxed">
                                        대부분의 학생은 '계획'만 세우고 끝납니다.<br /><br />
                                        스터디 매니저는 계획과 실행 사이의 오차(Gap)를 매일 1분 단위로 측정하고 분석합니다. 데이터가 증명하지 않는 노력은 믿지 않습니다. 오직 결과로 이어지는 과정만 관리합니다.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Visual Abstract - Plan vs Actual Graph */}
                    <div className="w-full md:w-1/2 relative min-h-[400px] flex items-center justify-center">
                        <PlanVsActualGraph />
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Philosophy;

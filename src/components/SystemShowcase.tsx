import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationVisual from './NotificationVisual';
import PlanVsActualGraph from './PlanVsActualGraph';
import CommunicationVisual from './CommunicationVisual';

const features = [
    {
        id: 'life',
        title: 'Life Management',
        subheader: '빈틈없는 통제',
        desc: "자율은 없습니다. 오직 '규율'만 존재합니다.",
        details: "입실부터 퇴실까지, 학생의 모든 동선이 통제됩니다. 실시간 등하원 알림, 10 to 10 스케줄, 무단 이석 원천 차단.",
        component: <NotificationVisual />
    },
    {
        id: 'study',
        title: 'Study Management',
        subheader: 'Plan vs Actual',
        desc: "계획된 공부가 아니면 '학습'이 아니라 '노동'입니다.",
        details: "PE(사모펀드)의 성과 관리 기법 도입. 매일 1분 단위로 계획을 세우고, 실제 실행률(Actual)과의 갭(Gap)을 시각화하여 밀도 높게 관리합니다.",
        component: <PlanVsActualGraph />
    },
    {
        id: 'communication',
        title: 'Communication',
        subheader: '투명한 연결',
        desc: "학생-학부모-매니저, 완벽한 '삼각 공조' 시스템.",
        details: "센터 안에서의 모든 데이터가 투명하게 공유됩니다. 매일 밤 발송되는 Daily Insight Report로 자녀의 하루를 확인하세요.",
        component: <CommunicationVisual />
    }
];

const SystemShowcase = () => {
    const [activeFeature, setActiveFeature] = useState(0);

    return (
        <section className="py-24 bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold text-brand-navy mb-4"
                    >
                        The 3 Pillars
                    </motion.h2>
                    <p className="text-slate-500 text-lg">데이터 기반의 압도적인 관리 시스템</p>
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Visual Area */}
                    <div className="w-full lg:w-1/2 relative h-[500px] flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeFeature}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                transition={{ duration: 0.4 }}
                                className="w-full flex justify-center"
                            >
                                {features[activeFeature].component}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Features List */}
                    <div className="w-full lg:w-1/2 space-y-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => setActiveFeature(index)}
                                className={`group p-8 rounded-3xl cursor-pointer border transition-all duration-300 relative overflow-hidden ${activeFeature === index
                                    ? 'bg-white border-brand-gold shadow-xl scale-105 z-10'
                                    : 'bg-white/50 border-transparent hover:bg-white hover:shadow-md'
                                    }`}
                            >
                                {activeFeature === index && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        className="absolute left-0 top-0 bottom-0 w-2 bg-brand-gold"
                                    />
                                )}

                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className={`text-xl font-bold ${activeFeature === index ? 'text-brand-navy' : 'text-slate-400'}`}>
                                            {feature.title}
                                        </h3>
                                        {activeFeature === index && (
                                            <span className="px-3 py-1 bg-brand-navy text-brand-gold text-xs font-bold rounded-full">
                                                {feature.subheader}
                                            </span>
                                        )}
                                    </div>
                                    <p className={`font-medium mb-3 text-lg ${activeFeature === index ? 'text-slate-800' : 'text-slate-400'}`}>
                                        {feature.desc}
                                    </p>
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{
                                            height: activeFeature === index ? 'auto' : 0,
                                            opacity: activeFeature === index ? 1 : 0
                                        }}
                                        className="overflow-hidden"
                                    >
                                        <p className="text-slate-600 leading-relaxed pt-2 border-t border-slate-100 mt-2">
                                            {feature.details}
                                        </p>
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SystemShowcase;

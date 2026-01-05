
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const reviews = [
    {
        name: "김민수",
        school: "서울대학교 경영학과 24학번",
        desc: "1등급에서 정체되어 있었는데, Plan vs Actual 분석을 통해 내 공부의 '구멍'을 찾았습니다. 막연한 불안감이 확신으로 바뀌는 순간이었습니다.",
        increase: "수학 3등급 → 1등급"
    },
    {
        name: "이도현",
        school: "연세대학교 의예과 24학번",
        desc: "순공 시간 14시간을 찍는 것보다, 1시간을 하더라도 '제대로' 하는 것이 중요함을 깨달았습니다. Study M은 그 방법을 알려줬습니다.",
        increase: "전과목 평균 1.2등급 상승"
    },
    {
        name: "박서연",
        school: "고려대학교 미디어학부 24학번",
        desc: "혼자 스터디카페 다닐 때는 졸거나 폰 보는 시간이 많았는데, 실시간 모니터링 덕분에 딴짓하는 시간이 0으로 줄었습니다.",
        increase: "국어 백분위 88 → 99"
    },
];

const SuccessStories = () => {
    return (
        <section className="py-24 bg-brand-navy text-white overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row gap-16 items-center">

                    {/* Header Text */}
                    <div className="w-full md:w-1/3">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl font-bold mb-6 leading-tight">
                                결과로 증명하는<br />
                                <span className="text-brand-gold">Study M</span>
                            </h2>
                            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                                매년 300명 이상의 명문대 합격생 배출.<br />
                                다음 주인공은 바로 당신입니다.
                            </p>

                            <div className="flex gap-8">
                                <div>
                                    <h4 className="text-3xl font-bold text-white">94%</h4>
                                    <p className="text-sm text-slate-400 mt-1">성적 상승률</p>
                                </div>
                                <div>
                                    <h4 className="text-3xl font-bold text-white">12,000+</h4>
                                    <p className="text-sm text-slate-400 mt-1">누적 수강생</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Cards Scroll */}
                    <div className="w-full md:w-2/3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {reviews.map((review, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.15 }}
                                    viewport={{ once: true }}
                                    className={`bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors ${idx === 2 ? 'md:col-span-2' : ''}`}
                                >
                                    <Quote className="w-8 h-8 text-brand-gold/50 mb-6" />
                                    <p className="text-slate-200 text-lg leading-relaxed mb-6">
                                        "{review.desc}"
                                    </p>
                                    <div className="flex justify-between items-end border-t border-white/10 pt-6">
                                        <div>
                                            <h4 className="font-bold text-white text-lg">{review.name}</h4>
                                            <p className="text-brand-gold text-sm font-medium">{review.school}</p>
                                        </div>
                                        <span className="text-xs bg-brand-gold/20 text-brand-gold px-3 py-1 rounded-full border border-brand-gold/30">
                                            {review.increase}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default SuccessStories;

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, Target, ArrowRight } from 'lucide-react';

const programs = [
    {
        icon: Clock,
        title: "Standard Membership",
        subtitle: "전용석 + 생활 관리",
        desc: "지정석 제공과 함께 등하원 알림, 휴대폰 수거, 졸음 관리 등 기본적인 생활 관리 서비스를 제공합니다.",
        tags: ["몰입환경", "생활관리", "지정석"],
        route: "/programs/standard"
    },
    {
        icon: Target,
        title: "Weekly Consulting",
        subtitle: "주간 학습 리포트 + 코칭",
        desc: "주 1회 전문 컨설턴트와의 1:1 상담을 통해 한 주간의 학습 데이터를 분석하고 다음 주의 계획을 수립합니다.",
        tags: ["갭분석", "로드맵", "동기부여"],
        route: "/programs/weekly"
    },
    {
        icon: BookOpen,
        title: "Deep Focus Term",
        subtitle: "방학 집중 프로그램",
        desc: "아침 8시부터 밤 10시까지, 하루 14시간의 순공 시간을 확보하는 윈터/썸머 스쿨 프로그램입니다.",
        tags: ["윈터스쿨", "썸머스쿨", "14시간루틴"],
        route: "/programs/winter-school"
    }
];

const Programs = () => {
    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: 'radial-gradient(#0F172A 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-brand-gold font-bold tracking-wider uppercase text-sm"
                    >
                        Programs
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl font-bold text-brand-navy mt-4 mb-6"
                    >
                        학생에게 필요한 <span className="text-brand-gold">모든 솔루션</span>
                    </motion.h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        단순한 장소 제공을 넘어, 성적 향상을 위한 토탈 케어 시스템을 운영합니다.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {programs.map((program, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.2 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 group border border-slate-100 hover:border-brand-gold/30 hover:-translate-y-2"
                        >
                            <div className="w-14 h-14 bg-brand-navy/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-navy group-hover:text-white transition-colors duration-300">
                                {React.createElement(program.icon, { className: "w-7 h-7" })}
                            </div>

                            <h3 className="text-2xl font-bold text-slate-800 mb-2">{program.title}</h3>
                            <p className="text-brand-gold font-medium mb-4">{program.subtitle}</p>
                            <p className="text-slate-600 leading-relaxed mb-8 h-20">
                                {program.desc}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-8">
                                {program.tags.map((tag, tIdx) => (
                                    <span key={tIdx} className="text-xs font-medium px-3 py-1 bg-slate-100 text-slate-500 rounded-full">
                                        #{tag}
                                    </span>
                                ))}
                            </div>


                            <Link
                                to={program.route}
                                className="w-full py-3 rounded-xl border border-slate-200 font-medium text-slate-600 flex items-center justify-center group-hover:bg-brand-navy group-hover:text-white group-hover:border-transparent transition-all"
                            >
                                자세히 보기 <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Programs;

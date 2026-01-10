import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, BarChart3 } from 'lucide-react';

const Hero = () => {
    const scrollToConsultation = () => {
        document.getElementById('consultation')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-brand-navy to-slate-900 pt-16">
            {/* Animated Background Grid */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-brand-navy" />
            </div>

            {/* Floating Elements */}
            <motion.div
                animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute top-1/4 left-10 text-brand-gold/30 text-9xl"
            >
                <TrendingUp className="w-32 h-32" />
            </motion.div>
            <motion.div
                animate={{ y: [0, 20, 0], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute bottom-1/4 right-10 text-blue-500/20 text-9xl"
            >
                <BarChart3 className="w-40 h-40" />
            </motion.div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 text-center text-white py-32">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-6xl mx-auto"
                >
                    {/* Main Headline - PE Logic */}
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 md:mb-8 leading-[1.15] tracking-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
                            성적은 '의지'가 아니라
                        </span>
                        <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-gold via-amber-400 to-yellow-300">
                            '관리'의 결과입니다.
                        </span>
                    </h1>

                    {/* Subtitle - PE Method */}
                    <p className="text-xl sm:text-2xl md:text-3xl text-slate-200 mb-6 leading-relaxed font-medium max-w-4xl mx-auto">
                        기업 성과 관리 기법
                        <span className="text-brand-gold font-bold"> (Plan vs Actual)</span>을
                        <br className="hidden md:block" />
                        학습에 도입했습니다.
                    </p>

                    <p className="text-lg sm:text-xl md:text-2xl text-slate-300 mb-10 md:mb-14 max-w-3xl mx-auto leading-relaxed px-4">
                        계획(Plan)과 실제 학습(Actual)의 차이를
                        <br className="sm:hidden" />
                        <span className="hidden sm:inline"> </span>매일 분석해야 성적이 오릅니다.
                    </p>

                    {/* CTA Button */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <motion.button
                            onClick={scrollToConsultation}
                            whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(245, 158, 11, 0.4)" }}
                            whileTap={{ scale: 0.98 }}
                            className="px-10 py-5 sm:px-12 sm:py-6 bg-brand-gold text-brand-navy font-bold rounded-2xl text-lg sm:text-xl hover:bg-amber-400 transition-all shadow-2xl shadow-brand-gold/30 flex items-center justify-center gap-3"
                        >
                            상담 신청하기
                            <ArrowRight className="w-6 h-6" />
                        </motion.button>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10" />
        </section>
    );
};

export default Hero;

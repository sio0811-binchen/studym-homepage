
import { ArrowUpRight } from 'lucide-react';

const Franchise = () => {
    return (
        <footer className="bg-slate-900 text-slate-400 py-16">
            <div className="container mx-auto px-6">

                {/* Franchise CTA */}
                <div className="border-b border-slate-800 pb-12 mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Study Manager Partner</h3>
                        <p className="text-slate-400">성공적인 교육 사업, 검증된 시스템으로 시작하세요.</p>
                    </div>
                    <button
                        onClick={() => document.getElementById('consultation')?.scrollIntoView({ behavior: 'smooth' })}
                        className="flex items-center gap-2 px-6 py-3 border border-slate-700 rounded-lg hover:border-brand-gold hover:text-brand-gold transition-colors"
                    >
                        가맹 및 도입 문의
                        <ArrowUpRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Footer Info */}
                <div className="flex flex-col md:flex-row justify-between items-center text-sm">
                    <div className="mb-4 md:mb-0">
                        <span className="font-bold text-white text-lg mr-4">Study Manager</span>
                        <span>&copy; 2025 Study Manager. All Rights Reserved.</span>
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">이용약관</a>
                        <a href="#" className="hover:text-white transition-colors">개인정보처리방침</a>
                        <a href="#" className="hover:text-white transition-colors">오시는 길</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Franchise;

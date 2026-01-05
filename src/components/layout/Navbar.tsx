import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // 2-Track Menu Structure (수만휘 스타일)
    const menuItems = [
        { label: '브랜드 스토리', href: '/story' },
        { label: '학습 정밀 진단', href: '/diagnosis' },
        { label: '공부법 연구소', href: '/columns' },
        { label: '운영지침안내', href: '/manual' },
        // { label: '가맹 안내', href: '/franchise' }, // 오픈 초기 임시 숨김
        { label: 'Admin', href: '/admin' },
    ];

    // Scroll detection for sticky header
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavigation = (href: string) => {
        if (href.startsWith('#')) {
            // 현재 홈페이지가 아니면 홈으로 먼저 이동
            if (window.location.pathname !== '/') {
                navigate('/' + href);
            } else {
                const element = document.querySelector(href);
                element?.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            navigate(href);
        }
        setIsOpen(false);
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/95 backdrop-blur-lg shadow-lg'
                : 'bg-white/80 backdrop-blur-md shadow-sm'
                }`}
        >
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                        onClick={() => setIsOpen(false)}
                    >
                        <img
                            src="/images/studym-logo.png"
                            alt="StudyM"
                            className="h-12 w-12 object-contain"
                        />
                        <span className="text-xl font-bold text-brand-navy hidden sm:inline">스터디엠</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        {menuItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => handleNavigation(item.href)}
                                className="text-slate-700 hover:text-brand-gold font-medium transition-colors relative group"
                            >
                                {item.label}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-gold group-hover:w-full transition-all duration-300"></span>
                            </button>
                        ))}

                        {/* CTA Button */}
                        <button
                            onClick={() => handleNavigation('#consultation')}
                            className="px-6 py-3 bg-brand-gold text-brand-navy font-bold rounded-xl hover:bg-amber-400 transition-all shadow-md hover:shadow-xl hover:scale-105"
                        >
                            상담 신청
                        </button>
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 text-brand-navy hover:text-brand-gold transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="md:hidden overflow-hidden border-t border-slate-200"
                        >
                            <div className="py-4 space-y-2">
                                {menuItems.map((item) => (
                                    <button
                                        key={item.label}
                                        onClick={() => handleNavigation(item.href)}
                                        className="block w-full text-left px-4 py-3 text-slate-700 hover:bg-brand-gold/10 hover:text-brand-gold rounded-lg font-medium transition-all"
                                    >
                                        {item.label}
                                    </button>
                                ))}

                                <button
                                    onClick={() => handleNavigation('#consultation')}
                                    className="w-full px-4 py-3 bg-brand-gold text-brand-navy font-bold rounded-lg hover:bg-amber-400 transition-all mt-2"
                                >
                                    상담 신청
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
};

export default Navbar;

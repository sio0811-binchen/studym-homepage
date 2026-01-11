import { motion } from 'framer-motion';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        company: [
            { label: '회사 소개', href: '/about' },
            { label: '기능 소개', href: '/features' },
            // { label: '가맹 문의', href: '/franchise' }, // 오픈 초기 임시 숨김
        ],
        legal: [
            { label: '이용약관', href: '/manual' },
            { label: '개인정보처리방침', href: '/privacy' },
            { label: '환불 정책', href: '/manual' },
        ],
        contact: [
            { label: '전화', text: '031-387-7303' },
            { label: '주소', text: '경기 안양시 동안구 귀인로 216, 5층' },
            { label: '회사명', text: '주식회사 스터디엠' },
            { label: '대표이사', text: '박윤완' },
            { label: '사업자번호', text: '682-88-03603' },
        ],
    };

    return (
        <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-3 mb-4"
                        >
                            <img
                                src="/images/studym-logo.png"
                                alt="StudyM"
                                className="h-10 w-10 object-contain"
                            />
                            <span className="text-2xl font-bold text-brand-gold">스터디엠</span>
                        </motion.div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            데이터 기반 맞춤형 학습 관리 시스템으로<br />
                            상위 1% 성적을 만듭니다.
                        </p>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">서비스</h4>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-gray-400 hover:text-brand-gold transition-colors text-sm"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">약관 및 정책</h4>
                        <ul className="space-y-2">
                            {footerLinks.legal.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-gray-400 hover:text-brand-gold transition-colors text-sm"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">문의</h4>
                        <ul className="space-y-2">
                            {footerLinks.contact.map((item) => (
                                <li key={item.label} className="text-sm">
                                    <span className="text-gray-500">{item.label}: </span>
                                    <span className="text-gray-300">{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-700 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        {/* Copyright */}
                        <p className="text-gray-500 text-sm">
                            © {currentYear} STUDY M Inc. All rights reserved.
                        </p>

                        {/* Social Links or Additional Info */}
                        <div className="flex space-x-6">
                            <a href="#" className="text-gray-400 hover:text-brand-gold transition-colors">
                                <span className="text-sm">블로그</span>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-brand-gold transition-colors">
                                <span className="text-sm">공지사항</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

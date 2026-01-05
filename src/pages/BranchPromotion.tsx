import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react';

const BranchPromotion = () => {

    // 샘플 지점 데이터
    const branches = [
        {
            id: '1',
            name: '서울 강남지점',
            address: '서울특별시 강남구 대치동 123-45',
            phone: '02-1234-5678',
            hours: '평일 06:00-23:00 / 주말 08:00-22:00',
            seats: 200,
            manager: {
                name: '김영희',
                message: '학생 한 분 한 분의 성적 향상을 책임집니다.',
                photo: 'https://via.placeholder.com/100',
            },
            images: [
                'https://via.placeholder.com/800x400?text=Study+Room+1',
                'https://via.placeholder.com/800x400?text=Study+Room+2',
            ],
        },
        {
            id: '2',
            name: '서울 목동지점',
            address: '서울특별시 양천구 목동 456-78',
            phone: '02-2345-6789',
            hours: '평일 06:00-23:00 / 주말 08:00-22:00',
            seats: 180,
            manager: {
                name: '이철수',
                message: '데이터 기반으로 성적 향상을 강제합니다.',
                photo: 'https://via.placeholder.com/100',
            },
            images: [
                'https://via.placeholder.com/800x400?text=Mokdong+1',
                'https://via.placeholder.com/800x400?text=Mokdong+2',
            ],
        },
        {
            id: '3',
            name: '경기 분당지점',
            address: '경기도 성남시 분당구 정자동 789-10',
            phone: '031-3456-7890',
            hours: '평일 06:00-23:00 / 주말 08:00-22:00',
            seats: 150,
            manager: {
                name: '박민수',
                message: '시스템으로 관리하고, 결과로 증명합니다.',
                photo: 'https://via.placeholder.com/100',
            },
            images: [
                'https://via.placeholder.com/800x400?text=Bundang+1',
                'https://via.placeholder.com/800x400?text=Bundang+2',
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="bg-gradient-to-br from-brand-navy to-slate-900 text-white py-20">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <h1 className="text-5xl font-bold mb-6">지점 안내</h1>
                        <p className="text-xl text-slate-300">
                            전국 TOP 학군지에 위치한 Study M을 만나보세요
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Branch Cards */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {branches.map((branch, idx) => (
                            <motion.div
                                key={branch.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-slate-200"
                            >
                                {/* Image */}
                                <div className="relative h-48 overflow-hidden bg-slate-200">
                                    <img
                                        src={branch.images[0]}
                                        alt={branch.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4 px-3 py-1 bg-brand-gold text-brand-navy text-sm font-bold rounded-lg">
                                        {branch.seats}석
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-brand-navy mb-4">
                                        {branch.name}
                                    </h3>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-start gap-3 text-slate-600">
                                            <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-brand-gold" />
                                            <span className="text-sm">{branch.address}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <Phone className="w-5 h-5 flex-shrink-0 text-brand-gold" />
                                            <span className="text-sm">{branch.phone}</span>
                                        </div>
                                        <div className="flex items-start gap-3 text-slate-600">
                                            <Clock className="w-5 h-5 mt-0.5 flex-shrink-0 text-brand-gold" />
                                            <span className="text-sm">{branch.hours}</span>
                                        </div>
                                    </div>

                                    {/* Manager */}
                                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl mb-4">
                                        <img
                                            src={branch.manager.photo}
                                            alt={branch.manager.name}
                                            className="w-12 h-12 rounded-full"
                                        />
                                        <div>
                                            <div className="font-semibold text-brand-navy">
                                                {branch.manager.name} 매니저
                                            </div>
                                            <div className="text-sm text-slate-600 line-clamp-1">
                                                "{branch.manager.message}"
                                            </div>
                                        </div>
                                    </div>

                                    {/* CTA */}
                                    <a
                                        href={`/#consultation?branch=${branch.name}`}
                                        className="block w-full py-3 bg-brand-navy text-white text-center font-bold rounded-xl hover:bg-slate-800 transition-colors"
                                    >
                                        이 지점으로 상담받기
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Map Section (Optional - Placeholder) */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl font-bold text-brand-navy mb-8">
                            전국 지도에서 찾기
                        </h2>
                        <div className="bg-white p-12 rounded-2xl shadow-lg border border-slate-200">
                            <div className="flex items-center justify-center gap-3 text-slate-400">
                                <Navigation className="w-8 h-8" />
                                <p className="text-lg">
                                    지도 API 연동 예정 (네이버/카카오)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-br from-brand-navy to-slate-900 text-white">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <h2 className="text-4xl font-bold mb-6">
                            가장 가까운 지점에서<br />무료 상담을 받아보세요
                        </h2>
                        <p className="text-xl text-slate-300 mb-8">
                            시설 투어와 함께 맞춤 학습 전략을 제시해 드립니다
                        </p>
                        <a
                            href="/#consultation"
                            className="inline-block px-10 py-4 bg-brand-gold text-brand-navy font-bold text-lg rounded-xl hover:bg-yellow-500 transition-all transform hover:scale-105"
                        >
                            상담 신청하기
                        </a>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default BranchPromotion;

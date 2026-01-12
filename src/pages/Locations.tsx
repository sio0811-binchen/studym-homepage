import { motion } from 'framer-motion';
import { MapPin, Phone, Users, Award } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

interface Location {
    id: number;
    name: string;
    address: string;
    phone: string;
    features: string[];
    image?: string;
    stats?: {
        students: number;
        avgIncrease: string;
    };
}

const LocationsPage = () => {
    const locations: Location[] = [
        {
            id: 1,
            name: "강남점",
            address: "서울시 강남구 테헤란로 123",
            phone: "02-1234-5678",
            features: ["1:1 맞춤 관리", "프리미엄 존", "스터디 라운지", "24시간 CCTV"],
            stats: {
                students: 65,
                avgIncrease: "23%"
            }
        },
        {
            id: 2,
            name: "목동점",
            address: "서울시 양천구 목동서로 456",
            phone: "02-2345-6789",
            features: ["소규모 그룹 스터디", "자습 공간", "상담실", "학부모 커뮤니티"],
            stats: {
                students: 52,
                avgIncrease: "19%"
            }
        },
        {
            id: 3,
            name: "분당점",
            address: "경기도 성남시 분당구 정자일로 789",
            phone: "031-3456-7890",
            features: ["프리미엄 스터디존", "토론 공간", "심리 상담", "진로 컨설팅"],
            stats: {
                students: 48,
                avgIncrease: "26%"
            }
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 pt-20">
            <Navbar />
            {/* Header */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-brand-navy mb-4">
                        가까운 <span className="text-brand-gold">Study M</span>을 찾아보세요
                    </h1>
                    <p className="text-xl text-slate-600">
                        전국 주요 지역에서 운영 중인 프리미엄 학습 관리 시스템
                    </p>
                </motion.div>

                {/* Locations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {locations.map((location, index) => (
                        <motion.div
                            key={location.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200 hover:shadow-xl transition-shadow"
                        >
                            {/* Image Placeholder */}
                            <div className="h-48 bg-gradient-to-br from-brand-navy to-slate-800 relative overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center text-white">
                                        <MapPin size={48} className="mx-auto mb-2 opacity-50" />
                                        <p className="text-sm opacity-70">(지점 사진 영역)</p>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-2xl font-bold text-brand-navy mb-3">
                                    {location.name}
                                </h3>

                                {/* Address */}
                                <div className="flex items-start space-x-2 text-slate-600 mb-2">
                                    <MapPin size={18} className="mt-1 flex-shrink-0" />
                                    <p className="text-sm">{location.address}</p>
                                </div>

                                {/* Phone */}
                                <div className="flex items-center space-x-2 text-slate-600 mb-4">
                                    <Phone size={18} />
                                    <a href={`tel:${location.phone}`} className="text-sm hover:text-brand-gold transition-colors">
                                        {location.phone}
                                    </a>
                                </div>

                                {/* Stats */}
                                {location.stats && (
                                    <div className="flex items-center space-x-4 mb-4 p-3 bg-slate-50 rounded-lg">
                                        <div className="flex items-center space-x-2">
                                            <Users size={16} className="text-brand-gold" />
                                            <span className="text-sm font-semibold">{location.stats.students}명</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Award size={16} className="text-brand-gold" />
                                            <span className="text-sm font-semibold">평균 {location.stats.avgIncrease}↑</span>
                                        </div>
                                    </div>
                                )}

                                {/* Features */}
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold text-slate-500 uppercase">주요 시설</p>
                                    <div className="flex flex-wrap gap-2">
                                        {location.features.map((feature, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 bg-brand-gold/10 text-brand-gold text-xs rounded-full"
                                            >
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* CTA */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => window.location.href = '#consultation'}
                                    className="w-full mt-6 bg-brand-gold text-white py-3 rounded-lg font-semibold hover:bg-brand-gold/90 transition-colors"
                                >
                                    상담 신청하기
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Additional Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 text-center p-8 bg-white rounded-2xl shadow-md"
                >
                    <h3 className="text-2xl font-bold text-brand-navy mb-4">
                        새로운 지점이 계속 오픈 중입니다
                    </h3>
                    <p className="text-slate-600 mb-6">
                        가맹 문의를 통해 귀하의 지역에서도 Study M을 운영하실 수 있습니다.
                    </p>
                    <motion.a
                        href="/franchise"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block px-8 py-3 bg-brand-navy text-white rounded-lg font-semibold hover:bg-brand-navy/90 transition-colors"
                    >
                        가맹 문의하기
                    </motion.a>
                </motion.div>
            </section>

            <Footer />
        </div>
    );
};

export default LocationsPage;

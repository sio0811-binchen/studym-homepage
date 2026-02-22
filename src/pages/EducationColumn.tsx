import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Eye, User } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useSEO } from '../hooks/useSEO';

const EducationColumn = () => {
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [columns, setColumns] = useState<any[]>([]);

    useSEO({
        title: '공부법 연구소 | STUDY M',
        description: 'STUDY M 데이터 기반 맞춤형 학습법 칼럼. 학부모님과 학생들을 위한 진짜 교육 인사이트를 만나보세요.',
        url: 'https://studym.co.kr/blog'
    });

    // DB API에서 블로그 칼럼 로드
    useEffect(() => {
        fetch('/api/blog')
            .then(res => {
                if (!res.ok) throw new Error('API Error');
                return res.json();
            })
            .then(data => setColumns(data || []))
            .catch(err => {
                console.error('Failed to load articles:', err);
                setColumns([]); // Fallback
            });
    }, []);

    const categories = [
        { value: 'ALL', label: '전체' },
        { value: '학습법', label: '학습법' },
        { value: '자기주도', label: '자기주도' },
        { value: '관리형', label: '관리형' },
        { value: '입시', label: '입시' },
    ];

    const filteredColumns = selectedCategory === 'ALL'
        ? columns
        : columns.filter(col => col.category === selectedCategory);

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero */}
            <section className="bg-gradient-to-br from-brand-navy to-slate-900 text-white py-20 pt-32">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <h1 className="text-5xl font-bold mb-6">공부법 연구소</h1>
                        <p className="text-xl text-slate-300">
                            데이터 기반 학습 전략과 성공 사례를 공유합니다
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Category Filter */}
            <section className="py-8 bg-slate-50 sticky top-16 z-10 shadow-sm border-b border-slate-200">
                <div className="container mx-auto px-6">
                    <div className="flex flex-wrap gap-3 justify-center">
                        {categories.map((cat) => (
                            <button
                                key={cat.value}
                                onClick={() => setSelectedCategory(cat.value)}
                                className={`px-5 py-2 rounded-lg font-semibold transition-all text-sm ${selectedCategory === cat.value
                                    ? 'bg-brand-navy text-white shadow-md'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Board List - 번호 추가 */}
            <section className="py-12">
                <div className="container mx-auto px-6">
                    <div className="max-w-5xl mx-auto">
                        {/* Modern Blog Card Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredColumns.map((column, idx) => (
                                <motion.div
                                    key={column.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100"
                                >
                                    <Link to={`/blog/${column.slug}`} className="flex flex-col h-full">
                                        {/* Thumbnail or Category Header */}
                                        <div className="relative h-48 overflow-hidden bg-slate-100">
                                            {/* Fallback 배경 */}
                                            <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 group-hover:scale-105 transition-transform duration-500">
                                                <span className="text-slate-400 font-bold tracking-widest uppercase opacity-70">Study M</span>
                                            </div>

                                            {/* 썸네일 (성공 시 Fallback 덮음, 실패 시 숨김처리) */}
                                            {column.thumbnail && (
                                                <img
                                                    src={column.thumbnail}
                                                    alt={column.title}
                                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 z-10"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                    }}
                                                />
                                            )}
                                            <div className="absolute top-4 left-4">
                                                <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-brand-navy shadow-sm text-xs font-bold rounded-full">
                                                    {column.category}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content container */}
                                        <div className="flex flex-col flex-grow p-6">
                                            {/* Meta info row */}
                                            <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span>{column.date}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Eye className="w-3.5 h-3.5" />
                                                    <span>{column.readTime || '5분'}</span>
                                                </div>
                                            </div>

                                            {/* Title & Excerpt */}
                                            <h3
                                                className="text-xl font-bold text-slate-800 mb-3 leading-snug group-hover:text-brand-navy transition-colors line-clamp-2"
                                                dangerouslySetInnerHTML={{ __html: column.title }}
                                            />
                                            <p
                                                className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow"
                                                dangerouslySetInnerHTML={{ __html: column.excerpt }}
                                            />

                                            {/* Footer - Author details */}
                                            <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-8 h-8 rounded-full bg-brand-navy text-white flex items-center justify-center">
                                                        <User className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-sm font-semibold text-slate-700">{column.author || 'Study M 교육연구소'}</span>
                                                </div>
                                                <span className="text-brand-gold font-bold text-sm tracking-wide flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
                                                    자세히 보기 →
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {filteredColumns.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-slate-500 text-lg">해당 카테고리에 글이 없습니다.</p>
                            </div>
                        )}

                        {/* Total Count */}
                        <div className="mt-8 text-center text-sm text-slate-500">
                            총 <span className="font-bold text-brand-navy">{filteredColumns.length}</span>개의 글
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
                            우리 아이의 공부 습관,<br />전문가에게 진단받기
                        </h2>
                        <p className="text-xl text-slate-300 mb-8">
                            Plan vs Actual 분석으로 정확한 학습 전략을 제시합니다
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

            <Footer />
        </div>
    );
};

export default EducationColumn;

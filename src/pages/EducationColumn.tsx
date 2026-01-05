import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Eye, User } from 'lucide-react';
import Navbar from '../components/layout/Navbar';

const EducationColumn = () => {
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [columns, setColumns] = useState<any[]>([]);

    // JSON 파일에서 칼럼 로드
    useEffect(() => {
        fetch('/content/articles.json')
            .then(res => res.json())
            .then(data => setColumns(data))
            .catch(err => console.error('Failed to load articles:', err));
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
                        {/* Table Header */}
                        <div className="hidden md:grid md:grid-cols-12 gap-4 pb-4 border-b-2 border-brand-navy text-sm font-bold text-slate-700 mb-4">
                            <div className="col-span-1 text-center">번호</div>
                            <div className="col-span-1 text-center">카테고리</div>
                            <div className="col-span-6">제목</div>
                            <div className="col-span-2 text-center">작성자</div>
                            <div className="col-span-1 text-center">날짜</div>
                            <div className="col-span-1 text-center">읽기</div>
                        </div>

                        {/* Board Items with Numbers */}
                        <div className="space-y-1">
                            {filteredColumns.map((column, idx) => (
                                <motion.div
                                    key={column.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <Link
                                        to={`/column/${column.slug}`}
                                        className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 hover:bg-slate-50 transition-colors border-b border-slate-100 group"
                                    >
                                        {/* Number - Desktop */}
                                        <div className="hidden md:flex md:col-span-1 justify-center items-center">
                                            <span className="text-brand-navy font-semibold">
                                                {idx + 1}
                                            </span>
                                        </div>

                                        {/* Category */}
                                        <div className="md:col-span-1 flex md:justify-center items-center">
                                            <span className="inline-block px-3 py-1 bg-brand-gold/10 text-brand-gold text-xs font-semibold rounded-full">
                                                {column.category}
                                            </span>
                                        </div>

                                        {/* Title with mobile number */}
                                        <div className="md:col-span-6">
                                            <h3 className="text-lg md:text-base font-bold text-brand-navy group-hover:text-brand-gold transition-colors mb-2 md:mb-1">
                                                <span className="md:hidden text-slate-500 font-normal mr-2">
                                                    {idx + 1}.
                                                </span>
                                                {column.title}
                                            </h3>
                                            <p className="text-sm text-slate-600 line-clamp-1 md:hidden">
                                                {column.excerpt}
                                            </p>
                                        </div>

                                        {/* Author */}
                                        <div className="md:col-span-2 flex items-center text-sm text-slate-600">
                                            <User className="w-4 h-4 mr-1 md:hidden" />
                                            <span className="md:text-center md:w-full">Study M</span>
                                        </div>

                                        {/* Date */}
                                        <div className="md:col-span-1 flex items-center text-sm text-slate-500">
                                            <Calendar className="w-4 h-4 mr-1 md:hidden" />
                                            <span className="md:text-center md:w-full">{column.date}</span>
                                        </div>

                                        {/* Read Time */}
                                        <div className="md:col-span-1 flex items-center text-sm text-slate-500">
                                            <Eye className="w-4 h-4 mr-1 md:hidden" />
                                            <span className="md:text-center md:w-full">{column.readTime}</span>
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
        </div>
    );
};

export default EducationColumn;

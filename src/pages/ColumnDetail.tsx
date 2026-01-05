import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Calendar, Eye, ArrowLeft, Tag } from 'lucide-react';
import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';

interface Article {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    author: string;
    date: string;
    readTime: string;
    category: string;
    tags: string[];
    thumbnail: string;
}

const ColumnDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [article, setArticle] = useState<Article | null>(null);
    const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // JSON 파일에서 전체 아티클 로드
        fetch('/content/articles.json')
            .then(res => res.json())
            .then((data: Article[]) => {
                // slug와 일치하는 아티클 찾기
                const foundArticle = data.find(a => a.slug === slug);

                if (foundArticle) {
                    setArticle(foundArticle);

                    // 같은 카테고리의 다른 글 2개 찾기
                    const related = data
                        .filter(a => a.category === foundArticle.category && a.id !== foundArticle.id)
                        .slice(0, 2);
                    setRelatedArticles(related);
                } else {
                    // 아티클을 찾지 못하면 목록으로 리다이렉트
                    navigate('/columns');
                }

                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load article:', err);
                setLoading(false);
                navigate('/columns');
            });
    }, [slug, navigate]);

    // 마크다운 기호 완전 제거 함수
    const cleanMarkdown = (text: string): string => {
        return text
            // ** 제거 (볼드)
            .replace(/\*\*(.*?)\*\*/g, '$1')
            // * 제거 (이탤릭)
            .replace(/\*(.*?)\*/g, '$1')
            // __ 제거
            .replace(/__(.*?)__/g, '$1')
            // _ 제거
            .replace(/_(.*?)_/g, '$1')
            // ## 제거 (헤딩)
            .replace(/^##\s+/gm, '')
            // # 제거
            .replace(/^#\s+/gm, '')
            // ### 제거
            .replace(/^###\s+/gm, '')
            // #### 제거
            .replace(/^####\s+/gm, '')
            // - 리스트 기호는 유지하되 앞에 공백만 제거
            .replace(/^-\s+/gm, '• ')
            // ✓ 기호는 유지
            .replace(/^✓\s+/gm, '✓ ');
    };

    // 본문을 문단으로 나누고 렌더링
    const renderContent = (content: string) => {
        const cleaned = cleanMarkdown(content);
        const paragraphs = cleaned.split('\n\n').filter(p => p.trim());

        return paragraphs.map((paragraph, idx) => {
            const trimmed = paragraph.trim();

            // 빈 문단 스킵
            if (!trimmed) return null;

            // 리스트 항목들 (•나 ✓로 시작)
            if (trimmed.includes('\n• ') || trimmed.includes('\n✓ ')) {
                const items = trimmed.split('\n').filter(line => line.trim());
                return (
                    <ul key={idx} className="my-6 space-y-3 pl-5">
                        {items.map((item, i) => (
                            <li key={i} className="text-slate-700 leading-relaxed list-disc">
                                {item.replace(/^[•✓]\s*/, '')}
                            </li>
                        ))}
                    </ul>
                );
            }

            // 강조할 제목형 문단 (짧고 끝에 물음표나 느낌표가 있는 경우)
            if (trimmed.length < 60 && (trimmed.endsWith('?') || trimmed.endsWith('!'))) {
                return (
                    <h3 key={idx} className="text-2xl font-bold text-brand-navy mt-10 mb-4">
                        {trimmed}
                    </h3>
                );
            }

            // 일반 문단
            return (
                <p key={idx} className="text-slate-700 leading-relaxed mb-6 text-lg">
                    {trimmed}
                </p>
            );
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-brand-gold mx-auto mb-4"></div>
                    <p className="text-slate-600">로딩 중...</p>
                </div>
            </div>
        );
    }

    if (!article) {
        return null;
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Header - pt-32로 Navbar 공간 확보 */}
            <section className="bg-gradient-to-br from-brand-navy to-slate-900 text-white py-16 pt-32">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <Link
                            to="/columns"
                            className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            목록으로
                        </Link>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <span className="inline-block px-3 py-1 bg-brand-gold/20 text-brand-gold text-sm font-semibold rounded-lg mb-4">
                                {article.category}
                            </span>

                            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                                {article.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-6 text-slate-300">
                                <span className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    {article.date}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Eye className="w-5 h-5" />
                                    {article.readTime}
                                </span>
                                <span className="text-slate-400">
                                    by {article.author}
                                </span>
                            </div>

                            {/* Tags */}
                            {article.tags && article.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {article.tags.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center gap-1 px-3 py-1 bg-white/10 text-slate-300 text-xs rounded-full"
                                        >
                                            <Tag className="w-3 h-3" />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Content - 마크다운 기호 완전 제거 */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto">
                        <motion.article
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="prose prose-lg max-w-none"
                        >
                            {renderContent(article.content)}
                        </motion.article>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-brand-gold/5 border-y border-brand-gold/20">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold text-brand-navy mb-4">
                            우리 아이에게 맞는 전략이 궁금하신가요?
                        </h2>
                        <p className="text-slate-600 text-lg mb-8">
                            전문 컨설턴트가 Plan vs Actual 분석 후 맞춤 솔루션을 제시합니다
                        </p>
                        <a
                            href="/#consultation"
                            className="inline-block px-10 py-4 bg-brand-navy text-white font-bold text-lg rounded-xl hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl"
                        >
                            상담 신청하기
                        </a>
                    </div>
                </div>
            </section>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
                <section className="py-20">
                    <div className="container mx-auto px-6">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl font-bold text-brand-navy mb-8">
                                같은 카테고리의 다른 글
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {relatedArticles.map((related) => (
                                    <Link
                                        key={related.id}
                                        to={`/column/${related.slug}`}
                                        className="p-6 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all border border-slate-200 hover:shadow-lg group"
                                    >
                                        <span className="inline-block px-2 py-1 bg-brand-gold/10 text-brand-gold text-xs font-semibold rounded mb-3">
                                            {related.category}
                                        </span>
                                        <h3 className="text-xl font-bold text-brand-navy group-hover:text-brand-gold transition-colors mb-2">
                                            {related.title}
                                        </h3>
                                        <p className="text-slate-600 text-sm line-clamp-2">
                                            {related.excerpt}
                                        </p>
                                        <div className="flex items-center gap-4 mt-4 text-slate-500 text-xs">
                                            <span>{related.date}</span>
                                            <span>{related.readTime}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default ColumnDetail;

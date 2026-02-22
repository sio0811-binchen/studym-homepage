import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Calendar, Eye, ArrowLeft, Tag } from 'lucide-react';
import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useSEO } from '../hooks/useSEO';


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
        setLoading(true);
        // DB API에서 상세 데이터 로드
        fetch(`/api/blog/${slug}`)
            .then(res => {
                if (!res.ok) throw new Error('Not found');
                return res.json();
            })
            .then(async (data: Article) => {
                setArticle(data);

                // 관련 글 로드를 위해 전체 목록 호출
                try {
                    const listRes = await fetch('/api/blog');
                    if (listRes.ok) {
                        const allData: Article[] = await listRes.json();
                        const related = allData
                            .filter(a => a.category === data.category && a.slug !== slug)
                            .slice(0, 2);
                        setRelatedArticles(related);
                    }
                } catch (e) {
                    console.error('Failed to load related articles', e);
                }

                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load article:', err);
                setLoading(false);
                navigate('/blog');
            });
    }, [slug, navigate]);

    // 동적 SEO 업데이트
    useSEO({
        title: article ? `${article.title} | STUDY M` : '공부법 연구소 | STUDY M',
        description: article ? article.excerpt : 'STUDY M 데이터 기반 맞춤형 학습법 칼럼.',
        keywords: article?.tags ? article.tags.join(', ') : '학습법, 스터디엠',
        ogImage: article?.thumbnail || 'https://studym.co.kr/og-image.png',
        url: `https://studym.co.kr/blog/${slug}`
    });

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
                            to="/blog"
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

            {/* Content - 마크다운 렌더링 */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto">
                        <motion.article
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="w-full prose prose-lg max-w-none
                                prose-headings:text-brand-navy prose-headings:font-bold
                                prose-h1:text-4xl prose-h1:mt-16 prose-h1:mb-10
                                prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-8
                                prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-6 prose-h3:border-l-4 prose-h3:border-brand-navy prose-h3:pl-4
                                prose-p:text-[#333333] prose-p:leading-[1.8] prose-p:mb-8 prose-p:text-[1.125rem]
                                prose-ul:list-disc prose-ul:pl-8 prose-ul:mb-10 prose-ul:space-y-3
                                prose-ol:list-decimal prose-ol:pl-8 prose-ol:mb-10 prose-ol:space-y-3
                                prose-blockquote:bg-slate-50 prose-blockquote:border-l-8 prose-blockquote:border-brand-gold prose-blockquote:p-8 prose-blockquote:my-12 prose-blockquote:rounded-r-xl prose-blockquote:shadow-sm prose-blockquote:italic
                                prose-img:w-full prose-img:rounded-2xl prose-img:shadow-xl prose-img:object-cover prose-img:max-h-[550px]
                                prose-table:w-full prose-table:border-collapse prose-table:shadow-sm
                                prose-th:bg-brand-navy prose-th:text-white prose-th:px-6 prose-th:py-4 prose-th:font-semibold prose-th:text-lg
                                prose-td:px-6 prose-td:py-4 prose-td:border prose-td:border-slate-200
                                prose-strong:font-bold prose-strong:text-brand-navy
                                prose-a:text-brand-gold prose-a:font-bold hover:prose-a:underline"
                            style={{ wordBreak: 'keep-all' }}
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />

                    </div>
                </div>
            </section >

            {/* CTA */}
            < section className="py-20 bg-brand-gold/5 border-y border-brand-gold/20" >
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
            </section >

            {/* Related Articles */}
            {
                relatedArticles.length > 0 && (
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
                                            to={`/blog/${related.slug}`}
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
                )
            }

            <Footer />
        </div >
    );
};

export default ColumnDetail;

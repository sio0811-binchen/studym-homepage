import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

/**
 * 404 Not Found 페이지
 *
 * Google Search Console 색인 문제 해결을 위해:
 * - noindex, nofollow 메타 태그 사용
 * - 존재하지 않는 URL이 색인되지 않도록 함
 */
export default function NotFound() {
  useEffect(() => {
    // noindex, nofollow 메타 태그 설정
    const metaRobots = document.querySelector('meta[name="robots"]');
    if (metaRobots) {
      metaRobots.setAttribute('content', 'noindex, nofollow');
    } else {
      const newMeta = document.createElement('meta');
      newMeta.name = 'robots';
      newMeta.content = 'noindex, nofollow';
      document.head.appendChild(newMeta);
    }

    // 정리 (컴포넌트 언마운트 시 원복)
    return () => {
      const meta = document.querySelector('meta[name="robots"]');
      if (meta) {
        meta.setAttribute('content', 'index, follow');
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-xl text-gray-400 mb-8">
          페이지를 찾을 수 없습니다
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home size={20} />
            홈으로 이동
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <ArrowLeft size={20} />
            뒤로 가기
          </button>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>>;
  }
}

interface AdBannerProps {
  /** 광고 슬롯 ID (애드센스 대시보드에서 생성) */
  slot?: string;
  /** 광고 포맷: auto(반응형), horizontal(가로배너), rectangle(사각형) */
  format?: 'auto' | 'horizontal' | 'rectangle';
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * Google AdSense 광고 배너 컴포넌트
 * 
 * - 자동 광고(Auto Ads)를 사용할 경우: slot 없이도 구글이 자동 배치
 * - 수동 배치할 경우: 애드센스에서 광고 단위 생성 후 slot 번호 전달
 */
const AdBanner = ({ slot, format = 'auto', className = '' }: AdBannerProps) => {
  const adRef = useRef<HTMLDivElement>(null);
  const isAdPushed = useRef(false);

  useEffect(() => {
    // 이미 광고가 푸시된 경우 중복 방지
    if (isAdPushed.current) return;

    try {
      if (window.adsbygoogle && slot) {
        window.adsbygoogle.push({});
        isAdPushed.current = true;
      }
    } catch (err) {
      console.log('AdSense 광고 로드 중 오류 (무시 가능):', err);
    }
  }, [slot]);

  // 슬롯이 없으면 자동 광고에 맡김 (빈 영역만 확보)
  if (!slot) {
    return (
      <div className={`ad-container ${className}`}>
        <div 
          className="w-full flex items-center justify-center text-xs text-slate-300"
          style={{ minHeight: '90px' }}
        >
          {/* 자동 광고(Auto Ads)가 이 영역을 활용합니다 */}
        </div>
      </div>
    );
  }

  // 광고 크기 스타일 설정
  const adStyle: React.CSSProperties = {
    display: 'block',
    ...(format === 'horizontal' && { width: '100%', height: '90px' }),
    ...(format === 'rectangle' && { width: '300px', height: '250px', margin: '0 auto' }),
  };

  return (
    <div ref={adRef} className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={adStyle}
        data-ad-client="ca-pub-9463089363313174"
        data-ad-slot={slot}
        data-ad-format={format === 'auto' ? 'auto' : undefined}
        data-full-width-responsive={format === 'auto' ? 'true' : undefined}
      />
    </div>
  );
};

export default AdBanner;

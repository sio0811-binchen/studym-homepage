
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import PlanActualCore from '../components/PlanActualCore';
import VisionStory from '../components/VisionStory';
import ComparisonSection from '../components/ComparisonSection';
import PvsAConcept from '../components/PvsAConcept';
import BentoFeatures from '../components/BentoFeatures';
import PersonaSections from '../components/PersonaSections';
// import InteractiveCharts from '../components/InteractiveCharts'; // Phase 1: 제거 - 중복 데이터 시각화
import Philosophy from '../components/Philosophy';
import Programs from '../components/Programs';
import SystemShowcase from '../components/SystemShowcase';
import ConsultationWizard from '../components/ConsultationWizard';
// import Franchise from '../components/Franchise'; // 임시 숨김
import Chatbot from '../components/Chatbot';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

function Home() {
    const location = useLocation();

    // URL 해시가 있으면 해당 섹션으로 스크롤
    useEffect(() => {
        if (location.hash) {
            setTimeout(() => {
                const element = document.querySelector(location.hash);
                element?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }, [location.hash]);

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
            <Navbar />
            <Hero />
            <PlanActualCore />
            <VisionStory />
            <ComparisonSection />
            <div id="features">
                <PvsAConcept />
                <BentoFeatures />
            </div>
            <div id="benefits">
                <PersonaSections />
                {/* InteractiveCharts 제거됨 - PlanActualCore에 진행률 바 있음 */}
            </div>
            <div id="pricing">
                <Programs />
            </div>
            <Philosophy />
            <SystemShowcase />
            <div id="consultation">
                <ConsultationWizard />
            </div>
            {/* Franchise 임시 숨김 <Franchise /> */}
            <Chatbot />
            <Footer />
        </div>
    );
}

export default Home;


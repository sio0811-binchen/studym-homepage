import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Bot } from 'lucide-react';

// Interaction Types
type Option = {
    label: string;
    action: 'message' | 'link' | 'navigate' | 'reset';
    value?: string;
};

type Message = {
    id: number;
    type: 'bot' | 'user';
    text: string;
    options?: Option[];
    isTyping?: boolean;
};

// Scenario Data
const SCENARIOS = {
    initial: {
        text: "안녕하세요! 프리미엄 관리반 입학 상담 챗봇입니다.\n궁금하신 점을 선택해 주세요.",
        options: [
            { label: "생활 관리는 어떻게 하나요?", action: 'message', value: 'life_management' },
            { label: "Plan vs Actual이 뭔가요?", action: 'message', value: 'study_management' },
            { label: "학부모 리포트는 언제 오나요?", action: 'message', value: 'communication' },
            { label: "비용 및 위치 문의", action: 'message', value: 'cost_location' },
        ]
    },
    life_management: {
        text: "입실/퇴실/외출 실시간 알림은 물론, 정해진 스케줄(교시제) 외 이동이 불가능합니다.\n\n빈틈없는 통제로 낭비 시간을 '0'으로 만듭니다.",
        options: [
            { label: "다른 질문 하기", action: 'reset' },
            { label: "상담 신청하기 (전화)", action: 'link', value: "tel:02-1234-5678" },
        ]
    },
    study_management: {
        text: "계획(Plan)과 실행(Actual)의 차이(Gap)를 분석하는 PE 방식의 학습 관리입니다.\n\n막연한 공부가 아닌, 데이터를 기반으로 성적을 경영합니다.",
        options: [
            { label: "다른 질문 하기", action: 'reset' },
            { label: "상담 신청하기 (전화)", action: 'link', value: "tel:02-1234-5678" },
        ]
    },
    communication: {
        text: "매일 밤 발송되는 Daily Insight Report를 통해 자녀의 학습 시간, 태도, 성취도를 투명하게 공유해 드립니다.",
        options: [
            { label: "다른 질문 하기", action: 'reset' },
            { label: "리포트 예시 보기", action: 'reset' }, // Fallback to reset for now
        ]
    },
    cost_location: {
        text: "상위 1% 관리반의 비용과 위치 정보는 상담 신청을 남겨주시면 담당 컨설턴트가 상세히 안내해 드립니다.",
        options: [
            { label: "상담 신청하기 (전화)", action: 'link', value: "tel:02-1234-5678" },
            { label: "처음으로 돌아가기", action: 'reset' }
        ]
    }
};

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, type: 'bot', text: SCENARIOS.initial.text, options: SCENARIOS.initial.options as Option[] }
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleOptionClick = (option: Option) => {
        // 1. Add User Message
        const userMsgId = Date.now();
        setMessages(prev => [...prev, { id: userMsgId, type: 'user', text: option.label }]);

        // 2. Process Action
        if (option.action === 'reset') {
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    type: 'bot',
                    text: SCENARIOS.initial.text,
                    options: SCENARIOS.initial.options as Option[]
                }]);
            }, 500);
            return;
        }

        if (option.action === 'link' && option.value) {
            window.location.href = option.value;
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    type: 'bot',
                    text: "전화 연결을 진행합니다. 추가 문의사항이 있으신가요?",
                    options: [{ label: "처음으로 돌아가기", action: 'reset' }]
                }]);
            }, 1000);
            return;
        }

        // 3. Determine Response
        let nextScenario = null;

        if (option.value === 'life_management') nextScenario = SCENARIOS.life_management;
        else if (option.value === 'study_management') nextScenario = SCENARIOS.study_management;
        else if (option.value === 'communication') nextScenario = SCENARIOS.communication;
        else if (option.value === 'cost_location') nextScenario = SCENARIOS.cost_location;
        else nextScenario = SCENARIOS.initial;

        // 4. Add Bot Response (with small delay for realism)
        if (nextScenario) {
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    type: 'bot',
                    text: nextScenario.text,
                    options: nextScenario.options as Option[]
                }]);
            }, 600);
        }
    };

    return (
        <>
            <motion.button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-24 right-8 z-50 p-4 rounded-full shadow-2xl bg-brand-navy text-white hover:bg-brand-gold transition-colors ${isOpen ? 'hidden' : 'block'}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <MessageSquare className="w-8 h-8" />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                        className="fixed bottom-24 right-8 z-50 w-full max-w-[380px] h-[600px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
                    >
                        <div className="bg-white p-4 border-b border-slate-100 flex justify-between items-center shadow-sm z-10">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-brand-navy flex items-center justify-center text-brand-gold">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm">STUDY M 안내 챗봇</h3>
                                    <p className="text-xs text-brand-gold">Online</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50">
                            {messages.filter(msg => msg && msg.type).map((msg) => (
                                <div key={msg.id} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>

                                    {/* Message Bubble */}
                                    <div className={`max-w-[85%] p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm ${msg.type === 'user'
                                        ? 'bg-brand-navy text-white rounded-tr-none'
                                        : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
                                        }`}>
                                        {msg.text.split('\n').map((line, i) => (
                                            <p key={i} className={i > 0 ? "mt-1" : ""}>{line}</p>
                                        ))}
                                    </div>

                                    {/* Options (Only for Bot) */}
                                    {msg.type === 'bot' && msg.options && (
                                        <div className="mt-3 flex flex-wrap gap-2 w-full max-w-[90%]">
                                            {msg.options.map((option, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleOptionClick(option)}
                                                    className="px-4 py-2 bg-white border border-brand-navy/20 rounded-full text-brand-navy text-sm font-medium hover:bg-brand-navy hover:text-white transition-all shadow-sm active:scale-95"
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Chatbot;

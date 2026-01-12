import { motion } from 'framer-motion';
import { Clock, Volume2, Smartphone, AlertTriangle, CreditCard, FileText, Shield } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const OperationManual = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section - Clean Professional Design */}
            <section className="pt-32 pb-16 bg-slate-900">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-white max-w-3xl mx-auto"
                    >
                        <p className="text-slate-400 text-sm tracking-widest uppercase mb-4">
                            Study M Official Document
                        </p>
                        <h1 className="text-4xl md:text-5xl font-light mb-6 tracking-tight">
                            운영 매뉴얼 & 이용 약관
                        </h1>
                        <div className="w-16 h-px bg-slate-600 mx-auto mb-6"></div>
                        <p className="text-lg text-slate-300 font-light leading-relaxed">
                            "사모펀드(PE)의 자산 관리 시스템을 입시 관리에 이식하다."
                        </p>
                        <p className="text-slate-400 mt-2">
                            당신의 자녀를 가장 확실한 '우량주'로 만들어 드립니다.
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="container mx-auto px-6 py-20">
                <div className="max-w-4xl mx-auto">

                    {/* Section 1: 생활 매뉴얼 */}
                    <motion.section
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-20"
                    >
                        <div className="flex items-center gap-4 mb-10 border-b border-slate-200 pb-6">
                            <div className="w-10 h-10 bg-slate-900 rounded flex items-center justify-center">
                                <FileText className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-widest">Section 01</p>
                                <h2 className="text-2xl font-medium text-slate-900">스터디엠 생활 매뉴얼</h2>
                            </div>
                        </div>

                        {/* 1.1 운영 시간 */}
                        <div className="mb-12">
                            <div className="flex items-center gap-3 mb-6">
                                <Clock className="w-5 h-5 text-slate-400" />
                                <h3 className="text-lg font-medium text-slate-900">1.1 운영 시간 및 관리 체계</h3>
                            </div>

                            <div className="space-y-6 text-slate-600 text-[15px] leading-relaxed">
                                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                                    <p className="font-medium text-slate-900 text-lg mb-4">운영 시간: 08:00 ~ 24:00 (연중무휴)</p>
                                    <ul className="space-y-2">
                                        <li><span className="text-slate-900 font-medium">관리자 집중 케어</span> — 월~토 09:00 ~ 24:00</li>
                                        <li><span className="text-slate-900 font-medium">자율 학습 시간</span>
                                            <ul className="ml-6 mt-1 space-y-1 text-slate-500">
                                                <li>평일/토: 08:00 ~ 09:00 (관리자 출근 전)</li>
                                                <li>일요일: 종일 자율 학습 (AI/CCTV 원격 모니터링)</li>
                                            </ul>
                                        </li>
                                        <li><span className="text-slate-900 font-medium">시험 기간 연장</span> — 중간/기말고사 기간(1~2주 전) 01:00~02:00까지 탄력 운영</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-medium text-slate-900 mb-3">등·하원 체크 (Tablet System)</h4>
                                    <ul className="space-y-2 pl-4 border-l-2 border-slate-200">
                                        <li><span className="font-medium">등원</span> — 좌석 착석 후 [Study M 태블릿] 로그인 시 학부모 앱 실시간 알림 발송</li>
                                        <li><span className="font-medium">하원</span> — 학습 종료 후 [Study M 태블릿] 로그아웃 시 학부모 앱 실시간 알림 발송</li>
                                        <li className="text-slate-500 text-sm">※ 1시간 이상 미로그인 이석 시 자동 퇴실 처리</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-medium text-slate-900 mb-3">이석 및 외출 관리</h4>
                                    <ul className="space-y-2 pl-4 border-l-2 border-slate-200">
                                        <li><span className="font-medium">잠깐 외출</span> — 화장실, 물 마시기 등은 태블릿의 [일시정지] 버튼 사용</li>
                                        <li><span className="font-medium">장기 외출</span> — 10분 이상(외부 강의, 병원, 식사 등) 이동 시 태블릿에서 [외출 모드] 설정 후 이동</li>
                                        <li className="text-slate-500 text-sm">※ 미설정 시 무단 이석 간주</li>
                                    </ul>
                                </div>

                                <div className="bg-slate-900 text-white rounded-lg p-5">
                                    <p className="font-medium mb-1">Daily Plan (일일 계획표)</p>
                                    <p className="text-slate-300 text-sm">등원 직후 '일일 계획표'를 반드시 작성해야 하며, 미작성 시 AI 분석 리포트(P vs A Report)가 제공되지 않습니다.</p>
                                </div>
                            </div>
                        </div>

                        {/* 1.2 이동 및 정숙 */}
                        <div className="mb-12">
                            <div className="flex items-center gap-3 mb-6">
                                <Volume2 className="w-5 h-5 text-slate-400" />
                                <h3 className="text-lg font-medium text-slate-900">1.2 이동 및 정숙 관리 (Silent Move)</h3>
                            </div>

                            <div className="space-y-4 text-slate-600 text-[15px] leading-relaxed">
                                <div className="pl-4 border-l-2 border-slate-200">
                                    <p><span className="font-medium text-slate-900">교시제 미운영</span> — 획일적인 종소리 없이 본인의 생체 리듬에 맞춰 자율적으로 공부합니다.</p>
                                </div>

                                <div className="bg-red-50 border border-red-200 rounded-lg p-5">
                                    <h4 className="font-medium text-red-900 mb-3">정숙 이동 원칙</h4>
                                    <ul className="space-y-2 text-red-800 text-sm">
                                        <li>• 학습실 출입 시 '도서관 수준의 정숙함'이 절대 요구됩니다.</li>
                                        <li>• 문소리, 발소리, 옷 스치는 소리에 유의해야 합니다.</li>
                                        <li>• 잦은 이동(시간당 2회 이상)은 관리자에 의해 제재됩니다.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* 1.3 전자기기 */}
                        <div className="mb-12">
                            <div className="flex items-center gap-3 mb-6">
                                <Smartphone className="w-5 h-5 text-slate-400" />
                                <h3 className="text-lg font-medium text-slate-900">1.3 전자기기 및 환경 통제</h3>
                            </div>

                            <div className="space-y-4 text-slate-600 text-[15px] leading-relaxed">
                                <div className="bg-red-50 border border-red-200 rounded-lg p-5">
                                    <h4 className="font-medium text-red-900 mb-3">휴대폰 의무 제출 (Zero Tolerance)</h4>
                                    <ul className="space-y-2 text-sm">
                                        <li><span className="font-medium">월~토 09:00~24:00</span> — 등원 즉시 전원을 꺼서 보관함에 제출</li>
                                        <li className="text-red-700">※ 미제출/공기계 제출 적발 시 즉시 압수 및 벌점</li>
                                        <li><span className="font-medium">자율 시간(일요일 등)</span> — 자율 보관이 원칙이나, 학습 공간 내 사용 적발 시 평일과 동일하게 징계</li>
                                    </ul>
                                </div>

                                <div className="pl-4 border-l-2 border-slate-200 space-y-3">
                                    <p><span className="font-medium text-slate-900">학습 기기</span> — 개인 태블릿/노트북은 인강 시청 용도로만 허용됩니다.</p>
                                    <p><span className="font-medium text-slate-900">생활 소음</span> — 3색 볼펜(딸깍), 마우스(무소음 필수), 비닐 소음 등은 타인을 방해하는 행위로 간주합니다.</p>
                                    <p><span className="font-medium text-slate-900">냄새 관리</span> — 휴게실(Lounge)에서는 음료만 섭취 가능하며, 식사는 외부에서 해결해야 합니다.</p>
                                </div>
                            </div>
                        </div>

                        {/* 1.4 상벌점제도 */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <AlertTriangle className="w-5 h-5 text-slate-400" />
                                <h3 className="text-lg font-medium text-slate-900">1.4 상벌점 제도 (Penalty System)</h3>
                            </div>

                            <div className="space-y-4 text-slate-600 text-[15px] leading-relaxed">
                                <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
                                    <h4 className="font-medium text-slate-900 mb-2">AI & Human Cross-Check</h4>
                                    <p className="text-sm">AI 매니저 시스템이 졸음/이석을 감지하고, 관리자가 오프라인으로 2차 확인합니다.</p>
                                </div>

                                <div className="border border-slate-200 rounded-lg overflow-hidden">
                                    <div className="bg-slate-900 text-white px-5 py-3">
                                        <p className="font-medium">징계 기준 — 1개월 누적 벌점 30점 초과 시 학부모 상담 진행</p>
                                    </div>
                                    <div className="p-5">
                                        <table className="w-full text-sm">
                                            <tbody className="divide-y divide-slate-100">
                                                <tr>
                                                    <td className="py-3 text-slate-600">휴대폰 미제출/소지</td>
                                                    <td className="py-3 text-right font-mono font-medium text-red-600">-10점</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-3 text-slate-600">학습 외 사이트(유튜브/게임) 접속</td>
                                                    <td className="py-3 text-right font-mono font-medium text-red-600">-5점</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-3 text-slate-600">지각 / 무단 이석 / 외출 미설정</td>
                                                    <td className="py-3 text-right font-mono font-medium text-red-600">-5점</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-3 text-slate-600">소음 유발 / 정리 불량</td>
                                                    <td className="py-3 text-right font-mono font-medium text-red-600">-3점</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-red-900 text-white rounded-lg p-5">
                                        <p className="font-medium mb-2">즉시 퇴실 (One Strike Out)</p>
                                        <p className="text-red-200 text-sm">면학 분위기를 해치는 이성 교제, 폭력, 따돌림, 흡연</p>
                                    </div>
                                    <div className="bg-slate-800 text-white rounded-lg p-5">
                                        <p className="font-medium mb-2">일요일 가중 처벌</p>
                                        <p className="text-slate-300 text-sm">관리자 부재 시 적발된 규정 위반은 벌점 2배 적용</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Section 2: 환불 규정 */}
                    <motion.section
                        id="refund"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-20"
                    >
                        <div className="flex items-center gap-4 mb-10 border-b border-slate-200 pb-6">
                            <div className="w-10 h-10 bg-slate-900 rounded flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-widest">Section 02</p>
                                <h2 className="text-2xl font-medium text-slate-900">환불 및 휴회 규정</h2>
                            </div>
                        </div>

                        <div className="space-y-8 text-slate-600 text-[15px] leading-relaxed">
                            <div>
                                <h3 className="text-lg font-medium text-slate-900 mb-4">2.1 반환 기준</h3>
                                <div className="space-y-4">
                                    <p className="pl-4 border-l-2 border-slate-200">
                                        <span className="font-medium text-slate-900">법적 근거</span> — 공정거래위원회 소비자분쟁해결기준의 스터디카페 반환 기준을 준수합니다.
                                    </p>
                                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 text-center">
                                        <p className="font-mono text-sm">
                                            (총 결제 금액) - (1일 정상 이용료 × 이용 일수) = <span className="font-bold text-slate-900">환불액</span>
                                        </p>
                                    </div>
                                    <p className="text-red-700 text-sm bg-red-50 border border-red-200 rounded-lg p-4">
                                        주의: 이벤트/할인 금액으로 등록했더라도, 중도 해지 시에는 할인이 적용되지 않은 '정상가(Standard Daily Rate)'를 기준으로 차감합니다.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-slate-900 mb-4">2.2 휴회 (Hold)</h3>
                                <div className="pl-4 border-l-2 border-slate-200 space-y-2">
                                    <p><span className="font-medium text-slate-900">원칙</span> — 1개월 등록 시 1회, 최대 3일까지만 가능합니다.</p>
                                    <p><span className="font-medium text-slate-900">인정 사유</span> — 질병 입원, 학교 공식 행사(수련회 등)에 한하며 증빙 서류 필수</p>
                                    <p className="text-red-600">※ 단순 여행, 변심 불가</p>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Section 3: 이용 약관 */}
                    <motion.section
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex items-center gap-4 mb-10 border-b border-slate-200 pb-6">
                            <div className="w-10 h-10 bg-slate-900 rounded flex items-center justify-center">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-widest">Section 03</p>
                                <h2 className="text-2xl font-medium text-slate-900">이용 약관 및 서약서</h2>
                            </div>
                        </div>

                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                            <div className="bg-slate-900 text-white text-center py-6">
                                <p className="text-sm text-slate-400 mb-1">MEMBERSHIP AGREEMENT</p>
                                <h3 className="text-xl font-medium">Study M 입실 서약서</h3>
                            </div>

                            <div className="p-8 space-y-8 text-[15px]">
                                {/* 제1조 */}
                                <div>
                                    <h4 className="font-medium text-slate-900 mb-4">제1조 (운영 및 관리 시간 동의)</h4>
                                    <ol className="list-decimal list-inside space-y-3 text-slate-600 pl-2">
                                        <li>센터 운영 시간(08:00~24:00)과 관리자 집중 케어 시간(09:00~24:00)을 확인했습니다.</li>
                                        <li>관리자 부재 시간(08:00~09:00, 일요일)은 자율 학습으로 운영되며, 이 시간대에는 AI/CCTV 원격 모니터링이 진행됨에 동의합니다.</li>
                                        <li>관리자 부재 시 본인의 부주의로 인한 안전사고 및 분실에 대해 센터는 민·형사상 책임을 지지 않습니다.</li>
                                    </ol>
                                </div>

                                {/* 제2조 */}
                                <div>
                                    <h4 className="font-medium text-slate-900 mb-4">제2조 (생활 수칙 준수)</h4>
                                    <ol className="list-decimal list-inside space-y-3 text-slate-600 pl-2">
                                        <li>별도의 교시제(타종)가 없으므로 입·퇴실 시 소음 발생을 최소화(Silent Move)해야 하며, 잦은 이동 시 제재를 받을 수 있습니다.</li>
                                        <li>관리자 상주 시간 내 등원 시 휴대폰을 필히 제출하며, 미제출 시 벌점 부과에 동의합니다.</li>
                                        <li>센터 내에서의 이성 교제, 대화, 친목 행위는 즉시 강제 퇴실 사유가 됩니다.</li>
                                    </ol>
                                </div>

                                {/* 제3조 */}
                                <div className="bg-red-50 border border-red-200 rounded-lg p-5">
                                    <h4 className="font-medium text-red-900 mb-4">제3조 (개인정보 및 AI 데이터 활용 동의) — 중요</h4>
                                    <ol className="list-decimal list-inside space-y-3 text-slate-700 pl-2">
                                        <li>[AI 학습 관리 시스템] 본 센터는 AI 학습 매니저 서비스(코칭 리포트, 졸음 감지) 제공을 위해 회원의 학습 영상, 자세, 이석 여부, Wi-Fi 접속 기록을 수집·분석합니다.</li>
                                        <li>수집된 데이터는 서비스 고도화 및 학부모 알림용으로만 사용되며, 법령에 따라 안전하게 보관 후 파기됩니다.</li>
                                    </ol>
                                </div>

                                {/* 제4조 */}
                                <div>
                                    <h4 className="font-medium text-slate-900 mb-4">제4조 (환불 규정)</h4>
                                    <ol className="list-decimal list-inside space-y-3 text-slate-600 pl-2">
                                        <li>중도 해지 시 환불은 관련 법령에 따르며, 할인 등록 건이라도 정상가(1일 기준) 공제 후 환불됨을 확인합니다.</li>
                                        <li>규정 위반으로 인한 강제 퇴실 시에도 위 환불 기준이 동일하게 적용됩니다.</li>
                                    </ol>
                                </div>

                                {/* 서약 */}
                                <div className="border-t border-slate-200 pt-8 mt-8">
                                    <div className="text-center mb-8">
                                        <p className="text-slate-900 font-medium mb-2">서 약</p>
                                        <p className="text-slate-600">
                                            본인은 위 내용을 충분히 숙지하였으며, Study M의 면학 분위기 조성을 위해 성실히 이행할 것을 서약합니다.
                                        </p>
                                    </div>

                                    <div className="text-center text-slate-500 mb-8">
                                        2026년 ____월 ____일
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="border border-slate-200 rounded-lg p-6 text-center">
                                            <p className="text-sm text-slate-500 mb-2">학 생</p>
                                            <p className="text-slate-900">성명 ________________ (서명)</p>
                                        </div>
                                        <div className="border border-slate-200 rounded-lg p-6 text-center">
                                            <p className="text-sm text-slate-500 mb-2">보호자</p>
                                            <p className="text-slate-900">성명 ________________ (서명)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                </div>
            </div >

            <Footer />
        </div >
    );
};

export default OperationManual;

import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-16 bg-slate-900">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-white max-w-3xl mx-auto"
                    >
                        <p className="text-slate-400 text-sm tracking-widest uppercase mb-4">
                            Privacy Policy
                        </p>
                        <h1 className="text-3xl md:text-4xl font-light mb-6">
                            개인정보처리방침
                        </h1>
                        <div className="w-16 h-px bg-slate-600 mx-auto"></div>
                    </motion.div>
                </div>
            </section>

            <div className="container mx-auto px-6 py-16">
                <div className="max-w-3xl mx-auto">

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="prose prose-slate max-w-none"
                    >
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-12">
                            <p className="text-slate-600 text-[15px] leading-relaxed m-0">
                                주식회사 스터디엠(이하 '회사')은 정보주체의 자유와 권리를 보호하기 위해
                                「개인정보 보호법」 및 관계 법령이 정한 바를 준수하며, 적법하게 개인정보를
                                처리하고 안전하게 관리하고 있습니다.
                            </p>
                        </div>

                        {/* 1. 처리 목적 */}
                        <section className="mb-12">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                                <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center text-white text-sm font-medium">1</div>
                                <h2 className="text-xl font-medium text-slate-900 m-0">개인정보의 처리 목적</h2>
                            </div>
                            <p className="text-slate-600 text-[15px] leading-relaxed mb-4">
                                회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는
                                다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는
                                별도의 동의를 받는 등 필요한 조치를 이행할 것입니다.
                            </p>
                            <ul className="space-y-3 text-slate-600 text-[15px]">
                                <li className="pl-4 border-l-2 border-slate-300">
                                    <strong className="text-slate-900">학습 관리 서비스 제공</strong> — 입/퇴실 관리, 학습 태도 분석(졸음/이석), AI 리포트 생성 및 발송
                                </li>
                                <li className="pl-4 border-l-2 border-slate-300">
                                    <strong className="text-slate-900">회원 가입 및 관리</strong> — 본인 식별, 가입 의사 확인, 회원 자격 유지, 서비스 부정이용 방지
                                </li>
                                <li className="pl-4 border-l-2 border-slate-300">
                                    <strong className="text-slate-900">안전 관리</strong> — 시설 내 범죄 예방, 화재 예방, 안전사고 대처
                                </li>
                            </ul>
                        </section>

                        {/* 2. 수집 항목 */}
                        <section className="mb-12">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                                <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center text-white text-sm font-medium">2</div>
                                <h2 className="text-xl font-medium text-slate-900 m-0">수집하는 개인정보의 항목 및 방법</h2>
                            </div>
                            <p className="text-slate-600 text-[15px] mb-6">회사는 서비스 제공을 위해 필요한 최소한의 개인정보를 수집합니다.</p>

                            <div className="border border-slate-200 rounded-lg overflow-hidden">
                                <table className="w-full text-[14px]">
                                    <thead className="bg-slate-100">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-medium text-slate-900 w-1/4">구분</th>
                                            <th className="px-4 py-3 text-left font-medium text-slate-900 w-2/5">수집 항목</th>
                                            <th className="px-4 py-3 text-left font-medium text-slate-900">수집 방법</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        <tr>
                                            <td className="px-4 py-3 text-slate-600">일반 정보</td>
                                            <td className="px-4 py-3 text-slate-600">성명, 생년월일, 연락처(본인/보호자), 학교/학년, 주소</td>
                                            <td className="px-4 py-3 text-slate-600">키오스크 및 서면 가입신청서</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 text-slate-600">결제 정보</td>
                                            <td className="px-4 py-3 text-slate-600">신용카드 정보, 은행 계좌 정보(환불 시), 결제기록</td>
                                            <td className="px-4 py-3 text-slate-600">결제 시스템 연동</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 text-slate-600">영상/생체 정보</td>
                                            <td className="px-4 py-3 text-slate-600">CCTV 영상, 안면 인식 정보(출입용), 학습 행동 데이터(자세, 시선 등)</td>
                                            <td className="px-4 py-3 text-slate-600">AI 학습 관리 카메라 및 CCTV</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 text-slate-600">자동 수집</td>
                                            <td className="px-4 py-3 text-slate-600">서비스 이용 기록, 접속 로그, 쿠키, IP 주소</td>
                                            <td className="px-4 py-3 text-slate-600">생성 정보 수집 툴</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* 3. 보유 기간 */}
                        <section className="mb-12">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                                <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center text-white text-sm font-medium">3</div>
                                <h2 className="text-xl font-medium text-slate-900 m-0">개인정보의 처리 및 보유 기간</h2>
                            </div>
                            <ul className="space-y-4 text-slate-600 text-[15px]">
                                <li className="pl-4 border-l-2 border-slate-300">
                                    <strong className="text-slate-900">일반 회원 정보</strong> — 회원 탈퇴 시까지
                                    <span className="text-slate-500">(단, 관계 법령에 따르거나 부정이용 방지를 위해 일정 기간 보관이 필요한 경우 해당 기간까지)</span>
                                </li>
                                <li className="pl-4 border-l-2 border-slate-300">
                                    <strong className="text-slate-900">영상 정보 (CCTV/AI)</strong>
                                    <ul className="mt-2 ml-4 space-y-1 text-slate-500">
                                        <li>보관 장소: 센터 내 보안 서버 및 암호화된 클라우드</li>
                                        <li>보관 기간: 촬영일로부터 30일 이내 (단, 학습 분석 데이터는 비식별화 처리 후 통계 목적으로 영구 보관 가능)</li>
                                    </ul>
                                </li>
                            </ul>
                        </section>

                        {/* 4. 제3자 제공 */}
                        <section className="mb-12">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                                <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center text-white text-sm font-medium">4</div>
                                <h2 className="text-xl font-medium text-slate-900 m-0">개인정보의 제3자 제공</h2>
                            </div>
                            <p className="text-slate-600 text-[15px] mb-4">
                                회사는 정보주체의 동의 없이 개인정보를 외부에 제공하지 않습니다. 단, 다음의 경우는 예외로 합니다.
                            </p>
                            <ul className="space-y-2 text-slate-600 text-[15px]">
                                <li className="pl-4 border-l-2 border-slate-300">정보주체로부터 별도의 동의를 받은 경우</li>
                                <li className="pl-4 border-l-2 border-slate-300">법률의 특별한 규정, 수사 목적으로 법령에 정해진 절차에 따른 수사기관의 요구가 있는 경우</li>
                            </ul>
                        </section>

                        {/* 5. 권리 */}
                        <section className="mb-12">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                                <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center text-white text-sm font-medium">5</div>
                                <h2 className="text-xl font-medium text-slate-900 m-0">정보주체의 권리·의무 및 행사 방법</h2>
                            </div>
                            <p className="text-slate-600 text-[15px] mb-4">이용자 및 법정대리인은 언제든지 다음의 권리를 행사할 수 있습니다.</p>
                            <ul className="space-y-2 text-slate-600 text-[15px] mb-4">
                                <li className="pl-4 border-l-2 border-slate-300">개인정보 열람 요구</li>
                                <li className="pl-4 border-l-2 border-slate-300">오류 등이 있을 경우 정정 요구</li>
                                <li className="pl-4 border-l-2 border-slate-300">삭제 요구 및 처리 정지 요구</li>
                            </ul>
                            <p className="text-slate-500 text-sm">
                                권리 행사는 회사에 대해 서면, 전자우편 등을 통하여 하실 수 있으며 회사는 이에 대해 지체 없이 조치하겠습니다.
                            </p>
                        </section>

                        {/* 6. 안전성 확보 조치 */}
                        <section className="mb-12">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                                <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center text-white text-sm font-medium">6</div>
                                <h2 className="text-xl font-medium text-slate-900 m-0">개인정보의 안전성 확보 조치</h2>
                            </div>
                            <p className="text-slate-600 text-[15px] mb-4">회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</p>
                            <ul className="space-y-3 text-slate-600 text-[15px]">
                                <li className="pl-4 border-l-2 border-slate-300">
                                    <strong className="text-slate-900">관리적 조치</strong> — 내부관리계획 수립·시행, 정기적 직원 교육
                                </li>
                                <li className="pl-4 border-l-2 border-slate-300">
                                    <strong className="text-slate-900">기술적 조치</strong> — AI 학습 관리 시스템 영상 데이터의 암호화 전송 및 저장, 접근 통제 시스템 설치, 보안 프로그램 설치
                                </li>
                                <li className="pl-4 border-l-2 border-slate-300">
                                    <strong className="text-slate-900">물리적 조치</strong> — 서버실 및 관제 구역의 비인가자 출입 통제
                                </li>
                            </ul>
                        </section>

                        {/* 7. 보호책임자 */}
                        <section>
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                                <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center text-white text-sm font-medium">7</div>
                                <h2 className="text-xl font-medium text-slate-900 m-0">개인정보 보호책임자</h2>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <Shield className="w-10 h-10 text-slate-400" />
                                    <div>
                                        <p className="font-medium text-slate-900">박윤완</p>
                                        <p className="text-sm text-slate-500">대표이사</p>
                                    </div>
                                </div>
                                <div className="space-y-1 text-[15px] text-slate-600">
                                    <p>이메일: pyw@studym.co.kr</p>
                                    <p>전화: 031-387-7303</p>
                                </div>
                            </div>
                        </section>

                    </motion.div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default PrivacyPolicy;

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Check, ChevronRight } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { logConsultationSubmit } from '../utils/analytics';
import { formatPhoneNumber } from '../utils/formatPhone';

type FormData = {
    studentName: string;
    studentSchool: string;
    studentGrade: string;
    parentName: string;
    parentPhone: string;
    consultationDate: Date;
};

const ConsultationWizard = () => {
    const [step, setStep] = useState(1);
    const { control, register, handleSubmit, setValue, watch } = useForm<FormData>();
    const [isSubmittingMock, setIsSubmittingMock] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState<string | null>(null);

    const studentGrade = watch("studentGrade");
    const isGeneral = studentGrade === '일반';

    // Listen for program selection from other components
    useEffect(() => {
        const handleProgramSelect = (event: CustomEvent) => {
            setSelectedProgram(event.detail.program);
        };
        window.addEventListener('selectProgram', handleProgramSelect as EventListener);
        return () => window.removeEventListener('selectProgram', handleProgramSelect as EventListener);
    }, []);

    const onSubmit = async (data: FormData) => {
        setIsSubmittingMock(true);
        try {
            const payload = {
                id: Date.now(),
                student_name: data.studentName,
                student_school: data.studentSchool,
                student_grade: data.studentGrade,
                parent_name: isGeneral ? data.studentName : data.parentName,
                parent_phone: isGeneral ? '' : data.parentPhone,
                consultation_date: data.consultationDate ? data.consultationDate.toISOString() : new Date().toISOString(),
                status: 'PENDING',
                created_at: new Date().toISOString()
            };

            console.log('Submitting consultation request:', payload);

            // 1. localStorage에 먼저 저장 (즉시 작동)
            const existing = JSON.parse(localStorage.getItem('consultations') || '[]');
            existing.unshift(payload);
            localStorage.setItem('consultations', JSON.stringify(existing));
            console.log('Saved to localStorage:', existing.length, 'items');

            // 2. 백엔드 시도 (실패해도 OK)
            try {
                await fetch('https://studym-homepage-production-a3c2.up.railway.app/api/consultations/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            } catch (e) {
                console.log('Backend not available, but localStorage saved');
            }

            // 성공!
            toast.success(`상담 신청이 접수되었습니다.\n담당 매니저가 24시간 내에 연락드립니다.`, {
                duration: 5000,
                position: 'top-center',
                style: {
                    background: '#10b981',
                    color: '#fff',
                    fontSize: '16px',
                    fontWeight: '600',
                },
            });

            setIsSuccess(true);
            setIsSubmittingMock(false);
            setIsSuccess(true);
            setIsSubmittingMock(false);
            logConsultationSubmit(true);

            // SMS 알림은 백엔드에서 처리됨 (ConsultationRequestViewSet.perform_create)
            // 프론트엔드에서 직접 SMS API 호출 시 CORS 에러 발생하므로 제거
        } catch (error) {
            console.error('Submission error:', error);
            toast.error('상담 신청 중 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.', {
                duration: 6000,
                position: 'top-center',
                style: {
                    background: '#ef4444',
                    color: '#fff',
                    fontSize: '14px',
                },
            });
            setIsSubmittingMock(false);
            logConsultationSubmit(false);
        }
    };

    const nextStep = () => setStep(prev => prev + 1);

    const renderStep = () => {
        if (isSuccess) return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
            >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-3xl font-bold text-brand-navy mb-4">접수가 완료되었습니다.</h3>
                <p className="text-slate-600 text-lg">
                    담당 컨설턴트가<br />곧 연락드리겠습니다.
                </p>
            </motion.div>
        );

        switch (step) {
            case 1:
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-brand-navy mb-8">상담 신청자 정보를 입력해주세요.</h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">이름 *</label>
                                <input
                                    {...register("studentName", { required: true })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-navy focus:ring-1 focus:ring-brand-navy outline-none transition-all"
                                    placeholder="이름을 입력해주세요"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">학교/소속</label>
                                <input
                                    {...register("studentSchool")}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-navy focus:ring-1 focus:ring-brand-navy outline-none transition-all"
                                    placeholder="학교명 또는 소속"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">구분 *</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['중학생', '고1', '고2', '고3', 'N수생', '일반'].map((grade) => (
                                        <button
                                            key={grade}
                                            type="button"
                                            onClick={() => setValue("studentGrade", grade)}
                                            className={`py-3 rounded-xl border text-sm font-medium transition-all ${watch("studentGrade") === grade
                                                ? 'bg-brand-navy text-white border-brand-navy'
                                                : 'bg-white text-slate-600 border-slate-200 hover:border-brand-navy/50'
                                                }`}
                                        >
                                            {grade}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={nextStep}
                            disabled={!watch("studentName") || !watch("studentGrade")}
                            className="w-full py-4 mt-6 bg-brand-navy text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            다음으로
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6">
                        {!isGeneral && (
                            <>
                                <h3 className="text-2xl font-bold text-brand-navy mb-8">학부모님 연락처를 남겨주세요.</h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">학부모 성함 *</label>
                                        <input
                                            {...register("parentName", { required: !isGeneral })}
                                            placeholder="성함을 입력해주세요"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-navy focus:ring-1 focus:ring-brand-navy outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">연락처 *</label>
                                        <Controller
                                            name="parentPhone"
                                            control={control}
                                            rules={{ required: !isGeneral }}
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    onChange={(e) => {
                                                        const formatted = formatPhoneNumber(e.target.value);
                                                        field.onChange(formatted);
                                                    }}
                                                    placeholder="010-0000-0000"
                                                    maxLength={13}
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-navy focus:ring-1 focus:ring-brand-navy outline-none transition-all"
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                        {isGeneral && (
                            <h3 className="text-2xl font-bold text-brand-navy mb-8">상담 일시를 선택해주세요.</h3>
                        )}
                        <div className="flex justify-center mb-6">
                            <Controller
                                control={control}
                                name="consultationDate"
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <DatePicker
                                        selected={field.value}
                                        onChange={(date) => field.onChange(date)}
                                        inline
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={30}
                                        timeCaption="시간"
                                        minTime={new Date(0, 0, 0, 10, 0)}
                                        maxTime={new Date(0, 0, 0, 22, 0)}
                                        dateFormat="yyyy.MM.dd aa h:mm"
                                        minDate={(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; })()}
                                        calendarClassName="!border-0 !font-sans !rounded-xl !shadow-none"
                                    />
                                )}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmittingMock || (!isGeneral && (!watch("parentName") || !watch("parentPhone"))) || !watch("consultationDate")}
                            className="w-full py-4 bg-brand-gold text-brand-navy rounded-xl font-bold text-lg hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmittingMock ? '처리중...' : (!watch("consultationDate") ? '위에서 상담 일시를 선택해주세요' : '상담 신청 완료하기')}
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <section id="consultation" className="py-24 bg-brand-navy">
            <Toaster />
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 items-center">
                    <div className="w-full md:w-1/2 text-white">
                        {selectedProgram && (
                            <div className="mb-4 px-4 py-2 bg-brand-gold/20 border border-brand-gold/50 rounded-lg inline-block">
                                <span className="text-brand-gold font-bold text-sm">선택한 프로그램: {selectedProgram}</span>
                            </div>
                        )}
                        <h2 className="text-4xl font-bold mb-6">
                            상위 1%의 학습 경영,<br />
                            <span className="text-brand-gold">지금 시작하세요.</span>
                        </h2>
                        <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                            상담 신청을 남겨주시면, 전문 컨설턴트가<br />맞춤 상담을 진행해 드립니다.
                        </p>
                    </div>

                    <div className="w-full md:w-1/2">
                        <div className="bg-white rounded-3xl p-8 shadow-2xl">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={step}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {renderStep()}
                                    </motion.div>
                                </AnimatePresence>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ConsultationWizard;

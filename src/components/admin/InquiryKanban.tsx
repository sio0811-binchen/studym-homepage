import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Calendar, MapPin } from 'lucide-react';
import type { Inquiry } from '../../utils/mockData';

interface InquiryKanbanProps {
    inquiries: Inquiry[];
    onStatusChange: (inquiryId: string, newStatus: Inquiry['status']) => void;
}

const InquiryKanban = ({ inquiries, onStatusChange }: InquiryKanbanProps) => {
    const [draggedId, setDraggedId] = useState<string | null>(null);

    const stages: Array<{ id: Inquiry['status']; label: string; color: string }> = [
        { id: 'pending', label: 'Pending', color: 'bg-yellow-50 border-yellow-200' },
        { id: 'contacted', label: 'Contacted', color: 'bg-blue-50 border-blue-200' },
        { id: 'registered', label: 'Registered', color: 'bg-green-50 border-green-200' },
    ];

    const getInquiriesByStatus = (status: Inquiry['status']) => {
        return inquiries.filter(inq => inq.status === status);
    };

    const handleDragStart = (id: string) => {
        setDraggedId(id);
    };

    const handleDrop = (status: Inquiry['status']) => {
        if (draggedId) {
            onStatusChange(draggedId, status);
            setDraggedId(null);
        }
    };

    const InquiryCard = ({ inquiry }: { inquiry: Inquiry }) => (
        <motion.div
            draggable
            onDragStart={() => handleDragStart(inquiry.id)}
            whileHover={{ scale: 1.02 }}
            className="bg-white p-4 rounded-xl shadow-md border border-slate-200 cursor-move hover:shadow-lg transition-all mb-3"
        >
            <h4 className="font-bold text-brand-navy mb-2">{inquiry.studentName}</h4>

            <div className="space-y-1 text-xs text-slate-600 mb-3">
                <div className="flex items-center space-x-2">
                    <Phone className="w-3 h-3" />
                    <span className="font-mono">{inquiry.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <MapPin className="w-3 h-3" />
                    <span>{inquiry.targetUniversity}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(inquiry.createdAt).toLocaleDateString()}</span>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <span className="px-2 py-1 bg-brand-gold/10 text-brand-gold text-xs rounded-full">
                    {inquiry.weakSubject}
                </span>
                <span className="text-xs text-slate-400">{inquiry.parentName}</span>
            </div>

            {inquiry.notes && (
                <p className="text-xs text-slate-500 mt-2 italic">"{inquiry.notes}"</p>
            )}
        </motion.div>
    );

    return (
        <div className="grid grid-cols-3 gap-4">
            {stages.map(stage => (
                <div
                    key={stage.id}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(stage.id)}
                    className={`p-4 rounded-2xl border-2 ${stage.color} min-h-[500px] transition-all ${draggedId ? 'ring-2 ring-brand-gold' : ''
                        }`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-brand-navy">{stage.label}</h3>
                        <span className="px-2 py-1 bg-white rounded-full text-xs font-bold text-slate-600">
                            {getInquiriesByStatus(stage.id).length}
                        </span>
                    </div>

                    <div className="space-y-3">
                        {getInquiriesByStatus(stage.id).map(inquiry => (
                            <InquiryCard key={inquiry.id} inquiry={inquiry} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default InquiryKanban;

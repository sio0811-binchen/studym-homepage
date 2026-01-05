import { motion } from 'framer-motion';
import { Users, FileText, Smartphone } from 'lucide-react';

const CommunicationVisual = () => {
    return (
        <div className="w-full max-w-sm mx-auto p-8 bg-slate-900/50 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl h-[400px] flex items-center justify-center relative overflow-hidden">

            {/* Central Node (Report) */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <div className="w-20 h-20 bg-brand-gold rounded-2xl flex flex-col items-center justify-center shadow-[0_0_30px_rgba(197,160,89,0.4)]">
                    <FileText className="w-8 h-8 text-brand-navy mb-1" />
                    <span className="text-[10px] font-bold text-brand-navy">REPORT</span>
                </div>
            </motion.div>

            {/* Nodes */}
            {/* Student (Top) */}
            <motion.div
                className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center z-10"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center backdrop-blur mb-2 border border-white/20">
                    <Users className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-bold text-white">STUDENT</span>
            </motion.div>

            {/* Parent (Bottom Left) */}
            <motion.div
                className="absolute bottom-10 left-6 flex flex-col items-center z-10"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
            >
                <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center backdrop-blur mb-2 border border-white/20">
                    <Smartphone className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-bold text-white">PARENT</span>
            </motion.div>

            {/* Manager (Bottom Right) */}
            <motion.div
                className="absolute bottom-10 right-6 flex flex-col items-center z-10"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
            >
                <div className="w-14 h-14 bg-brand-navy rounded-full flex items-center justify-center border-2 border-brand-gold shadow-lg mb-2">
                    <Users className="w-6 h-6 text-brand-gold" />
                </div>
                <span className="text-sm font-bold text-brand-gold">MANAGER</span>
            </motion.div>

            {/* Connection Lines (Triangle) */}
            <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                <motion.path
                    d="M192 80 L60 300" // Top to Bottom Left
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 1.5 }}
                />
                <motion.path
                    d="M192 80 L324 300" // Top to Bottom Right
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                />
                <motion.path
                    d="M60 300 L324 300" // Bottom Left to Bottom Right
                    stroke="rgba(197,160,89,0.3)"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 1 }}
                />
            </svg>

            {/* Flowing Data Particles */}
            <motion.div
                className="absolute w-2 h-2 bg-brand-gold rounded-full shadow-[0_0_10px_#C5A059]"
                animate={{
                    x: [192, 60], // Top to Parent
                    y: [80, 300],
                    opacity: [0, 1, 0]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                style={{ position: 'absolute', top: 0, left: 0 }}
            />
            <motion.div
                className="absolute w-2 h-2 bg-brand-gold rounded-full shadow-[0_0_10px_#C5A059]"
                animate={{
                    x: [324, 60], // Manager to Parent
                    y: [300, 300],
                    opacity: [0, 1, 0]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
                style={{ position: 'absolute', top: 0, left: 0 }}
            />

        </div>
    );
};

export default CommunicationVisual;

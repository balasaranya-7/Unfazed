import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const Toast = () => {
  const { toast } = useData();

  if (!toast) return null;

  const isError = toast.type === 'error';
  const isInfo = toast.type === 'info';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl bg-white border border-misty/30 card-shadow"
      >
        <div className={`p-1.5 rounded-xl ${
          isError ? 'bg-rosewood-light text-rosewood' : isInfo ? 'bg-misty-light text-midnight' : 'bg-sage-light text-sage-dark'
        }`}>
          {isError ? <AlertCircle size={20} /> : isInfo ? <Info size={20} /> : <CheckCircle2 size={20} />}
        </div>
        <div>
          <p className="text-sm font-semibold text-midnight">{toast.message}</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;

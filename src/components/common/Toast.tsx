import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: { text: string; type: 'success' | 'error' | 'info' } | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  const isSuccess = message.type === 'success';
  const isError = message.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-fade-in">
      <div
        className={`flex items-start gap-3 rounded-xl border p-4 shadow-xl backdrop-blur-md transition-all ${
          isSuccess
            ? 'border-emerald-500/30 bg-emerald-950/90 text-emerald-100'
            : isError
            ? 'border-rose-500/30 bg-rose-950/90 text-rose-100'
            : 'border-slate-500/30 bg-slate-900/90 text-slate-100'
        }`}
      >
        <div className="mt-0.5 shrink-0">
          {isSuccess && <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
          {isError && <AlertCircle className="h-5 w-5 text-rose-400" />}
          {!isSuccess && !isError && <Info className="h-5 w-5 text-blue-400" />}
        </div>
        <div className="flex-1 text-sm font-medium leading-relaxed">{message.text}</div>
        <button
          onClick={onClose}
          className="shrink-0 rounded-lg p-1 text-white/60 hover:bg-white/10 hover:text-white"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

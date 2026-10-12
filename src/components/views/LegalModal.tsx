import React from 'react';
import { X, Shield, FileCheck } from 'lucide-react';
import { soundFx } from '../../utils/audio';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const isPrivacy = type === 'privacy';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-[#111114] border border-[#D4AF37]/40 p-6 sm:p-8 shadow-2xl flex flex-col gap-6 text-zinc-300 text-xs sm:text-sm leading-relaxed">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#FFE08A]">
              {isPrivacy ? <Shield className="w-5 h-5" /> : <FileCheck className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#FFE08A]">
                Official Legal Protocol
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold uppercase text-white">
                {isPrivacy ? 'Privacy & Data Governance' : 'Terms of Use & Code of Conduct'}
              </h2>
            </div>
          </div>
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isPrivacy ? (
          <div className="space-y-4">
            <p>
              <strong>1. Local Storage Primacy:</strong> ASPIRE WORK is engineered with client-side sovereignty. Your saved quotes, daily discipline checklist states, and custom tasks are stored directly inside your browser’s LocalStorage and are not broadcasted to external tracking servers.
            </p>
            <p>
              <strong>2. Zero Tracking & No Data Selling:</strong> We do not deploy third-party advertising trackers or sell personal user telemetry. Inquiries sent via the executive contact channel are treated with absolute discretion.
            </p>
            <p>
              <strong>3. Client-Side Integrity:</strong> You have full control over your saved quotes and checklist records; clearing your browser cache or pressing “Purge All” in the Saved Vault completely wipes your local data.
            </p>
            <p>
              <strong>4. Contact Information:</strong> For inquiries regarding data handling or confidential requests, contact <span className="text-[#FFE08A] font-mono">director@aspirework.vip</span>.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p>
              <strong>1. Acceptance of Terms:</strong> By accessing ASPIRE WORK, you commit to our standard of personal accountability, discipline, and respectful engagement with our intellectual properties and media directives.
            </p>
            <p>
              <strong>2. Intellectual Property & Brand Assets:</strong> All original aphorisms, visual layouts, logos, and curated doctrines are the proprietary work of ASPIRE WORK. You are authorized to share quotes for personal motivation and non-commercial social media sharing with brand attribution.
            </p>
            <p>
              <strong>3. No Financial or Medical Advice:</strong> All motivational content, financial mindset principles, and discipline checklists are provided for educational and philosophical inspiration only. Consult qualified professionals for specific wealth management and medical decisions.
            </p>
            <p>
              <strong>4. Governing Standard:</strong> Operated in accordance with international standards of high-performance media excellence.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-white/[0.08] flex justify-end">
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="px-6 py-2.5 rounded-lg text-xs uppercase tracking-widest font-semibold text-[#050505] bg-gradient-to-r from-[#FFE08A] to-[#D4AF37] hover:brightness-110 transition-all cursor-pointer"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};

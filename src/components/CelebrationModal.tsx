import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, Award, CheckCircle, MessageCircle, Video } from 'lucide-react';
import { MentorRequest } from '../types';

interface CelebrationModalProps {
  isOpen: boolean;
  request: MentorRequest | null;
  onClose: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  request,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen) {
      // A single, restrained burst in brand colors — a small acknowledgment, not a show
      confetti({
        particleCount: 60,
        spread: 65,
        startVelocity: 32,
        gravity: 1.1,
        ticks: 150,
        origin: { y: 0.5 },
        colors: ['#0B6291', '#3D781D', '#B87E13'],
      });
    }
  }, [isOpen]);

  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md p-3 sm:p-6 flex items-start sm:items-center justify-center py-6 sm:py-12 animate-fadeIn">
      <div className="relative w-full max-w-lg my-auto bg-[#0C1836] border-2 border-[#3D781D] rounded-3xl p-5 sm:p-8 shadow-2xl text-white text-center overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* BACKGROUND GLOW */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#3D781D]/30 to-transparent pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-900/60 rounded-full border border-slate-700/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative z-10 space-y-5">
          
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-tr from-[#3D781D] via-[#B87E13] to-[#0B6291] p-1 shadow-xl flex items-center justify-center">
            <div className="w-full h-full bg-[#0C1836] rounded-full flex items-center justify-center">
              <Award className="w-10 h-10 text-[#3D781D]" />
            </div>
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 bg-[#3D781D]/20 text-emerald-400 border border-[#3D781D]/50 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              <CheckCircle className="w-3.5 h-3.5" />
              Pairing Approved
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-white">
              Congratulations! <br />
              <span className="text-[#3D781D]">Connection Established</span>
            </h2>
            <p className="text-xs text-slate-300 mt-2">
              Your mentorship pairing request has been fully verified and accepted by both Admin and Mentor!
            </p>
          </div>

          {/* PAIRING DETAILS CARD */}
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center justify-around gap-3 text-left">
            <div className="flex items-center gap-3">
              <img
                src={request.menteeAvatar}
                alt={request.menteeName}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-[#0B6291]"
              />
              <div>
                <p className="text-xs text-slate-400">Mentee</p>
                <p className="text-sm font-bold text-white">{request.menteeName}</p>
              </div>
            </div>

            <div className="text-slate-500 font-extrabold text-lg">&harr;</div>

            <div className="flex items-center gap-3">
              <img
                src={request.mentorAvatar}
                alt={request.mentorName}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-[#3D781D]"
              />
              <div>
                <p className="text-xs text-slate-400">Mentor</p>
                <p className="text-sm font-bold text-white">{request.mentorName}</p>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <a
              href={`https://wa.me/${request.mentorWhatsApp || request.menteeWhatsApp}?text=Hello!%20I%20am%20connected%20with%20you%20via%20MENTMINDS%20Mentorship%20Platform.`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-transform hover:scale-105"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950" />
              <span>Connect on WhatsApp</span>
            </a>

            <button
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-3 px-4 rounded-xl transition-colors"
            >
              Go to Learning Hub
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

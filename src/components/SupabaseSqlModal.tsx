import React, { useState } from 'react';
import { SUPABASE_SQL_SCHEMA } from '../data/supabaseSchema';
import { X, Copy, Check, Database, ShieldCheck, Terminal } from 'lucide-react';

interface SupabaseSqlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSqlModal: React.FC<SupabaseSqlModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md p-3 sm:p-6 flex items-start sm:items-center justify-center py-6 sm:py-12 animate-fadeIn">
      <div className="relative w-full max-w-4xl my-auto bg-[#0C1836] border border-[#0B6291]/60 rounded-3xl p-5 sm:p-8 shadow-2xl text-white flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#0B6291]/20 border border-[#0B6291]/50 rounded-xl text-[#0B6291]">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-['Outfit'] text-white">
                Supabase SQL Database Setup Script
              </h3>
              <p className="text-xs text-slate-300">
                PostgreSQL Tables, RLS Security Policies & Auth Triggers for MENTMINDS (RC8946867)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="bg-[#3D781D] hover:bg-[#326317] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-colors shadow-md"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-900 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* GUIDANCE */}
        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 mb-4 flex items-center gap-2 shrink-0">
          <Terminal className="w-4 h-4 text-[#B87E13] shrink-0" />
          <span>
            Instructions: Open your Supabase Dashboard &rarr; SQL Editor &rarr; Paste this script &rarr; Click 'Run' to auto-create all tables and Row-Level Security policies.
          </span>
        </div>

        {/* CODE CONTAINER */}
        <div className="flex-1 overflow-y-auto bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-emerald-400 leading-relaxed scrollbar-thin">
          <pre className="whitespace-pre-wrap">{SUPABASE_SQL_SCHEMA}</pre>
        </div>

      </div>
    </div>
  );
};

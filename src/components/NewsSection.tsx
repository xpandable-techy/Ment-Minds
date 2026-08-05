import React, { useState } from 'react';
import { storeManager } from '../lib/supabase';
import { NewsArticle } from '../types';
import { Newspaper, Mail, Send, CheckCircle2, Calendar, User } from 'lucide-react';

interface NewsSectionProps {
  news: NewsArticle[];
}

export const NewsSection: React.FC<NewsSectionProps> = ({ news }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [activeArticleModal, setActiveArticleModal] = useState<NewsArticle | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    storeManager.subscribeNewsletter(email.trim());
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <section id="news" className="py-20 bg-white text-[#0C1836] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-1 bg-[#9E1B4E]"></div>
              <h4 className="text-xs font-black uppercase tracking-widest text-[#9E1B4E]">
                Official Press & Announcements
              </h4>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-['Outfit'] text-[#0C1836] tracking-tight mt-1">
              News & Impact Stories
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 font-medium">
              Updates from MENTMINDS advocacy campaigns, graduate cohorts, and child protection legal milestones.
            </p>
          </div>
        </div>

        {/* NEWS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {news.map((article) => (
            <div
              key={article.id}
              onClick={() => setActiveArticleModal(article)}
              className="bg-[#F8FAFC] border-2 border-slate-900 rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(12,24,54,0.08)] hover:shadow-[8px_8px_0px_0px_rgba(158,27,78,0.2)] transition-all duration-300 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="relative h-48 bg-slate-900 overflow-hidden">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute top-3 left-3 bg-[#0C1836] text-[#B87E13] border-2 border-[#B87E13] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                    {article.category}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-slate-600 font-extrabold">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#0B6291]" />
                      {article.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#3D781D]" />
                      {article.author}
                    </span>
                  </div>

                  <h3 className="font-black text-lg text-[#0C1836] font-['Outfit'] leading-snug group-hover:text-[#0B6291] transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-medium">
                    {article.summary}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 text-xs font-black uppercase tracking-wider text-[#0B6291] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Read Full Impact Story &rarr;</span>
              </div>
            </div>
          ))}
        </div>

        {/* NEWSLETTER SUBSCRIBE CARD */}
        <div className="bg-gradient-to-r from-[#0C1836] via-[#0B6291] to-[#7B2D8C] rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <span className="bg-[#B87E13]/30 text-[#B87E13] border border-[#B87E13]/50 text-xs font-bold px-3 py-1 rounded-full uppercase">
              Stay Connected
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold font-['Outfit']">
              Subscribe to MENTMINDS Newsletter
            </h3>
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
              Get weekly session flyers, child advocacy updates, and mentorship opportunity alerts directly in your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <div className="relative w-full sm:w-96">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full bg-slate-900/90 border border-slate-700 focus:border-[#B87E13] text-white rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto bg-[#3D781D] hover:bg-[#326317] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                <Send className="w-4 h-4" />
                <span>Subscribe Now</span>
              </button>
            </form>

            {subscribed && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-700 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Thank you for subscribing! You are now connected with MENTMINDS updates.</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ARTICLE READER MODAL */}
      {activeArticleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setActiveArticleModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900 bg-slate-100 rounded-full transition-colors"
            >
              ✕
            </button>

            <span className="text-xs font-bold text-[#0B6291] bg-[#0B6291]/10 px-3 py-1 rounded-full uppercase">
              {activeArticleModal.category}
            </span>

            <h3 className="text-2xl font-bold font-['Outfit'] text-[#0C1836] mt-3">
              {activeArticleModal.title}
            </h3>

            <div className="flex items-center gap-4 text-xs text-slate-500 my-3 pb-3 border-b border-slate-200">
              <span>Date: {activeArticleModal.date}</span>
              <span>Author: {activeArticleModal.author}</span>
            </div>

            <img
              src={activeArticleModal.imageUrl}
              alt={activeArticleModal.title}
              className="w-full h-60 object-cover rounded-xl mb-4"
            />

            <p className="text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-line">
              {activeArticleModal.content}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

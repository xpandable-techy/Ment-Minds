import React, { useState } from 'react';
import { Flyer } from '../types';
import { Video, Calendar, Clock, ExternalLink, Search, Tag, X, Image as ImageIcon } from 'lucide-react';

interface FlyerShowcaseProps {
  flyers: Flyer[];
}

export const FlyerShowcase: React.FC<FlyerShowcaseProps> = ({ flyers }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFlyerModal, setActiveFlyerModal] = useState<Flyer | null>(null);

  const categories = ['All', ...Array.from(new Set(flyers.map((f) => f.category)))];

  const filteredFlyers = flyers.filter((f) => {
    const matchesCategory = selectedCategory === 'All' || f.category === selectedCategory;
    const matchesSearch =
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.speaker.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="webinars" className="py-20 bg-[#F8FAFC] text-[#0C1836] border-b-4 border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-1 bg-[#3D781D]"></div>
              <h4 className="text-xs font-black uppercase tracking-widest text-[#3D781D]">
                Capacity Building & Masterclasses
              </h4>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-['Outfit'] text-[#0C1836] tracking-tight mt-1">
              Weekly Webinars & Event Flyers
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 font-medium">
              100% Free Live Google Meet sessions hosted by legal experts, software engineers, and rights advocates.
            </p>
          </div>

          {/* SEARCH */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search topics or speakers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-2 border-slate-300 focus:border-[#0B6291] rounded-xl pl-9 pr-3 py-2 text-xs font-black text-slate-900 focus:outline-none shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* CATEGORY TABS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-black uppercase tracking-wider px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#0C1836] text-white shadow-md border-2 border-[#0C1836]'
                  : 'bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FLYERS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredFlyers.map((flyer) => (
            <div
              key={flyer.id}
              className="bg-white border-2 border-slate-900 rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(12,24,54,0.1)] hover:shadow-[8px_8px_0px_0px_rgba(12,24,54,1)] transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* FLYER IMAGE BANNER */}
                <div className="relative h-44 sm:h-48 bg-slate-950 overflow-hidden flex items-center justify-center">
                  <img
                    src={flyer.imageUrl}
                    alt={flyer.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                  />

                  {/* GOOGLE MEET BADGE (TOP RIGHT) */}
                  <div className="absolute top-2.5 right-2.5 bg-[#25D366] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md border border-white z-10">
                    <Video className="w-3 h-3" />
                    <span>Google Meet</span>
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white bg-slate-950/85 p-2 rounded-lg backdrop-blur-xs border border-slate-800">
                    <p className="text-[11px] text-amber-300 font-black truncate">Speaker: {flyer.speaker}</p>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-4 sm:p-5 space-y-2.5">
                  {/* CATEGORY TAG (PLACED CLEANLY IN CONTENT ROW) */}
                  <div>
                    <span className="inline-flex items-center gap-1 bg-[#0C1836] text-[#B87E13] border border-[#B87E13]/50 text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                      <Tag className="w-3 h-3" />
                      <span>{flyer.category}</span>
                    </span>
                  </div>

                  <h3 className="font-black text-base text-[#0C1836] font-['Outfit'] line-clamp-2 leading-snug">
                    {flyer.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-slate-700 font-black flex-wrap">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#0B6291]" />
                      <span>{flyer.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#3D781D]" />
                      <span>{flyer.time}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                    {flyer.description}
                  </p>
                </div>
              </div>

              {/* ACTION FOOTER */}
              <div className="px-4 sm:px-5 pb-5 pt-1 flex items-center gap-2.5">
                <button
                  onClick={() => setActiveFlyerModal(flyer)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-[11px] uppercase tracking-wider py-2.5 rounded-xl transition-colors border border-slate-300"
                >
                  View Poster
                </button>
                <a
                  href={flyer.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#3D781D] hover:bg-[#326317] text-white font-black text-[11px] uppercase tracking-wider px-3.5 py-2.5 rounded-xl flex items-center gap-1 shadow-md transition-colors border border-[#3D781D]"
                >
                  <span>Join</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* COMPACT FLYER POSTER MODAL */}
      {activeFlyerModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md p-3 sm:p-6 flex items-start sm:items-center justify-center py-6 sm:py-12 animate-fadeIn">
          <div className="relative w-full max-w-md my-auto bg-white border-2 border-slate-900 rounded-3xl overflow-hidden shadow-2xl text-slate-900 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setActiveFlyerModal(null)}
              className="absolute top-3 right-3 p-1.5 bg-slate-900/90 text-white hover:bg-slate-800 rounded-full z-30 transition-colors border border-slate-700 shadow-md"
              title="Close Poster"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="bg-slate-950 p-2 flex items-center justify-center">
              <img
                src={activeFlyerModal.imageUrl}
                alt={activeFlyerModal.title}
                className="w-full max-h-52 object-contain rounded-xl"
              />
            </div>

            <div className="p-5 space-y-3">
              <span className="text-[10px] font-black text-[#0B6291] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                {activeFlyerModal.category}
              </span>
              <h3 className="text-xl font-black font-['Outfit'] text-[#0C1836] leading-tight">
                {activeFlyerModal.title}
              </h3>
              <p className="text-xs font-black text-[#3D781D]">
                Key Speaker: {activeFlyerModal.speaker}
              </p>
              <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 border border-slate-200 p-3 rounded-xl">
                {activeFlyerModal.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-800 font-black pt-1">
                <div>
                  <span className="text-slate-400 text-[10px] font-bold block uppercase">Date</span>
                  {activeFlyerModal.date}
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-bold block uppercase">Time</span>
                  {activeFlyerModal.time}
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-bold block uppercase">Platform</span>
                  Google Meet (100% Free)
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={activeFlyerModal.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#3D781D] hover:bg-[#326317] text-white font-black text-xs uppercase tracking-wider py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors border border-[#3D781D]"
                >
                  <Video className="w-4 h-4" />
                  <span>Launch Google Meet Session</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

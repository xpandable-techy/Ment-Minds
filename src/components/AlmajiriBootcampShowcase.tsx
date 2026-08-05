import React, { useState } from 'react';
import { Hammer, Scissors, Laptop, MapPin, Calendar, Award, CheckCircle2, ChevronRight, X, HeartHandshake } from 'lucide-react';

interface BootcampGalleryItem {
  id: string;
  title: string;
  category: 'vocational' | 'tailoring' | 'carpentry' | 'bootcamp' | 'outreach';
  categoryLabel: string;
  location: string;
  date: string;
  imageUrl: string;
  shortDesc: string;
  fullDesc: string;
  impactMetric: string;
  icon: React.ReactNode;
}

const BOOTCAMP_GALLERY: BootcampGalleryItem[] = [
  {
    id: 'almajiri-skills',
    title: 'Almajiri Computer Literacy & Digital Skills Training',
    category: 'vocational',
    categoryLabel: 'Digital & Computer Skills',
    location: 'Kawo, Kaduna State',
    date: '2025 Outreach',
    imageUrl: '/flyers/almajiri skills.jpg',
    shortDesc: 'Hands-on computer training, printing, typing, and digital tools for Tsangaya Almajiri children.',
    fullDesc: 'In partnership with Ahmad Graphix Design LTD, Almajiri youth from local Tsangaya schools receive 100% free computer training, learning printing, document formatting, graphic design basics, and essential digital skills to build modern careers.',
    impactMetric: '20 Almajiri Mentees Enrolled',
    icon: <Laptop className="w-4 h-4 text-[#0B6291]" />,
  },
  {
    id: 'carpentry-children',
    title: 'Children Woodwork & Carpentry Apprenticeship',
    category: 'carpentry',
    categoryLabel: 'Carpentry & Woodwork',
    location: 'Kawo Workshop',
    date: '2025 Vocational Session',
    imageUrl: '/flyers/capentry children.jpg',
    shortDesc: 'Practical woodwork training teaching children to construct chairs, tables, and wooden fittings.',
    fullDesc: 'Partnered with Black Bature Company, young Almajiri apprentices receive hands-on training in carpentry, mastering wood cutting, sanding, assembly, and furniture fabrication to foster self-reliance.',
    impactMetric: 'Furniture Craftsmanship Training',
    icon: <Hammer className="w-4 h-4 text-[#B87E13]" />,
  },
  {
    id: 'carpentry-workshop',
    title: 'Master Carpentry & Furniture Fabrication Workshop',
    category: 'carpentry',
    categoryLabel: 'Carpentry & Woodwork',
    location: 'Kaduna Craft Hub',
    date: '2025 Physical Session',
    imageUrl: '/flyers/capentry wrkshop.jpg',
    shortDesc: 'Advanced woodworking session focusing on precision joinery, furniture design, and safety.',
    fullDesc: 'Mentors guide youth through safety protocols, measurement accuracy, timber selection, and building durable household furniture, bridging traditional craftsmanship with economic independence.',
    impactMetric: '100% Free Trade Education',
    icon: <Hammer className="w-4 h-4 text-[#B87E13]" />,
  },
  {
    id: 'tailoring-workshop',
    title: 'Tailoring & Garment Construction Masterclass',
    category: 'tailoring',
    categoryLabel: 'Tailoring & Sewing',
    location: 'Kawo Tailoring Center',
    date: '2025 Hands-on Workshop',
    imageUrl: '/flyers/tailoring workshop.jpg',
    shortDesc: 'Practical sewing machine operation, pattern drafting, and garment stitching for youth.',
    fullDesc: 'Youth mentees learn the art of fashion design, pattern cutting, fabric selection, and machine stitching under experienced master tailors, enabling them to start independent sewing businesses.',
    impactMetric: 'Practical Garment Skills',
    icon: <Scissors className="w-4 h-4 text-[#3D781D]" />,
  },
  {
    id: 'tailoring-apprenticeship',
    title: 'Apparel Sewing & Textile Trade Training',
    category: 'tailoring',
    categoryLabel: 'Tailoring & Sewing',
    location: 'Kaduna Community Hub',
    date: '2025 Apprenticeship',
    imageUrl: '/flyers/tailoring.jpg',
    shortDesc: 'Tailoring apprenticeship program providing sustainable fashion and textile trade skills.',
    fullDesc: 'Youth are equipped with essential sewing machine maintenance, seam construction, and commercial garment making skills, transforming lives through sustainable economic empowerment.',
    impactMetric: 'Sustainable Livelihoods',
    icon: <Scissors className="w-4 h-4 text-[#3D781D]" />,
  },
  {
    id: 'maiduguri-bootcamp',
    title: 'Maiduguri Young Voices Leadership & Advocacy Bootcamp',
    category: 'bootcamp',
    categoryLabel: 'Leadership & Advocacy Bootcamp',
    location: 'Maiduguri, Borno State',
    date: 'Cohort 2 Bootcamp',
    imageUrl: '/flyers/maiduguri young voices leadership and advocacy bootcamp2.jpg',
    shortDesc: 'Intensive civic leadership, child rights protection, and public speaking training for young leaders.',
    fullDesc: 'The Maiduguri Young Voices Leadership & Advocacy Bootcamp brings together passionate youth from across Borno State to learn public policy, child protection advocacy, public speaking, and community mobilization.',
    impactMetric: 'Over 200 Bootcamp Graduates',
    icon: <Award className="w-4 h-4 text-[#7B2D8C]" />,
  },
  {
    id: 'young-voices-bootcamp',
    title: 'Young Voices Leadership & Advocacy Bootcamp',
    category: 'bootcamp',
    categoryLabel: 'Leadership & Advocacy Bootcamp',
    location: 'Northern Nigeria Region',
    date: '2025 Physical Session',
    imageUrl: '/flyers/young voices leadership and advocacy bootcamp.jpg',
    shortDesc: 'Transformative physical bootcamp instilling confidence, public speaking, and civic action.',
    fullDesc: 'Interactive workshop empowering young boys and girls to speak with purpose, advocate for child rights in their communities, and lead positive social reform.',
    impactMetric: 'Nationwide Youth Network',
    icon: <Award className="w-4 h-4 text-[#7B2D8C]" />,
  },
  {
    id: 'children-physical-session',
    title: 'Children Community Outreach & Life Skills Workshop',
    category: 'outreach',
    categoryLabel: 'Community Outreach',
    location: 'Tsangaya Schools Kawo',
    date: 'Physical Outreach',
    imageUrl: '/flyers/children.jpg',
    shortDesc: 'Interactive life skills, physical engagement, mentorship games, and educational workshops.',
    fullDesc: 'Physical outreach session visiting Tsangaya schools to distribute learning materials, conduct hygiene and life skills workshops, and engage children in uplifting educational activities.',
    impactMetric: '100% Free Children Workshop',
    icon: <HeartHandshake className="w-4 h-4 text-[#0B6291]" />,
  },
];

export const AlmajiriBootcampShowcase: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<BootcampGalleryItem | null>(null);

  const filteredItems = activeCategory === 'all'
    ? BOOTCAMP_GALLERY
    : BOOTCAMP_GALLERY.filter((item) => item.category === activeCategory);

  return (
    <section id="bootcamps-showcase" className="py-16 bg-[#F8FAFC] text-[#0C1836] relative border-t-4 border-[#3D781D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-[#3D781D]/10 text-[#3D781D] border border-[#3D781D]/30 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-3">
            <Award className="w-4 h-4 text-[#3D781D]" />
            <span>Almajiri & Youth Empowerment Showcase</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-['Outfit'] text-[#0C1836] tracking-tight">
            Physical Bootcamps, Almajiri Visits & Vocational Skills
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-2 leading-relaxed">
            Witness our ground-level impact in Kawo (Kaduna State) and Maiduguri (Borno State): empowering out-of-school and Almajiri children with carpentry, tailoring, computer design, welding, and youth leadership bootcamps.
          </p>
        </div>

        {/* CATEGORY FILTER TABS */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { id: 'all', label: 'All Projects & Sessions', icon: 'fa-solid fa-layer-group text-[#0B6291]' },
            { id: 'vocational', label: 'Computer & Digital', icon: 'fa-solid fa-laptop text-[#0B6291]' },
            { id: 'carpentry', label: 'Carpentry & Woodwork', icon: 'fa-solid fa-hammer text-[#B87E13]' },
            { id: 'tailoring', label: 'Tailoring & Sewing', icon: 'fa-solid fa-scissors text-[#3D781D]' },
            { id: 'bootcamp', label: 'Leadership Bootcamps', icon: 'fa-solid fa-trophy text-[#7B2D8C]' },
            { id: 'outreach', label: 'Community Outreach', icon: 'fa-solid fa-handshake text-[#0B6291]' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`text-xs font-black px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 ${
                activeCategory === tab.id
                  ? 'bg-[#0C1836] text-white ring-2 ring-[#0B6291]'
                  : 'bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <i className={`${tab.icon}`}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* GALLERY GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group bg-white border-2 border-slate-900 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* IMAGE CONTAINER */}
                <div className="relative h-48 overflow-hidden bg-slate-950">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#0C1836]/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg flex items-center gap-1 border border-white/20">
                    {item.icon}
                    <span>{item.categoryLabel}</span>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                    <span className="flex items-center gap-1 text-[#0B6291]">
                      <MapPin className="w-3 h-3" />
                      {item.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#B87E13]" />
                      {item.date}
                    </span>
                  </div>

                  <h3 className="font-black text-sm text-[#0C1836] font-['Outfit'] leading-snug group-hover:text-[#0B6291] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 font-medium line-clamp-2 leading-relaxed">
                    {item.shortDesc}
                  </p>
                </div>
              </div>

              {/* FOOTER METRIC */}
              <div className="p-4 pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-[#3D781D] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    {item.impactMetric}
                  </span>
                  <span className="text-xs font-black text-[#0B6291] group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                    View &rarr;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* LIGHTBOX POPUP MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white border-2 border-slate-900 rounded-3xl overflow-hidden shadow-2xl text-slate-900 max-h-[90vh] overflow-y-auto">
            
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-3 right-3 z-20 bg-slate-900/80 hover:bg-slate-900 text-white p-2 rounded-full shadow-lg transition-transform hover:scale-110"
            >
              <X className="w-5 h-5" />
            </button>

            {/* MODAL IMAGE */}
            <div className="relative h-64 sm:h-80 bg-slate-950">
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-[#0C1836]/90 backdrop-blur-md text-white text-xs font-black px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-1.5">
                {selectedItem.icon}
                <span>{selectedItem.categoryLabel}</span>
              </div>
            </div>

            {/* MODAL CONTENT */}
            <div className="p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-extrabold text-slate-500">
                <span className="flex items-center gap-1 text-[#0B6291]">
                  <MapPin className="w-4 h-4 text-[#0B6291]" />
                  {selectedItem.location}
                </span>
                <span className="flex items-center gap-1 text-[#B87E13]">
                  <Calendar className="w-4 h-4 text-[#B87E13]" />
                  {selectedItem.date}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black font-['Outfit'] text-[#0C1836]">
                {selectedItem.title}
              </h3>

              <div className="p-3 bg-[#F8FAFC] border-2 border-slate-200 rounded-2xl flex items-center gap-3">
                <div className="p-2 bg-[#3D781D]/10 text-[#3D781D] rounded-xl font-bold">
                  <CheckCircle2 className="w-5 h-5 text-[#3D781D]" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Verified Community Impact</span>
                  <span className="text-xs font-black text-[#3D781D]">{selectedItem.impactMetric}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed bg-slate-50 p-4 border border-slate-200 rounded-2xl">
                {selectedItem.fullDesc}
              </p>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="bg-[#0C1836] hover:bg-[#091228] text-white font-black text-xs px-6 py-3 rounded-xl uppercase tracking-wider shadow-md"
                >
                  Close Showcase
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};

import React, { useState } from 'react';
import { ShieldCheck, Globe, Building2, HeartHandshake, Award } from 'lucide-react';

interface Partner {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  logoUrl?: string;
}

export const PartnersSection: React.FC = () => {
  const partners: Partner[] = [
    {
      name: 'MIHAMS',
      icon: HeartHandshake,
      label: 'Child Protection & Health',
      logoUrl: '/outreach/MIHAMS logo--Partner.jpg',
    },
    {
      name: 'the ITHAC',
      icon: Globe,
      label: 'Technology & Innovation',
      logoUrl: '/outreach/the_ithac_logo.png',
    },
    {
      name: 'ITHAC Foundation',
      icon: Award,
      label: 'Youth & Empowerment',
      logoUrl: '/outreach/ithac_foundation_logo.png',
    },
    {
      name: 'Bannuu Allied Partners',
      icon: Building2,
      label: 'Strategic Allied Partner',
      logoUrl: '/outreach/bannuu_allied_partners_logo.png',
    },
    {
      name: 'Xpandable Technologies',
      icon: ShieldCheck,
      label: 'Digital Solutions & Tech',
      logoUrl: '/outreach/xpandable_technologies_logo.png',
    },
  ];

  return (
    <section className="py-16 bg-[#F8FAFC] border-b-2 border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-6 h-1 bg-[#0B6291]"></div>
            <h4 className="text-xs font-black uppercase tracking-widest text-[#0B6291]">
              Strategic Ecosystem
            </h4>
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-['Outfit'] text-[#0C1836] mt-1">
            Our Institutional Partners & Allies
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {partners.map((partner, idx) => {
            const Icon = partner.icon;
            return (
              <PartnerCard key={idx} partner={partner} Icon={Icon} />
            );
          })}
        </div>
      </div>
    </section>
  );
};

const PartnerCard: React.FC<{ partner: Partner; Icon: React.ComponentType<{ className?: string }> }> = ({ partner, Icon }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-white border-2 border-slate-300 rounded-2xl p-4 text-center shadow-sm hover:border-[#0B6291] transition-all flex flex-col items-center justify-center gap-2 group min-h-[120px]">
      {partner.logoUrl && !imgError ? (
        <div className="flex flex-col items-center gap-2">
          <img
            src={partner.logoUrl}
            alt={partner.name}
            onError={() => setImgError(true)}
            className="h-12 w-auto max-w-[120px] object-contain group-hover:scale-105 transition-transform"
          />
          <div>
            <p className="font-black text-xs text-[#0C1836]">{partner.name}</p>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{partner.label}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="p-3 bg-[#0B6291]/10 text-[#0B6291] group-hover:bg-[#0B6291] group-hover:text-white rounded-xl transition-colors">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="font-black text-xs text-[#0C1836]">{partner.name}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{partner.label}</p>
          </div>
        </>
      )}
    </div>
  );
};

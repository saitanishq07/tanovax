import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Building2, 
  Layout, 
  Home, 
  UtensilsCrossed, 
  Users, 
  Receipt, 
  Package, 
  UserCheck, 
  BarChart3, 
  ShieldCheck, 
  ArrowRight 
} from 'lucide-react';
import { ServiceItem } from '../../types';
import { Card } from '../ui/Card';

interface ServiceCardProps {
  service: ServiceItem;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const getIcon = (name: string) => {
    const props = { className: 'w-6 h-6 text-brand-400' };
    switch (name) {
      case 'Briefcase': return <Briefcase {...props} />;
      case 'Building2': return <Building2 {...props} />;
      case 'Layout': return <Layout {...props} />;
      case 'Home': return <Home {...props} />;
      case 'UtensilsCrossed': return <UtensilsCrossed {...props} />;
      case 'Users': return <Users {...props} />;
      case 'Receipt': return <Receipt {...props} />;
      case 'Package': return <Package {...props} />;
      case 'UserCheck': return <UserCheck {...props} />;
      case 'BarChart3': return <BarChart3 {...props} />;
      case 'ShieldCheck': return <ShieldCheck {...props} />;
      default: return <Briefcase {...props} />;
    }
  };

  return (
    <Card id={service.id} className="flex flex-col justify-between group">
      <div className="space-y-4">
        {/* Header Icon */}
        <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center group-hover:bg-brand-500/20 group-hover:scale-105 transition-all">
          {getIcon(service.iconName)}
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="text-xl font-bold text-slate-100 group-hover:text-brand-400 transition-colors">
            {service.name}
          </h3>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            {service.description}
          </p>
        </div>

        {/* Feature List preview */}
        {service.features && service.features.length > 0 && (
          <ul className="space-y-1.5 pt-2">
            {service.features.slice(0, 3).map((feat, idx) => (
              <li key={idx} className="text-xs text-slate-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Action Footer Link */}
      <div className="pt-6 mt-4 border-t border-slate-800/80 flex items-center justify-between">
        <Link
          to={`/contact?service=${encodeURIComponent(service.name)}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors group/link"
        >
          <span>Learn More & Build</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </Card>
  );
};

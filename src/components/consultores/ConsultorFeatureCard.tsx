
import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ConsultorFeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="flex flex-col p-6 bg-white rounded-lg shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
    <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-slate-600">{description}</p>
  </div>
);

export default ConsultorFeatureCard;

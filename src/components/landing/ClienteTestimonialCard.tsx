
import React from 'react';

interface TestimonialCardProps {
  quote: string;
  author: string;
}

const ClienteTestimonialCard = ({ quote, author }: TestimonialCardProps) => (
  <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg">
    <p className="italic text-slate-700 mb-4">"{quote}"</p>
    <div className="flex items-center">
      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
        {author.charAt(0)}
      </div>
      <div className="ml-3">
        <p className="font-semibold">{author}</p>
      </div>
    </div>
  </div>
);

export default ClienteTestimonialCard;

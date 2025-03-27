
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase/client";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
}

const ConsultorTestimonialCard = ({ quote, author, role }: TestimonialCardProps) => {
  // Obter o URL da imagem no storage do Supabase baseado no nome do autor
  const imageFileName = `${author}.png`;
  const imageUrl = `${supabase.storage.from('consultores').getPublicUrl(imageFileName).data.publicUrl}`;

  return (
    <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg flex flex-col h-full relative">
      {/* Conteúdo do depoimento */}
      <div className="flex-grow mb-14">
        <p className="italic text-slate-700">"{quote}"</p>
      </div>
      
      {/* Autor do depoimento (fixado na parte inferior) */}
      <div className="absolute bottom-6 left-6 right-6 flex items-center">
        <Avatar className="h-10 w-10">
          <AvatarImage src={imageUrl} alt={author} />
          <AvatarFallback className="bg-primary text-white">
            {author.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="ml-3">
          <p className="font-semibold">{author}</p>
          <p className="text-sm text-slate-600">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default ConsultorTestimonialCard;

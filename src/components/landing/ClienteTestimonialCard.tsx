
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase/client";

interface TestimonialCardProps {
  quote: string;
  author: string;
}

const ClienteTestimonialCard = ({ quote, author }: TestimonialCardProps) => {
  // Obter o primeiro nome do autor para usar na busca da imagem
  const firstName = author.split(' ')[0].toLowerCase();
  
  // URL da imagem no storage do Supabase
  const imageUrl = `${supabase.storage.from('clientes').getPublicUrl(`${firstName}.jpg`).data.publicUrl}`;

  return (
    <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg">
      <p className="italic text-slate-700 mb-4">"{quote}"</p>
      <div className="flex items-center">
        <Avatar className="h-10 w-10">
          <AvatarImage src={imageUrl} alt={author} />
          <AvatarFallback className="bg-primary text-white">
            {author.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="ml-3">
          <p className="font-semibold">{author}</p>
        </div>
      </div>
    </div>
  );
};

export default ClienteTestimonialCard;

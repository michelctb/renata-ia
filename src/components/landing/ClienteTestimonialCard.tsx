
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase/client";

interface TestimonialCardProps {
  quote: string;
  author: string;
}

const ClienteTestimonialCard = ({ quote, author }: TestimonialCardProps) => {
  // Função para obter o nome correto do arquivo baseado no nome do autor
  const getImageFileName = (authorName: string) => {
    const lowerCaseName = authorName.toLowerCase();
    
    // Mapeamento dos nomes para os nomes de arquivo exatos
    const fileNameMap: Record<string, string> = {
      'fernando gomes': 'fernando gomes.png',
      'camila alves': 'camila alves.png',
      'jéssica oliveira': 'jessica oliveira.png',
      'beatriz alexandre': 'beatriz alexandre.png'
    };
    
    // Retorna o nome do arquivo correspondente ou undefined se não existir
    return fileNameMap[lowerCaseName];
  };
  
  // Obter o nome do arquivo de imagem
  const imageFileName = getImageFileName(author);
  
  // URL da imagem no storage do Supabase
  const imageUrl = imageFileName 
    ? `${supabase.storage.from('clientes').getPublicUrl(imageFileName).data.publicUrl}`
    : '';

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

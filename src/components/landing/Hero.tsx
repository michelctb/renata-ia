
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';

const Hero = () => {
  const images = [
    "/lovable-uploads/14875af2-1f77-4e8e-af52-102a211d5723.png",
    "/lovable-uploads/05cd25e7-1e4c-46fc-a2ef-668452870824.png",
    "/lovable-uploads/06ffd448-8330-471b-b5b5-2617f8005c37.png"
  ];

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4 animate-fade-up">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              Planejamento financeiro inteligente
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Controle suas finanças com inteligência artificial
            </h1>
            <p className="max-w-[600px] text-slate-700 dark:text-slate-400 md:text-xl">
              Acompanhe suas transações, categorize gastos automaticamente e receba insights personalizados para melhorar sua saúde financeira.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" asChild>
                <Link to="/subscription">
                  Comece agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/login">
                  Acessar minha conta
                </Link>
              </Button>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[500px] lg:max-w-none animate-fade-up overflow-hidden rounded-xl shadow-xl">
            <AutoPlayCarousel images={images} />
          </div>
        </div>
      </div>
    </section>
  );
};

interface AutoPlayCarouselProps {
  images: string[];
}

const AutoPlayCarousel = ({ images }: AutoPlayCarouselProps) => {
  const [api, setApi] = React.useState<any>(null);
  const [current, setCurrent] = React.useState(0);
  
  // Configurar o intervalo para avançar para o próximo slide
  React.useEffect(() => {
    if (!api) return;
    
    // Set up autoplay
    const interval = setInterval(() => {
      api.scrollNext();
    }, 3000); // Muda a cada 3 segundos
    
    // Cleanup on unmount
    return () => clearInterval(interval);
  }, [api]);
  
  // Atualizar o slide atual quando ele muda
  React.useEffect(() => {
    if (!api) return;
    
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };
    
    api.on("select", onSelect);
    
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <Carousel
      setApi={setApi}
      className="w-full"
      opts={{
        align: "start",
        loop: true,
      }}
    >
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <div className="relative h-full w-full p-1">
              <img
                src={image}
                alt={`Dashboard da aplicação (${index + 1})`}
                className="w-full rounded-lg"
                style={{ 
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  aspectRatio: '16/9',
                  objectFit: 'cover'
                }}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      
      {/* Indicadores de slides */}
      <div className="flex justify-center gap-2 mt-4">
        {images.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full transition-all ${
              current === index ? "w-4 bg-primary" : "bg-gray-300 dark:bg-gray-600"
            }`}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </Carousel>
  );
};

export default Hero;

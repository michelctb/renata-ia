
import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

export interface ChartDimensions {
  width: number;
  height: number;
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  isMobile: boolean;
}

export function useMonthlyChartDimensions(): ChartDimensions {
  const isMobile = useIsMobile();
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
    margins: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
  }>({
    width: isMobile ? 350 : 650,
    height: 260,
    margins: isMobile ? 
      { top: 10, right: 5, left: 0, bottom: 20 } : 
      { top: 20, right: 20, left: 20, bottom: 20 }
  });

  useEffect(() => {
    setDimensions(prev => ({
      ...prev,
      width: isMobile ? 350 : 650,
      margins: isMobile ? 
        { top: 10, right: 5, left: 0, bottom: 20 } : 
        { top: 20, right: 20, left: 20, bottom: 20 }
    }));
  }, [isMobile]);

  return {
    ...dimensions,
    isMobile
  };
}

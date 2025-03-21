
import { useMemo } from 'react';

// Define the color constants at the hook level
export const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', 
  '#5DADE2', '#F4D03F', '#EC7063', '#45B39D', '#AF7AC5', 
  '#5499C7', '#F5B041', '#EB984E', '#58D68D', '#3498DB',
  '#1ABC9C', '#9B59B6', '#2ECC71', '#E67E22', '#E74C3C',
  '#34495E', '#16A085', '#27AE60', '#8E44AD', '#F39C12'
];

// Define a catch-all color for "other" categories
export const OTHER_COLOR = '#95A5A6';

export interface CategoryData {
  name: string;
  value: number;
}

export function useProcessPieChartData(data: CategoryData[], transactionType: 'entrada' | 'saída') {
  return useMemo(() => {
    console.log(`Raw data received in pie chart (${transactionType}):`, data);
    
    if (!data || data.length === 0) {
      return {
        hasData: false,
        processedData: [],
        renderColors: []
      };
    }

    // Process the data to group small categories as "Outros" if there are too many categories
    const processedData = (() => {
      if (data.length <= 10) return data;
      
      // Sort by value (highest first)
      const sortedData = [...data].sort((a, b) => b.value - a.value);
      
      // Take top 9 categories
      const topCategories = sortedData.slice(0, 9);
      
      // Group the rest as "Outros"
      const otherCategories = sortedData.slice(9);
      const otherSum = otherCategories.reduce((sum, category) => sum + category.value, 0);
      
      if (otherSum > 0) {
        return [
          ...topCategories,
          {
            name: `Outros (${otherCategories.length})`,
            value: otherSum
          }
        ];
      }
      
      return topCategories;
    })();

    console.log(`Processed data for pie chart (${transactionType}):`, processedData);

    // Ensure we have enough colors
    const renderColors = [...COLORS];
    // If we have an "Outros" category, use a specific color for it
    if (processedData.length > 9) {
      renderColors[9] = OTHER_COLOR;
    }

    return {
      hasData: true,
      processedData,
      renderColors
    };
  }, [data, transactionType]);
}


import { useMemo } from 'react';

// Expanded color palette to match the pie chart
export const RANKING_COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', 
  '#5DADE2', '#F4D03F', '#EC7063', '#45B39D', '#AF7AC5', 
  '#5499C7', '#F5B041', '#EB984E', '#58D68D', '#3498DB',
  '#1ABC9C', '#9B59B6', '#2ECC71', '#E67E22', '#E74C3C',
  '#34495E', '#16A085', '#27AE60', '#8E44AD', '#F39C12'
];

export interface CategoryData {
  name: string;
  value: number;
  goalValue?: number;
}

interface ProcessedRankingData {
  hasData: boolean;
  dataToShow: CategoryData[];
  totalValue: number;
  showMoreMessage: boolean;
  totalCategories: number;
}

export const useExpensesRankingData = (
  data: CategoryData[], 
  transactionType: 'entrada' | 'saída'
): ProcessedRankingData => {
  return useMemo(() => {
    console.log(`Raw data received in ranking (${transactionType}):`, data);
    
    if (!data || data.length === 0) {
      return {
        hasData: false,
        dataToShow: [],
        totalValue: 0,
        showMoreMessage: false,
        totalCategories: 0
      };
    }

    // Show all categories sorted by value (highest first)
    const sortedData = [...data].sort((a, b) => b.value - a.value);
    
    // Show only top categories if there are too many
    const dataToShow = sortedData.slice(0, 15); // Show at most 15 categories

    // Calculate total of all displayed values
    const totalValue = dataToShow.reduce((sum, category) => sum + category.value, 0);

    console.log(`Processed data for ranking (${transactionType}):`, dataToShow);
    console.log(`Total value for ranking (${transactionType}):`, totalValue);

    return {
      hasData: true,
      dataToShow,
      totalValue,
      showMoreMessage: data.length > 15,
      totalCategories: data.length
    };
  }, [data, transactionType]);
};

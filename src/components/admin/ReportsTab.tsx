
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart3, PieChart, FileBarChart } from 'lucide-react';

const ReportsTab: React.FC = () => {
  return (
    <Card className="shadow-md hover:shadow-lg transition-all duration-300 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">Relatórios Financeiros</CardTitle>
            <CardDescription>
              Visualize relatórios consolidados de todos os usuários
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <PieChart className="h-6 w-6 text-primary" />
            <FileBarChart className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <BarChart3 className="h-8 w-8 text-primary" />
          </div>
          <p className="text-lg font-medium">Funcionalidade de relatórios a ser implementada em breve</p>
          <p className="text-sm max-w-md text-center">Os relatórios permitirão visualizar métricas consolidadas, tendências financeiras e análises detalhadas de todos os usuários.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportsTab;

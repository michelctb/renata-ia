
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';

const ReportsTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Relatórios Financeiros</CardTitle>
        <CardDescription>
          Visualize relatórios consolidados de todos os usuários
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-muted-foreground">
          Funcionalidade de relatórios a ser implementada em breve
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportsTab;

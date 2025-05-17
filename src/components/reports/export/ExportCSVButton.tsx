
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';

interface ExportCSVButtonProps {
  onClick: () => void;
  isExporting: boolean;
}

export const ExportCSVButton: React.FC<ExportCSVButtonProps> = ({
  onClick,
  isExporting
}) => {
  return (
    <Button
      onClick={onClick}
      className="w-full"
      variant="default"
      size="sm"
      disabled={isExporting}
    >
      {isExporting ? (
        <>
          <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
          Exportando dados...
        </>
      ) : (
        <>
          <FileDown className="h-4 w-4 mr-2" />
          Exportar dados como CSV
        </>
      )}
    </Button>
  );
};

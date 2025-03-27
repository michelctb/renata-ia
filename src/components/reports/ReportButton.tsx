
import React from 'react';
import { Button } from '@/components/ui/button';
import { ButtonProps } from '@/components/ui/button';

interface ReportButtonProps extends ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export const ReportButton: React.FC<ReportButtonProps> = ({
  onClick,
  children,
  className,
  variant = "outline",
  size = "sm",
  ...props
}) => {
  return (
    <Button 
      onClick={onClick}
      className={className}
      variant={variant}
      size={size}
      {...props}
    >
      {children}
    </Button>
  );
};

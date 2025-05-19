
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface InfoTooltipProps {
  content: React.ReactNode;
  children?: React.ReactNode;
  icon?: boolean;
}

export function InfoTooltip({ content, children, icon = true }: InfoTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center cursor-help">
            {children}
            {icon && <HelpCircle className="ml-1 h-4 w-4 text-muted-foreground" />}
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function ChartTooltip({ title, description }: { title: string; description: string }) {
  return (
    <InfoTooltip
      content={
        <div className="p-1">
          <p className="font-medium">{description}</p>
        </div>
      }
    >
      <span>{title}</span>
    </InfoTooltip>
  );
}

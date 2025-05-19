
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface ComparisonToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  className?: string;
}

export function ComparisonToggle({ enabled, onToggle, className = '' }: ComparisonToggleProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Switch 
        id="comparison-mode" 
        checked={enabled}
        onCheckedChange={onToggle} 
      />
      <Label htmlFor="comparison-mode" className="text-sm cursor-pointer">
        Comparar com período anterior
      </Label>
    </div>
  );
}

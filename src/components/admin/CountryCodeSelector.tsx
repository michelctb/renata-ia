
import React, { useState } from 'react';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { countries } from './UserFormSchema';
import { useFormContext } from 'react-hook-form';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CountryCodeSelectorProps {
  name: string;
}

const CountryCodeSelector: React.FC<CountryCodeSelectorProps> = ({ name }) => {
  const [open, setOpen] = useState(false);
  const { setValue, watch } = useFormContext();
  const value = watch(name);

  return (
    <FormItem className="flex flex-col">
      <FormLabel>País</FormLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "w-full justify-between",
                !value && "text-muted-foreground"
              )}
            >
              {value
                ? countries.find((country) => country.code === value)?.flag + " +" + value
                : "Selecione um país"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0">
          <Command>
            <CommandInput placeholder="Buscar país..." />
            <CommandEmpty>Nenhum país encontrado.</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-60">
                {countries.map((country) => (
                  <CommandItem
                    key={country.code}
                    value={country.label}
                    onSelect={() => {
                      setValue(name, country.code);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        country.code === value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {country.flag} {country.label} (+{country.code})
                  </CommandItem>
                ))}
              </ScrollArea>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );
};

export default CountryCodeSelector;

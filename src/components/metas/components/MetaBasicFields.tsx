
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { MetaFormValues } from "../hooks/useMetaForm";
import { PERIODO_OPTIONS } from '@/lib/metas';
import { CategoryWithMeta } from '@/hooks/useCategoriesWithMetas';
import { Badge } from '@/components/ui/badge';

interface MetaBasicFieldsProps {
  form: UseFormReturn<MetaFormValues>;
  availableCategories: CategoryWithMeta[];
}

export function MetaBasicFields({ form, availableCategories }: MetaBasicFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="categoria"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Categoria</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {availableCategories.map(({ category, hasMeta }) => (
                  <SelectItem key={category.nome} value={category.nome} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {category.nome}
                      {hasMeta && <Badge variant="outline" className="ml-2">Tem meta</Badge>}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="valor_meta"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Valor da Meta (R$)</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" min="0" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="periodo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Período</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {PERIODO_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

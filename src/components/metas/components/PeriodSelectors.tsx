
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { UseFormReturn } from "react-hook-form";
import { MetaFormValues } from "../hooks/useMetaForm";

interface PeriodSelectorsProps {
  form: UseFormReturn<MetaFormValues>;
  periodoSelecionado: string;
}

export function PeriodSelectors({ form, periodoSelecionado }: PeriodSelectorsProps) {
  // Gerar meses para seleção
  const meses = Array.from({ length: 12 }, (_, i) => {
    return {
      value: i + 1,
      label: format(new Date(2024, i, 1), 'MMMM', { locale: pt }),
    };
  });
  
  // Gerar anos para seleção (ano atual e próximos 5 anos)
  const anoAtual = new Date().getFullYear();
  const anos = Array.from({ length: 6 }, (_, i) => {
    const ano = anoAtual + i;
    return {
      value: ano,
      label: ano.toString(),
    };
  });

  return (
    <>
      {/* Campos específicos para período mensal */}
      {periodoSelecionado === 'mensal' && (
        <>
          <FormField
            control={form.control}
            name="mes_referencia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mês</FormLabel>
                <Select onValueChange={(v) => field.onChange(parseInt(v))} value={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o mês" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {meses.map((mes) => (
                      <SelectItem key={mes.value} value={mes.value.toString()}>
                        {mes.label}
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
            name="ano_referencia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ano</FormLabel>
                <Select onValueChange={(v) => field.onChange(parseInt(v))} value={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o ano" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {anos.map((ano) => (
                      <SelectItem key={ano.value} value={ano.value.toString()}>
                        {ano.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
      
      {/* Campo de ano para período anual */}
      {periodoSelecionado === 'anual' && (
        <FormField
          control={form.control}
          name="ano_referencia"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ano</FormLabel>
              <Select onValueChange={(v) => field.onChange(parseInt(v))} value={field.value?.toString()}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o ano" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {anos.map((ano) => (
                    <SelectItem key={ano.value} value={ano.value.toString()}>
                      {ano.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
}

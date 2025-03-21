
import { Button } from "@/components/ui/button";
import { MetaCategoria } from "@/lib/metas/types";

interface MetaFormFooterProps {
  onCancel: () => void;
  metaAtual: MetaCategoria | null;
}

export function MetaFormFooter({ onCancel, metaAtual }: MetaFormFooterProps) {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <Button type="submit">
        {metaAtual ? 'Atualizar' : 'Criar'} Meta
      </Button>
    </div>
  );
}

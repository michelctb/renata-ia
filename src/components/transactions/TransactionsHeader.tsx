
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { DateRangePicker } from "@/components/DateRangePicker";

interface TransactionsHeaderProps {
  dateRange: DateRange | null;
  setDateRange: (range: DateRange | null) => void;
  onAddNew: () => void;
  isUserActive?: boolean;
}

export function TransactionsHeader({
  dateRange,
  setDateRange,
  onAddNew,
  isUserActive = true,
}: TransactionsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
      <h2 className="text-2xl font-bold">Transações</h2>
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <DateRangePicker
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
        <Button onClick={onAddNew} disabled={!isUserActive}>
          <PlusIcon className="h-4 w-4 mr-1" />
          Nova Transação
        </Button>
      </div>
    </div>
  );
}

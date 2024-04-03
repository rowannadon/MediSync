import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './components/ui/popover';
import { Separator } from './components/ui/separator';
import { Badge } from './components/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from './components/ui/command';
import { cn } from './lib/utils';
import { Column } from '@tanstack/react-table';
import { Button } from './components/ui/button';
import { PlusCircle } from 'lucide-react';

interface DataTableSingleFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: string[];
}

export function DataTableSingleFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableSingleFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();
  var selectedValue = column?.getFilterValue() as string;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircle className="mr-2 h-4 w-4" />
          {title}
          {selectedValue && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <div className="hidden space-x-1 lg:flex">
                <Badge
                  variant="secondary"
                  key={selectedValue}
                  className="rounded-sm px-1 font-normal"
                >
                  {selectedValue}
                </Badge>
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = option === selectedValue;
                return (
                  <CommandItem
                    key={option}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValue = '';
                      } else {
                        selectedValue = option;
                      }

                      column?.setFilterValue(
                        selectedValue ? selectedValue : undefined,
                      );
                    }}
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-full border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible',
                      )}
                    ></div>
                    <span>{option}</span>
                    {facets?.get(option) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option)}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValue && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    Clear filter
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

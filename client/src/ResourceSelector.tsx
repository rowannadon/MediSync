import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './components/ui/command';
import { useState } from 'react';
import { Button } from './components/ui/button';
import { PlusCircle } from 'lucide-react';
import { on } from 'events';

interface ResourceSelectorProps<T> {
  resources: T[];
  name: string;
  onSelectResource: (resource: T) => void;
  selectedResources: T[];
  displayAll: boolean;
}

export const ResourceSelector = <T extends { count: number; value: string }>({
  resources,
  name,
  selectedResources,
  onSelectResource,
  displayAll,
}: ResourceSelectorProps<T>) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-[200px] border-dashed"
          onClick={() => setOpen(!open)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add {name}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={`Search for ${name}`} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {resources.map((resource) => {
                if (
                  !selectedResources
                    .map((r) => r.value)
                    .includes(resource.value) ||
                  displayAll
                ) {
                  return (
                    <CommandItem
                      key={resource.value}
                      onSelect={() => {
                        setOpen(false);
                        onSelectResource(resource);
                      }}
                    >
                      <span>{resource.value}</span>
                    </CommandItem>
                  );
                }
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

import { useEffect, useState } from 'react';
import { Card } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Minus, Plus, PlusCircle, X } from 'lucide-react';
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
import { Button } from './components/ui/button';

interface StageEditorFormResourceFieldProps<T>
  extends React.HTMLAttributes<HTMLElement> {
  items: T[];
  count: boolean;
  name: string;
  resources: T[];
  displayAll: boolean;
  displayIndex: boolean;
  onChangeResources: (items: T[]) => void;
}

export const StageEditorFormResourceField = <
  T extends { count: number; value: string },
>(
  props: StageEditorFormResourceFieldProps<T>,
) => {
  const [selectedResources, setSelectedResources] = useState<T[]>(
    props.items || [],
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    props.onChangeResources(selectedResources);
  }, [selectedResources]);

  return (
    <div className="flex flex-grow flex-col space-y-4">
      <Card className="flex min-h-[100px] w-full flex-row flex-wrap space-x-2 p-4">
        {selectedResources.map((resource: T, index: number) => {
          const { value, count } = resource;

          return (
            <Badge
              className="mb-2 flex h-[30px] max-h-[30px] flex-row justify-between space-x-2 text-sm"
              variant="secondary"
              key={value + index}
            >
              <span>
                {value}{' '}
                {props.displayIndex && selectedResources.length > 1
                  ? index + 1
                  : ''}
              </span>
              {props.count && (
                <div className="flex flex-row items-center justify-center space-x-1">
                  <Plus
                    className="h-4 w-4 cursor-pointer p-[1px] hover:text-slate-500"
                    onClick={() => {
                      setSelectedResources((prev) =>
                        prev.map((r) =>
                          r === resource ? { ...r, count: r.count + 1 } : r,
                        ),
                      );
                    }}
                  />
                  <div>{count}</div>
                  <Minus
                    className="h-4 w-4 cursor-pointer p-[1px] hover:text-slate-500"
                    onClick={() => {
                      console.log(resource);
                      if (resource.count === 1) {
                        setSelectedResources((prev) =>
                          prev.filter((r) => r !== resource),
                        );
                      } else {
                        setSelectedResources((prev) =>
                          prev.map((r) =>
                            r === resource ? { ...r, count: r.count - 1 } : r,
                          ),
                        );
                      }
                    }}
                  />
                </div>
              )}

              {!props.count && (
                <X
                  className="h-4 w-4 cursor-pointer hover:text-muted-foreground"
                  onClick={() => {
                    setSelectedResources((prev) =>
                      prev.filter((r) => r !== resource),
                    );
                  }}
                />
              )}
            </Badge>
          );
        })}
      </Card>
      <Popover open={open}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-[200px] border-dashed"
            onClick={() => setOpen(!open)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add {props.name}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder={`Search for ${props.name}`} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {props.resources.map((resource: T) => {
                  if (
                    !selectedResources
                      .map((r) => r.value)
                      .includes(resource.value) ||
                    props.displayAll
                  ) {
                    return (
                      <CommandItem
                        key={resource.value}
                        onSelect={() => {
                          console.log(resource.value);
                          setOpen(false);
                          if (
                            !selectedResources
                              .map((r) => r.value)
                              .includes(resource.value) ||
                            props.displayAll
                          ) {
                            setSelectedResources([
                              ...selectedResources,
                              resource,
                            ]);
                          }
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
    </div>
  );
};

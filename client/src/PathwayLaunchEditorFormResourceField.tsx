import { useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './components/ui/command';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from './components/ui/select';
import { Separator } from './components/ui/separator';

interface PathwayLaunchEditorFormResourceFieldProps
  extends React.HTMLAttributes<HTMLElement> {
  name: string;
  types: string[];
  options: string[];
  onFieldChange: (value: string) => void;
}

export const PathwayLaunchEditorFormResourceField = (
  props: PathwayLaunchEditorFormResourceFieldProps,
) => {
  const [selectedType, setSelectedType] = useState(props.options[0]);
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-grow flex-row space-y-4">
      <Select value={selectedType} open={open} onOpenChange={(o) => setOpen(o)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a person">
            {selectedType}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <Command>
            <CommandInput placeholder={`Search for people`} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {props.options.map((option: string) => {
                  return (
                    <CommandItem
                      key={option}
                      onSelect={() => {
                        console.log(option);
                        setOpen(false);
                        setSelectedType(option);
                        props.onFieldChange(option);
                      }}
                    >
                      <span>{option}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              <Separator />
              <CommandGroup>
                {props.types.map((type: string) => {
                  return (
                    <CommandItem
                      key={type}
                      onSelect={() => {
                        console.log(type);
                        setOpen(false);
                        setSelectedType(type);
                      }}
                    >
                      <span>{type}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </SelectContent>
      </Select>
    </div>
  );
};

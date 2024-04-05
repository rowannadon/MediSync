import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './components/ui/accordion';
import { Card } from './components/ui/card';
import { Input } from './components/ui/input';
import { ScrollArea } from './components/ui/scroll-area';
import { Procedure, procedures } from './TempData';
import { PathwayDisplay } from './PathwayDisplay';

interface PathwayLibraryProps {
  onPathwayClick: (pathway: Procedure) => void;
  selectedPathway: Procedure | null;
}

export const PathwayLibrary = (props: PathwayLibraryProps) => {
  const [filter, setFilter] = useState<string>('');
  const filteredPathways = procedures.filter((procedure: Procedure) =>
    procedure.title.toLowerCase().includes(filter.toLowerCase()),
  );
  const [accordionValue, setAccordionValue] = useState<string[]>(['Templates']);

  const pathways = filteredPathways.map((pathway: Procedure) => {
    return (
      <PathwayDisplay
        key={pathway.title}
        pathway={pathway}
        onClick={() => props.onPathwayClick(pathway)}
        selected={props.selectedPathway?.title === pathway.title}
      />
    );
  });

  return (
    <Card className="mb-2 mr-2 mt-2 flex w-[300px] min-w-[300px] max-w-[300px] flex-col">
      <div className="mx-4 mt-4">
        <Input
          className=""
          type="search"
          placeholder="Filter pathway templates..."
          onChange={(event) => {
            setFilter(event.target.value);
            if (event.target.value === '') {
              setAccordionValue([]);
            } else {
              setAccordionValue(['Templates']); // Open all accordion items when filtering
            }
          }}
        />
      </div>

      <ScrollArea className="flex-grow px-2">
        <Accordion
          type="multiple"
          className="w-full text-foreground"
          value={accordionValue}
          onValueChange={setAccordionValue}
        >
          <AccordionItem value="Templates">
            <AccordionTrigger className="p-2">
              Pathway Templates
            </AccordionTrigger>
            <AccordionContent className="space-y-2 p-2">
              {pathways}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
    </Card>
  );
};
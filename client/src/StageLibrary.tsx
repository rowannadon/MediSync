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
import { StageDisplay } from './StageDisplay';
import { Stage, stages } from './TempData';

export const StageLibrary = (props: any) => {
  const [filter, setFilter] = useState<string>('');
  const filteredStages = stages.filter((stage: Stage) =>
    stage.name.toLowerCase().includes(filter.toLowerCase()),
  );
  const [accordionValue, setAccordionValue] = useState<string[]>(['Pre']);

  const preStages = filteredStages
    .filter((stage: Stage) => stage.type === 'pre-operative')
    .map((stage) => {
      return (
        <StageDisplay
          stage={stage}
          key={stage.name}
          onClick={() => props.onStageClick(stage)}
          selected={props.selectedStage === stage}
        />
      );
    });
  const periStages = filteredStages
    .filter((stage: Stage) => stage.type === 'peri-operative')
    .map((stage) => {
      return (
        <StageDisplay
          stage={stage}
          key={stage.name}
          onClick={() => props.onStageClick(stage)}
          selected={props.selectedStage === stage}
        />
      );
    });
  const postStages = filteredStages
    .filter((stage: Stage) => stage.type === 'post-operative')
    .map((stage) => {
      return (
        <StageDisplay
          stage={stage}
          key={stage.name}
          onClick={() => props.onStageClick(stage)}
          selected={props.selectedStage === stage}
        />
      );
    });

  return (
    <Card className="mb-2 mt-2 flex w-[300px] min-w-[300px] max-w-[300px] flex-col">
      <div className="mx-4 mt-4">
        <Input
          className=""
          type="search"
          placeholder="Filter stage templates..."
          onChange={(event) => {
            setFilter(event.target.value);
            if (event.target.value === '') {
              setAccordionValue([]);
            } else {
              setAccordionValue(['Pre', 'Peri', 'Post']); // Open all accordion items when filtering
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
          <AccordionItem value="Pre">
            <AccordionTrigger className="p-2">
              Pre-Operative Stages
            </AccordionTrigger>
            <AccordionContent className="space-y-2 p-2">
              {preStages}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="Peri">
            <AccordionTrigger className="p-2">
              Peri-Operative Stages
            </AccordionTrigger>
            <AccordionContent className="space-y-2 p-2">
              {periStages}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="Post">
            <AccordionTrigger className="p-2">
              Post-Operative Stages
            </AccordionTrigger>
            <AccordionContent className="space-y-2 p-2">
              {postStages}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
    </Card>
  );
};
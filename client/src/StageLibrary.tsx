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
import { Stage } from './TempData';
import { useLocalDataStore } from './LocalDataStore';
import { useRemoteDataStore } from './RemoteDataStore';

interface StageLibraryProps {
  selectable: boolean;
}

export const StageLibrary = ({ selectable }: StageLibraryProps) => {
  const selectedStage = useLocalDataStore((state) => state.selectedStage);
  const setSelectedStage = useLocalDataStore((state) => state.setSelectedStage);
  const clearSelectedStage = useLocalDataStore(
    (state) => state.clearSelectedStage,
  );
  const stages = useRemoteDataStore((state) => state.stages);

  const [filter, setFilter] = useState<string>('');
  const filteredStages = stages.filter((stage: Stage) =>
    stage.name.toLowerCase().includes(filter.toLowerCase()),
  );
  const [accordionValue, setAccordionValue] = useState<string[]>([
    selectedStage ? selectedStage.type : 'pre-operative',
  ]);

  const onStageClick = (stage: Stage) => {
    if (!selectable) return;
    if (selectedStage !== stage) {
      setSelectedStage(stage);
    } else {
      clearSelectedStage();
    }
  };

  const preStages = filteredStages
    .filter((stage: Stage) => stage.type === 'pre-operative')
    .map((stage: Stage) => {
      return (
        <StageDisplay
          stage={stage}
          key={stage.name}
          onClick={() => onStageClick(stage)}
          selected={selectable && selectedStage === stage}
        />
      );
    });
  const periStages = filteredStages
    .filter((stage: Stage) => stage.type === 'peri-operative')
    .map((stage: Stage) => {
      return (
        <StageDisplay
          stage={stage}
          key={stage.name}
          onClick={() => onStageClick(stage)}
          selected={selectable && selectedStage === stage}
        />
      );
    });
  const postStages = filteredStages
    .filter((stage: Stage) => stage.type === 'post-operative')
    .map((stage: Stage) => {
      return (
        <StageDisplay
          stage={stage}
          key={stage.name}
          onClick={() => onStageClick(stage)}
          selected={selectable && selectedStage === stage}
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
              setAccordionValue([
                'pre-operative',
                'peri-operative',
                'post-operative',
              ]); // Open all accordion items when filtering
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
          <AccordionItem value="pre-operative">
            <AccordionTrigger className="p-2">
              Pre-Operative Stages
            </AccordionTrigger>
            <AccordionContent className="space-y-2 p-2">
              {preStages}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="peri-operative">
            <AccordionTrigger className="p-2">
              Peri-Operative Stages
            </AccordionTrigger>
            <AccordionContent className="space-y-2 p-2">
              {periStages}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="post-operative">
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

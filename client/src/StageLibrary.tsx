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
import { StageTemplate, StageType, stageTypes } from './TempData';
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
  const hasChanges = useLocalDataStore((state) => state.hasChanges);
  const setHasChanges = useLocalDataStore((state) => state.setHasChanges);

  const [filter, setFilter] = useState<string>('');
  const filteredStages = stages.filter((stage: StageTemplate) =>
    stage.name.toLowerCase().includes(filter.toLowerCase()),
  );
  const [accordionValue, setAccordionValue] = useState<string[]>([
    selectedStage ? selectedStage.type : stageTypes[0],
  ]);

  const onStageClick = (stage: StageTemplate) => {
    if (!selectable) return;
    if (hasChanges) {
      if (!confirm('You have unsaved changes. Discard changes?')) return;
      setHasChanges(false);
    }
    if (selectedStage !== stage) {
      setSelectedStage(stage);
    } else {
      clearSelectedStage();
    }
  };

  const sections = stageTypes.map((type: StageType) => {
    return (
      <AccordionItem key={type} value={type}>
        <AccordionTrigger className="p-2">{`${type
          .charAt(0)
          .toUpperCase()}${type.slice(1)}`}</AccordionTrigger>
        <AccordionContent className="space-y-2 p-2">
          {filteredStages
            .filter((stage: StageTemplate) => stage.type === type)
            .map((stage: StageTemplate) => {
              return (
                <StageDisplay
                  stage={stage}
                  key={stage.name}
                  onClick={() => onStageClick(stage)}
                  selected={selectable && selectedStage === stage}
                />
              );
            })}
        </AccordionContent>
      </AccordionItem>
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
              setAccordionValue(Array.from(stageTypes)); // Open all accordion items when filtering
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
          {sections}
        </Accordion>
      </ScrollArea>
    </Card>
  );
};

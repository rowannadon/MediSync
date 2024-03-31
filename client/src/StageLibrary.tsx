import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './components/ui/accordion';
import { Card } from './components/ui/card';
import { ScrollArea } from './components/ui/scroll-area';
import { StageDisplay } from './StageDisplay';
import { stages } from './TempData';

export const StageLibrary = (props: any) => {
  const displayedStages = stages.map((stage) => {
    return <StageDisplay stage={stage} key={stage.name} onClick={() => props.onStageClick(stage)} />;
  });

  return (
    <Card className='mb-2 mt-2 flex flex-grow flex-col min-w-[270px] w-[270px] max-w-[270px]'>
      <ScrollArea className="flex-gro overflow-hidden">
        <Accordion type="single" collapsible className="w-full text-foreground">
          <AccordionItem value="Stages">
            <AccordionTrigger className="p-2">Stages</AccordionTrigger>
            <AccordionContent className="space-y-2 p-2">
              {displayedStages}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
    </Card>
  );
};

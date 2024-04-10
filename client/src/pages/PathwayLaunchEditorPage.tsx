import { FilePlus, RefreshCcw, Rocket, Save, Trash } from 'lucide-react';
import NavMenu from '../NavMenu';

import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components/ui/tooltip';
import { Procedure, procedures, Stage } from '../TempData';
import { useDrop } from 'react-dnd';
import { cn } from '../lib/utils';
import { SidebarNav } from '../FormSidebarNav';
import { PathwayLibrary } from '../PathwayLibrary';
import { PathwayLaunchEditorForm } from '../PathwayLaunchEditorForm';
import { ScrollArea } from '../components/ui/scroll-area';
import PathwayFlowDisplay from '../PathwayFlowDisplay';

const PathwayLaunchEditor = () => {
  const [selectedPathway, setSelectedPathway] = useState<Procedure | null>(
    procedures[0],
  );
  const stagePropertyTypes = [
    { title: 'Information', id: 'information' },
    { title: 'Resources', id: 'resources' },
    { title: 'Scheduling', id: 'schedule' },
  ];

  const [selectedPathwayPropertyType, setSelectedPathwayPropertyType] =
    useState('information');

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    // The type (or types) to accept - strings or symbols
    accept: 'stage',
    // Props to collect
    drop: (item: any) => {
      const stage = item.props.pathway;
      setSelectedPathway(stage);
    },
    collect: (monitor: any) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div className="flex h-screen max-h-screen w-screen flex-row bg-secondary">
      <NavMenu />
      <div className="flex h-screen max-h-screen flex-grow flex-row">
        <div className="flex flex-grow flex-col" ref={drop}>
          <Card className="space-between mr-2 mt-2 flex flex-row">
            <TooltipProvider>
              <div className="flex flex-1 flex-row space-x-2 p-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <FilePlus className="h-6 w-6" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={5}>
                    <p>New</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Save className="h-6 w-6" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={5}>
                    <p>Save</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <RefreshCcw className="h-6 w-6" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={5}>
                    <p>Reload</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex flex-grow flex-row items-center justify-center p-1">
                <h1 className="  text-lg font-bold">
                  Pathway Template Manager
                </h1>
              </div>
              <div className="flex flex-1 flex-row-reverse items-center space-x-2 space-x-reverse p-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Trash className="h-6 w-6" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={5}>
                    <p>Delete Stage</p>
                  </TooltipContent>
                </Tooltip>
                <Button variant="default" size="sm" className="flex space-x-2">
                  <Rocket className="h-6 w-6" />
                  <div>Launch Pathway</div>
                </Button>
              </div>
            </TooltipProvider>
          </Card>
          <div
            className={cn(
              'mb-2 mr-2 mt-2 flex flex-grow rounded-lg',
              isOver ? 'bg-red-100' : '',
            )}
          >
            {selectedPathway && (
              <Card className="flex flex-grow flex-row space-x-4 pl-4">
                <Card className="mb-4 mt-4 flex w-[300px] min-w-[300px] max-w-[300px]">
                  <PathwayFlowDisplay
                    pathway={selectedPathway}
                    controls={false}
                  />
                </Card>
                <div className="mt-4">
                  <SidebarNav
                    items={stagePropertyTypes}
                    selected={selectedPathwayPropertyType}
                    setSelected={setSelectedPathwayPropertyType}
                  />
                </div>

                <PathwayLaunchEditorForm
                  pathway={selectedPathway}
                  selectedPathwayPropertyType={selectedPathwayPropertyType}
                />
              </Card>
            )}
          </div>
        </div>
        <PathwayLibrary
          onPathwayClick={(pathway: Procedure) => {
            if (selectedPathway !== pathway) {
              setSelectedPathway(pathway);
            } else {
              setSelectedPathway(null);
            }
          }}
          selectedPathway={selectedPathway}
        />
      </div>
    </div>
  );
};

export default PathwayLaunchEditor;

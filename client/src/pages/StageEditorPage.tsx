import { FilePlus, Plus, RefreshCcw, Save, Trash } from 'lucide-react';
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
import { StageLibrary } from '../StageLibrary';
import { Stage } from '../TempData';
import { StageEditorForm } from '../StageEditorForm';
import { useDrop } from 'react-dnd';
import { cn } from '../lib/utils';
import { SidebarNav } from '../FormSidebarNav';
import { useLocalDataStore } from '@/LocalDataStore';

const StageEditor = () => {
  const selectedStage = useLocalDataStore((state) => state.selectedStage);
  const setSelectedStage = useLocalDataStore((state) => state.setSelectedStage);
  const clearSelectedStage = useLocalDataStore(
    (state) => state.clearSelectedStage,
  );

  const stagePropertyTypes = [
    { title: 'Information', id: 'information' },
    { title: 'Resources', id: 'resources' },
    { title: 'Outputs', id: 'outputs' },
  ];

  const [selectedStagePropertyType, setSelectedStagePropertyType] =
    useState('information');

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    // The type (or types) to accept - strings or symbols
    accept: 'stage',
    // Props to collect
    drop: (item: any) => {
      const stage = item.props.stage;
      setSelectedStage(stage);
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
        <StageLibrary selectable={true} />
        <div className="flex h-screen flex-grow flex-col" ref={drop}>
          <Card className="space-between ml-2 mr-2 mt-2 flex flex-row">
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
                <h1 className="  text-lg font-bold">Stage Template Editor</h1>
              </div>
              <div className="flex flex-1 flex-row-reverse space-x-2 space-x-reverse p-4">
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
              </div>
            </TooltipProvider>
          </Card>
          <div
            className={cn(
              'm-2 flex flex-grow rounded-lg',
              isOver ? 'bg-red-100' : '',
            )}
          >
            {selectedStage && (
              <Card className={'flex flex-grow space-x-4 p-4'}>
                <SidebarNav
                  items={stagePropertyTypes}
                  selected={selectedStagePropertyType}
                  setSelected={setSelectedStagePropertyType}
                />
                <StageEditorForm
                  stage={selectedStage}
                  selectedStagePropertyType={selectedStagePropertyType}
                />
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StageEditor;

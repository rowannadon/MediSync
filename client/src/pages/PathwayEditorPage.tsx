import { FilePlus, Plus, RefreshCcw, Trash } from 'lucide-react';
import NavMenu from '../NavMenu';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import 'reactflow/dist/style.css';
import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components/ui/tooltip';
import { StageLibrary } from '../StageLibrary';
import { Procedure } from '../TempData';
import PathwayFlowDisplay from '../PathwayFlowDisplay';
import { PathwayLibrary } from '../PathwayLibrary';
import { useLocalDataStore } from '@/LocalDataStore';

const PathwayEditor = () => {
  const selectedPathway = useLocalDataStore((state) => state.selectedPathway);
  const setSelectedPathway = useLocalDataStore((state) => state.setSelectedPathway);
  const clearSelectedPathway = useLocalDataStore((state) => state.clearSelectedPathway);

  return (
    <div className="flex h-screen max-h-screen w-screen flex-row bg-secondary">
      <NavMenu />
      <div className="flex h-screen max-h-screen flex-grow flex-row">
        <StageLibrary selectable={false} />
        <div className="flex h-screen flex-grow flex-col">
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
                      <RefreshCcw className="h-6 w-6" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={5}>
                    <p>Reload</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex flex-grow flex-row items-center justify-center p-4">
                <h1 className="  text-lg font-bold">Pathway Template Editor</h1>
              </div>
              <div className="flex flex-1 flex-row-reverse space-x-2 space-x-reverse p-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Plus className="h-6 w-6" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={5}>
                    <p>Add Node</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Trash className="h-6 w-6" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={5}>
                    <p>Delete Node</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </Card>
          <PathwayFlowDisplay pathway={selectedPathway} control={true} />
        </div>
        <PathwayLibrary
          onPathwayClick={(pathway: Procedure) => {
            console.log(pathway);
            if (selectedPathway !== pathway) {
              setSelectedPathway(pathway);
            } else {
              clearSelectedPathway();
            }
          }}
          selectedPathway={selectedPathway}
        />
      </div>
    </div>
  );
};

export default PathwayEditor;

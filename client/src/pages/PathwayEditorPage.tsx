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
import { PathwayTemplate } from '../DataTypes';
import PathwayFlowDisplay from '../PathwayFlowDisplay';
import { PathwayLibrary } from '../PathwayLibrary';
import { useLocalDataStore } from '@/LocalDataStore';
import { v4 as uuid } from 'uuid';
import { useRemoteDataStore } from '@/RemoteDataStore';

const PathwayEditor = () => {
  const selectedPathway = useLocalDataStore((state) => state.selectedPathway);
  const setSelectedPathway = useLocalDataStore(
    (state) => state.setSelectedPathway,
  );
  const clearSelectedPathway = useLocalDataStore(
    (state) => state.clearSelectedPathway,
  );

  const addPathwayTemplate = useRemoteDataStore(
    (state) => state.addPathwayTemplate,
  );
  const removePathwayTemplate = useRemoteDataStore(
    (state) => state.removePathwayTemplate,
  );

  const handleCreatePathway = () => {
    const newPathway: PathwayTemplate = {
      id: uuid(),
      desc: '',
      title: 'New Pathway',
      stages: [],
    };
    setSelectedPathway(newPathway);
    addPathwayTemplate(newPathway);
  };

  const handleDeletePathway = () => {
    if (!selectedPathway) return;
    if (!confirm('Are you sure you want to delete this pathway?')) return;
    removePathwayTemplate(selectedPathway.id);
    clearSelectedPathway();
  };

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
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCreatePathway}
                    >
                      <FilePlus className="h-6 w-6" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={5}>
                    <p>New</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex flex-grow flex-row items-center justify-center p-4">
                <h1 className="  text-lg font-bold">
                  {selectedPathway && selectedPathway.title}
                </h1>
              </div>
              <div className="flex flex-1 flex-row-reverse space-x-2 space-x-reverse p-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleDeletePathway}
                    >
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
          <PathwayFlowDisplay control={true} />
        </div>
        <PathwayLibrary
          onPathwayClick={(pathway: PathwayTemplate) => {
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

import {
  FilePlus,
  FolderOpen,
  Plus,
  RefreshCcw,
  Save,
  Trash,
} from 'lucide-react';
import NavMenu from './NavMenu';

import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { useCallback, useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './components/ui/tooltip';
import { StageLibrary } from './StageLibrary';
import { Stage } from './TempData';

const StageEditor = () => {
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);

  return (
    <div className="flex h-screen max-h-screen w-screen flex-row bg-secondary">
      <NavMenu />
      <div className="h-screen max-h-screen flex-grow">
        <div className="flex flex-grow flex-row">
          <StageLibrary
            onStageClick={(stage: Stage) => setSelectedStage(stage)}
          />
          <div className="flex h-screen flex-grow flex-col">
            <Card className="space-between ml-2 mr-2 mt-2 flex flex-row">
              <TooltipProvider>
                <div className="flex flex-grow flex-row space-x-2 p-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <FilePlus className="h-6 w-6" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={5}>
                      <p>New</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Save className="h-6 w-6" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={5}>
                      <p>Save</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <RefreshCcw className="h-6 w-6" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={5}>
                      <p>Reload</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex flex-grow flex-row items-center p-1">
                  <h1 className="text-xl font-bold">My Pathway Stage</h1>
                </div>
                <div className="flex flex-grow flex-row-reverse space-x-2 space-x-reverse p-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Plus className="h-6 w-6" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={5}>
                      <p>Add Section</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8">
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
            <Card className="m-2 flex flex-grow p-2">
              {selectedStage && <h1>{JSON.stringify(selectedStage)}</h1>}
              {selectedStage === null && <h1>No stage selected...</h1>}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StageEditor;

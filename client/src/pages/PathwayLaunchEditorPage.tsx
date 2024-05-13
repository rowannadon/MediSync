import { FilePlus, LoaderCircle, RefreshCcw, Rocket, Save, Trash } from 'lucide-react';
import NavMenu from '../NavMenu';

import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useEffect, useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components/ui/tooltip';
import { PathwayTemplate } from '../DataTypes';
import { useDrop } from 'react-dnd';
import { cn } from '../lib/utils';
import { SidebarNav } from '../FormSidebarNav';
import { PathwayLibrary } from '../PathwayLibrary';
import { PathwayLaunchEditorForm } from '../PathwayLaunchEditorForm';
import { ScrollArea } from '../components/ui/scroll-area';
import PathwayFlowDisplay from '../PathwayFlowDisplay';
import { useLocalDataStore } from '@/LocalDataStore';
import { instance } from '@/AxiosInstance';

const PathwayLaunchEditor = () => {
  const selectedPathway = useLocalDataStore((state) => state.selectedPathway);
  const setSelectedPathway = useLocalDataStore(
    (state) => state.setSelectedPathway,
  );
  const clearSelectedPathway = useLocalDataStore(
    (state) => state.clearSelectedPathway,
  );

  const setPathwayPageFocused = useLocalDataStore(
    (state) => state.setPathwayPageFocused,
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
    accept: 'pathway',
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

  useEffect(() => {
    setPathwayPageFocused(true);

    return () => {
      setPathwayPageFocused(false);
    };
  }, []);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      instance
        .get('/api/user')
        .then((response) => {
          const fetchedUser = response.data;
          setUser(fetchedUser);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }, 300);
  }, []);

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
                  {selectedPathway && selectedPathway.title}
                </h1>
              </div>
              <div className="flex flex-1 flex-row-reverse items-center space-x-2 space-x-reverse p-4">
                {loading && <div>
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                </div>}
                <Tooltip>
                  <TooltipTrigger asChild>
                    {user && (user as { admin: boolean }).admin && (
                      <Button
                        variant="outline"
                        size="icon"
                      // onClick={handleDeletePathway}
                      >
                        <Trash className="h-6 w-6" />
                      </Button>
                    )}
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
              'mb-2 mr-2 mt-2 flex flex-grow rounded-lg',
              isOver ? 'bg-red-100' : '',
            )}
          >
            {selectedPathway && (
              <Card className="flex flex-grow flex-row">
                <Card className="mb-4 ml-4 mt-4 flex w-[300px] min-w-[300px] max-w-[300px]">
                  <PathwayFlowDisplay
                    pathway={selectedPathway}
                    controls={false}
                  />
                </Card>
                <ScrollArea
                  className="flex flex-grow flex-col"
                  style={{
                    maxHeight: 'calc(100vh - 100px)',
                  }}
                >
                  <SidebarNav
                    items={stagePropertyTypes}
                    selected={selectedPathwayPropertyType}
                    setSelected={setSelectedPathwayPropertyType}
                  />
                  <PathwayLaunchEditorForm
                    pathway={selectedPathway}
                    selectedPathwayPropertyType={selectedPathwayPropertyType}
                  />
                </ScrollArea>
              </Card>
            )}
          </div>
        </div>
        <PathwayLibrary />
      </div>
    </div>
  );
};

export default PathwayLaunchEditor;

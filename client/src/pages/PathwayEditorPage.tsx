import { FilePlus, Plus, RefreshCcw, Trash } from 'lucide-react';
import NavMenu from '../NavMenu';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import 'reactflow/dist/style.css';
import { useEffect, useState } from 'react';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

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

  const setPathwayPageFocused = useLocalDataStore(
    (state) => state.setPathwayPageFocused,
  );

  useEffect(() => {
    setPathwayPageFocused(true);
    
    return () => {
      setPathwayPageFocused(false);
    };
  }, []);

  const [newPathwayName, setNewPathwayName] = useState('');
  const [newPathwayDesc, setNewPathwayDesc] = useState('');
  const [newPathwayMenuOpen, setNewPathwayMenuOpen] = useState(false);

  const handleCreatePathway = () => {
    setNewPathwayDesc('');
    setNewPathwayName('');
    setNewPathwayMenuOpen(false);
    const newPathway: PathwayTemplate = {
      id: uuid(),
      desc: newPathwayDesc || '',
      title: newPathwayName || 'Untitled Pathway',
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
                <Popover
                  open={newPathwayMenuOpen}
                  onOpenChange={setNewPathwayMenuOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setNewPathwayMenuOpen(!newPathwayMenuOpen)}
                    >
                      <FilePlus className="h-6 w-6" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="flex flex-col space-y-3 p-4"
                    align="start"
                  >
                    <Input
                      value={newPathwayName}
                      onChange={(v) => setNewPathwayName(v.target.value)}
                      placeholder="Pathway name..."
                    ></Input>
                    <Textarea
                      value={newPathwayDesc}
                      onChange={(v) => setNewPathwayDesc(v.target.value)}
                      placeholder="Description"
                    ></Textarea>
                    <Button variant="default" onClick={handleCreatePathway}>
                      Create Pathway
                    </Button>
                  </PopoverContent>
                </Popover>
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
        <PathwayLibrary />
      </div>
    </div>
  );
};

export default PathwayEditor;

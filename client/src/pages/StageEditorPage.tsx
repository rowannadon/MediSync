import { FilePlus, RefreshCcw, Save, Trash } from 'lucide-react';
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
import { StageLibrary } from '../StageLibrary';
import { StageEditorForm } from '../StageEditorForm';
import { useDrop } from 'react-dnd';
import { cn } from '../lib/utils';
import { SidebarNav } from '../FormSidebarNav';
import { useLocalDataStore } from '@/LocalDataStore';
import { StageTemplate } from '@/DataTypes';
import { v4 as uuid } from 'uuid';
import { useRemoteDataStore } from '@/RemoteDataStore';

const StageEditor = () => {
  const selectedStage: StageTemplate | null = useLocalDataStore(
    (state) => state.selectedStage,
  );
  const clearSelectedStage = useLocalDataStore(
    (state) => state.clearSelectedStage,
  );
  const setSelectedStage = useLocalDataStore((state) => state.setSelectedStage);
  const hasStageChanges = useLocalDataStore((state) => state.hasStageChanges);
  const setHasStageChanges = useLocalDataStore(
    (state) => state.setHasStageChanges,
  );

  const addStageTemplate = useRemoteDataStore(
    (state) => state.addStageTemplate,
  );
  const removeStageTemplate = useRemoteDataStore(
    (state) => state.removeStageTemplate,
  );

  const setStagePageFocused = useLocalDataStore(
    (state) => state.setStagePageFocused,
  );

  useEffect(() => {
    setStagePageFocused(true);

    return () => {
      setStagePageFocused(false);
    };
  }, []);

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
      if (hasStageChanges) {
        if (!confirm('You have unsaved changes. Discard changes?')) return;
        setHasStageChanges(false);
      }
      setSelectedStage(stage);
    },
    collect: (monitor: any) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const handleCreateStage = () => {
    if (hasStageChanges) {
      if (!confirm('You have unsaved changes. Discard changes?')) return;
      setHasStageChanges(false);
    }
    const newId = uuid();
    const newStage: StageTemplate = {
      id: newId,
      name: `Untitled Stage ${newId}`,
      desc: '',
      type: 'diagnostic',
      durationEstimate: 30,
      required_equipment: [],
      required_room: '',
      required_staff: [],
      outputs: [],
    };
    setSelectedStage(newStage);
    addStageTemplate(newStage);
  };

  const handleDeleteStage = () => {
    if (!selectedStage) return;
    if (!confirm('Are you sure you want to delete this stage?')) return;
    removeStageTemplate(selectedStage.id);
    clearSelectedStage();
  };

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
                    <Button
                      data-cy="NewStageButton"
                      variant="outline"
                      size="icon"
                      onClick={handleCreateStage}
                    >
                      <FilePlus className="h-6 w-6" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={5}>
                    <p>New</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex flex-grow flex-row items-center justify-center p-1">
                <h1 className="  text-lg font-bold">
                  {selectedStage && selectedStage.name}
                </h1>
              </div>
              <div className="flex flex-1 flex-row-reverse space-x-2 space-x-reverse p-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleDeleteStage}
                    >
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
              'm-2 flex flex-grow overflow-auto rounded-lg',
              isOver ? 'bg-red-100' : '',
            )}
          >
            {selectedStage && (
              <Card
                className={'flex flex-grow flex-col space-x-4 overflow-auto'}
              >
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

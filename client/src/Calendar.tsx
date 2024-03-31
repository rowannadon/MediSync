import NavMenu from './NavMenu';
import { Card } from './components/ui/card';
import Timeline from 'react-vis-timeline';
import './timeline-css.css';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './components/ui/tooltip';
import { Button } from './components/ui/button';
import { Pin, Plus, Trash } from 'lucide-react';
import { Input } from './components/ui/input';
import { createRoot } from 'react-dom/client';
import { useEffect, useRef } from 'react';

const Calendar = () => {
  const timelineRef = useRef<Timeline>(null);

  useEffect(() => {
    if (timelineRef.current) {
      console.log(timelineRef.current.timeline);
      //timelineRef.current.timeline.fit({ animation: true });
    }
  }, [timelineRef]);

  const options = {
    width: 'calc(100vw - 100px)',
    height: '100%',
    rollingMode: {
      follow: true,
      offset: 0.3,
    },
    orientation: 'top',
    groupTemplate: function (
      group: any,
      element: Element,
    ): HTMLElement | string {
      if (!group || !group.content) {
        return '';
      }
      const root = createRoot(element as HTMLElement);
      root.render(
        <div className="flex min-h-[40px] flex-grow flex-row items-center justify-center space-x-2 pl-1 pr-1">
          <Button className="h-8 w-8" size="icon" variant="ghost">
            <Pin className="h-5 w-5" />
          </Button>
          <h1>{group.content}</h1>
        </div>,
      );
      return '';
    },
  };

  const items = [
    {
      id: 1,
      start: new Date(2024, 2, 15),
      end: new Date(2024, 3, 15),
      content: 'Stage 1',
      group: 1,
    },
    {
      id: 2,
      start: new Date(2024, 2, 19),
      end: new Date(2024, 3, 22),
      content: 'Stage 2',
      group: 1,
    },
    {
      id: 3,
      start: new Date(2024, 3, 19),
      end: new Date(2024, 4, 1),
      content: 'Stage A',
      group: 2,
    },
    {
      id: 4,
      start: new Date(2024, 4, 12),
      end: new Date(2024, 4, 29),
      content: 'Stage B',
      group: 2,
    },
    {
      id: 5,
      start: new Date(2024, 3, 12),
      end: new Date(2024, 3, 29),
      content: 'Stage C',
      group: 3,
    },
  ];

  const groups = [
    {
      id: 1,
      content: 'Patient 1',
    },
    {
      id: 2,
      content: 'Patient 2',
    },
    {
      id: 3,
      content: 'Patient 3',
    },
  ];

  return (
    <div className="flex h-screen w-screen flex-row bg-secondary">
      <NavMenu />
      <Card className="mb-2 mr-2 mt-2 flex flex-grow flex-col p-4">
        <TooltipProvider>
          <div className="flex flex-row justify-between pb-4">
            <div className="flex items-center justify-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Input
                    className="w-[300px]"
                    type="search"
                    placeholder="Filter patients..."
                  />
                </TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={5}>
                  <p>Filter patients by name</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex flex-row space-x-2">
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
          </div>
        </TooltipProvider>
        <Card className="flex flex-1">
          <Timeline
            ref={timelineRef}
            options={options}
            initialItems={items}
            initialGroups={groups}
          />
        </Card>
      </Card>
    </div>
  );
};

export default Calendar;

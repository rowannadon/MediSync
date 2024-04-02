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
import { Pin, PinOff, Plus, Trash } from 'lucide-react';
import { Input } from './components/ui/input';
import { createRoot } from 'react-dom/client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Procedure, procedures } from './TempData';
import { BeatLoader } from 'react-spinners';
import { debounce } from 'lodash';

const Calendar = () => {
  const timelineRef = useRef<Timeline>(null);
  const [patientFilter, setPatientFilter] = useState<string>('');
  const displayedPathways = useRef<Procedure[]>([]);
  const [calendarLoading, setCalendarLoading] = useState<boolean>(false);
  const [pinnedPatients, setPinnedPatients] = useState<string[]>([]);

  useEffect(() => {
    if (timelineRef.current) {
      console.log(timelineRef.current.timeline);
      //timelineRef.current.timeline.fit({ animation: true });
    }
  }, [timelineRef]);

  useEffect(() => {
    if (procedures && timelineRef.current) {
      // setCalendarLoading(true);
      // setTimeout(() => {
      //   setCalendarLoading(false);
      // }, 1000);
      displayedPathways.current = procedures.filter(
        (procedure: Procedure) =>
          procedure.patient
            .toLowerCase()
            .includes(patientFilter.toLowerCase()) ||
          pinnedPatients.includes(procedure.patient),
      );
      setCalendarLoading(true);
      console.log('updated displayedPathways', displayedPathways.current);
      deboucedSetPatientFilter();
    }
  }, [procedures, patientFilter, pinnedPatients]);

  const deboucedSetPatientFilter = useCallback(
    debounce(
      () => {
        if (timelineRef.current && displayedPathways.current) {
          const items2 = displayedPathways.current
            .flatMap((procedure: Procedure) =>
              procedure.stages.map((stage) => ({
                ...stage,
                patient: procedure.patient,
              })),
            )
            .map((stage) => {
              const start = new Date(stage.date);
              return {
                id: stage.name,
                start: start,
                end: start.valueOf() + stage.duration * 60 * 1000,
                content: stage.name,
                group: stage.patient,
                subGroup: stage.patient,
              };
            });

          const groups2 = displayedPathways.current.map(
            (procedure: Procedure) => {
              return {
                id: procedure.patient,
                content: procedure.patient,
              };
            },
          );

          console.log('redrawing', items2, groups2);

          timelineRef.current.timeline.setData({
            items: items2,
            groups: groups2,
          });
          setCalendarLoading(false);
        }
      },
      500,
      { trailing: true, leading: false },
    ),
    [],
  );

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
          <Button
            className="h-8 w-8"
            size="icon"
            variant="ghost"
            onClick={() => {
              if (pinnedPatients.includes(group.content)) {
                setPinnedPatients(
                  pinnedPatients.filter((patient) => patient !== group.content),
                );
                console.log('unpinned', group.content);
              } else {
                setPinnedPatients([...pinnedPatients, group.content]);
                console.log('pinned', group.content);
              }
            }}
          >
            {pinnedPatients.includes(group.content) ? (
              <PinOff className="h-5 w-5 text-blue-500" />
            ) : (
              <Pin className="h-5 w-5" />
            )}
          </Button>
          <h1>{group.content}</h1>
        </div>,
      );
      return '';
    },
  };

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
                    onChange={(e) => setPatientFilter(e.target.value)}
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
                  <p>Start New Patient Pathway</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Trash className="h-6 w-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={5}>
                  <p>Delete Patient Pathway</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </TooltipProvider>
        <Card className="relative flex h-full w-full overflow-hidden">
          {calendarLoading && (
            <div className="absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-white">
              <BeatLoader size={40} />
            </div>
          )}
          <Timeline ref={timelineRef} options={options} />
        </Card>
      </Card>
    </div>
  );
};

export default Calendar;

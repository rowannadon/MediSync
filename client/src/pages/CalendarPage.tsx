import NavMenu from '../NavMenu';
import { Card } from '../components/ui/card';
import Timeline from 'react-vis-timeline';
import '../timeline-css.css';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components/ui/tooltip';
import { Button } from '../components/ui/button';
import { Pin, PinOff, Plus, Trash } from 'lucide-react';
import { Input } from '../components/ui/input';
import { createRoot } from 'react-dom/client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { nodeColors, RunningPathway } from '../TempData';
import { BeatLoader } from 'react-spinners';
import { debounce } from 'lodash';
import { add, parse } from 'date-fns';
import { useRemoteDataStore } from '@/RemoteDataStore';

const Calendar = () => {
  const timelineRef = useRef<Timeline>(null);
  const [patientFilter, setPatientFilter] = useState<string>('');
  const displayedPathways = useRef<RunningPathway[]>([]);
  const [calendarLoading, setCalendarLoading] = useState<boolean>(false);
  const [pinnedPatients, setPinnedPatients] = useState<string[]>([]);

  const pathways = useRemoteDataStore((state) => state.runningPathways);
  const getStageTemplate = useRemoteDataStore(
    (state) => state.getStageTemplate,
  );

  useEffect(() => {
    if (timelineRef.current) {
      console.log(timelineRef.current.timeline);
    }
  }, [timelineRef]);

  useEffect(() => {
    if (pathways && timelineRef.current) {
      displayedPathways.current = pathways.filter(
        (procedure: RunningPathway) =>
          procedure.patient
            .toLowerCase()
            .includes(patientFilter.toLowerCase()) ||
          pinnedPatients.includes(procedure.patient),
      );
      setCalendarLoading(true);
      console.log('updated displayedPathways', displayedPathways.current);
      deboucedSetPatientFilter();
    }
  }, [pathways, patientFilter, pinnedPatients]);

  const deboucedSetPatientFilter = useCallback(
    debounce(
      () => {
        if (timelineRef.current && displayedPathways.current) {
          const items2 = displayedPathways.current
            .flatMap((procedure: RunningPathway) =>
              procedure.stages.map((stage) => ({
                ...stage,
                patient: procedure.patient,
              })),
            )
            .flatMap((stage) => {
              console.log('stage', stage);
              const template = getStageTemplate(stage.template);
              console.log('template', template);
              const color =
                nodeColors[template?.type ? template.type : 'default'];
              return [
                {
                  id: stage.id,
                  start: stage.date,
                  title: template?.name ? template.name : 'No Name',
                  end: add(stage.date, { minutes: template?.durationEstimate }),
                  content: template?.name ? template.name : 'No Name',
                  group: stage.patient,
                  selectable: false,
                  type: 'box',
                  style: `background-color: ${color}; border: 1px solid #999`,
                },
                {
                  id: stage.id + '-background',
                  start: stage.date,
                  title: '',
                  end: add(stage.date, { minutes: template?.durationEstimate }),
                  content: '',
                  group: stage.patient,
                  selectable: false,
                  type: 'background',
                  style: `background-color: ${color}; opacity: 0.8; border-left: 2px solid #777; border-right: 2px solid #777;`,
                },
              ];
            });

          const groups2 = displayedPathways.current.map(
            (procedure: RunningPathway) => {
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

  const CalendarGroupTemplate = (props: any) => {
    return (
      <div className="flex flex-row items-center justify-center space-x-2 p-1 pr-2">
        <Button
          className="h-8 w-8"
          size="icon"
          variant="ghost"
          onClick={() => {
            if (pinnedPatients.includes(props.group.content)) {
              setPinnedPatients(
                pinnedPatients.filter(
                  (patient) => patient !== props.group.content,
                ),
              );
              console.log('unpinned', props.group.content);
            } else {
              setPinnedPatients([...pinnedPatients, props.group.content]);
              console.log('pinned', props.group.content);
            }
          }}
        >
          {pinnedPatients.includes(props.group.content) ? (
            <PinOff className="h-5 w-5 text-blue-500" />
          ) : (
            <Pin className="h-5 w-5" />
          )}
        </Button>
        <h1>{props.group.content}</h1>
      </div>
    );
  };

  const CalendarItemTemplate = (props: any) => {
    return (
      <div className="h-[25px] rounded-full">
        <h1>{props.item.content}</h1>
      </div>
    );
  };

  const options = {
    width: 'calc(100vw - 100px)',
    height: '100%',
    groupHeightMode: 'fixed' as const,
    editable: false,
    stack: true,
    margin: 30,
    align: 'left' as const,
    orientation: 'top',
    groupTemplate: function (
      group: any,
      element: Element,
    ): HTMLElement | string {
      if (!group || !group.content) {
        return '';
      }
      const root = createRoot(element as HTMLElement);
      root.render(<CalendarGroupTemplate group={group} />);
      return '';
    },
    template: function (item: any, element: Element): HTMLElement | string {
      if (!item || !item.content) {
        return '';
      }
      const root = createRoot(element as HTMLElement);
      root.render(<CalendarItemTemplate item={item} />);
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

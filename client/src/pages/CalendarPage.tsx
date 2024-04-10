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
import { Procedure, procedures } from '../TempData';
import { BeatLoader } from 'react-spinners';
import { debounce } from 'lodash';
import { add, parse } from 'date-fns';

const Calendar = () => {
  const timelineRef = useRef<Timeline>(null);
  const [patientFilter, setPatientFilter] = useState<string>('');
  const displayedPathways = useRef<Procedure[]>([]);
  const [calendarLoading, setCalendarLoading] = useState<boolean>(false);
  const [pinnedPatients, setPinnedPatients] = useState<string[]>([]);

  useEffect(() => {
    if (timelineRef.current) {
      console.log(timelineRef.current.timeline);
    }
  }, [timelineRef]);

  useEffect(() => {
    if (procedures && timelineRef.current) {
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
            .flatMap((stage) => {
              let parsedDate = new Date(stage.date);
              if (stage.time) {
                const combinedDateTimeString = `${stage.date}T${stage.time}`;
                parsedDate = parse(
                  combinedDateTimeString,
                  "yyyy-MM-dd'T'HH:mm",
                  new Date(),
                );
              } else {
                parsedDate = parse(stage.date, 'yyyy-MM-dd', new Date());
              }

              console.log(
                'parsedDate',
                parsedDate,
                stage.date,
                stage.time,
                stage.duration,
              );

              const color =
                stage.type == 'pre-operative'
                  ? '#FECACA'
                  : stage.type == 'peri-operative'
                  ? '#FEF08A'
                  : '#BBF7D0';
              return [
                {
                  id: stage.name,
                  start: parsedDate,
                  title: stage.name,
                  end: add(parsedDate, { minutes: stage.duration }),
                  content: stage.name,
                  group: stage.patient,
                  selectable: false,
                  type: 'box',
                  style: `background-color: ${color}; border: 1px solid #999;`,
                },
                {
                  id: stage.name + '-background',
                  start: parsedDate,
                  title: stage.name,
                  content: '',
                  end: add(parsedDate, { minutes: stage.duration }),
                  group: stage.patient,
                  selectable: false,
                  type: 'background',
                  style: `background-color: ${color}; border-left: 1px solid red; border-right: 1px solid green;`,
                },
              ];
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

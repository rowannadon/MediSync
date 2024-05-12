import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Task from './TaskDisplay';
import { Card } from './components/ui/card';
import { Checkbox } from './components/ui/checkbox';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { useEffect, useState } from 'react';
import { instance } from './AxiosInstance';
import { RunningStage } from './DataTypes';
import { Table, TableBody, TableCell, TableRow } from './components/ui/table';
import { useRemoteDataStore } from './RemoteDataStore';
import { useLocalDataStore } from './LocalDataStore';
import { useAuth } from './AuthProvider';
import { Textarea } from './components/ui/textarea';
import { Button } from './components/ui/button';

const TasksDisplay = () => {
  const [tasks, setTasks] = useState<RunningStage[]>([]);
  const [selectedTask, setSelectedTask] = useState<RunningStage | null>(null);
  const assignments = useRemoteDataStore((state) => state.assignments);
  const auth = useAuth();
  const runningPathways = useRemoteDataStore((state) => state.runningPathways);
  const people = useRemoteDataStore((state) => state.people);
  const [sortedTasks, setSortedTasks] = useState<RunningStage[]>([]);

  useEffect(() => {
    const tasks = [];
    for (const [key, value] of Object.entries(assignments)) {
      if (value.includes(auth?.getUsername())) {
        const task = runningPathways
          .flatMap((p) => p.stages)
          .find((pathway) => pathway.id === key);
        if (task) {
          tasks.push(task);
        }
      }
    }
    console.log(tasks);
    setTasks(tasks);
  }, [assignments]);

  useEffect(() => {
    const sorted = [...tasks].sort((a: RunningStage, b: RunningStage) => {
      const adate = new Date(a.date);
      const bdate = new Date(b.date);
      if (adate && bdate) {
        return adate.valueOf() - bdate.valueOf();
      } else {
        return 0;
      }
    });
    console.log(sorted);
    setSortedTasks(sorted);
  }, [tasks]);

  const taskList = sortedTasks.map((task: RunningStage) => {
    const date = new Date(task.date);
    return (
      <TableRow
        key={task.id}
        className={`cursor-pointer hover:bg-slate-100 ${
          task.id === selectedTask?.id ? 'bg-slate-200' : 'bg-white'
        }`}
        onClick={() => {
          setSelectedTask(task);
        }}
      >
        <TableCell>{task.template.name}</TableCell>
        <TableCell>{date?.toLocaleTimeString()}</TableCell>
      </TableRow>
    );
  });

  const SelectedTaskDisplay = (props: { task: RunningStage }) => {
    const date = new Date(props.task.date);
    const staffNames = props.task.assigned_staff.map((staff) =>
      people.find((p) => p.username === staff),
    );
    const parentPathway = runningPathways.find((p) =>
      p.stages.find((s) => s.id === props.task.id),
    );
    return (
      <div className="space-y-2 p-4">
        <h1 className=" font-extrabold">{props.task.template.name}</h1>
        <p>Date: {date.toLocaleDateString()}</p>
        <p>Scheduled Time: {date.toLocaleTimeString()}</p>
        <p>Location: {props.task.assigned_room}</p>
        <p>Estimated duration: {props.task.template.durationEstimate} min</p>
        <p>Completed {props.task.completed ? 'Yes' : 'No'} </p>
        <p>Staff:</p>
        <ul className="list-disc">
          {staffNames.map((staff) => (
            <li key={staff?.username}>
              {staff?.role} - {staff?.name}
            </li>
          ))}
        </ul>
        <p>Notes:</p>
        <Textarea
          className="w-full"
          placeholder="No notes..."
          value={parentPathway?.notes}
        />
        <div>
          <Button>Complete Task</Button>
        </div>
      </div>
    );
  };

  return (
    <Card className="mb-2 mr-2 mt-2 flex flex-grow flex-col items-center justify-center p-4">
      <p className="mb-4 text-4xl">
        <strong>Tasks</strong>
      </p>
      <div className="flex flex-grow flex-col items-center justify-center">
        <Card className="flex h-[600x] w-[600px] flex-grow space-x-4 p-4">
          <Card className="flex min-w-[250px]">
            <ScrollArea className="flex flex-grow">
              {taskList.length > 0 && (
                <Table className="w-full">
                  <TableBody className="w-full">{taskList}</TableBody>
                </Table>
              )}
              {taskList.length === 0 && (
                <div className="p-4">
                  <p>No tasks scheduled...</p>
                </div>
              )}
            </ScrollArea>
          </Card>
          {selectedTask && <SelectedTaskDisplay task={selectedTask} />}
        </Card>
      </div>
    </Card>
  );
};

export default TasksDisplay;

import { Card } from './components/ui/card';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { useEffect, useState } from 'react';
import { RunningStage } from './DataTypes';
import { Table, TableBody, TableCell, TableRow } from './components/ui/table';
import { useRemoteDataStore } from './RemoteDataStore';
import { useAuth } from './AuthProvider';
import { Textarea } from './components/ui/textarea';
import { Button } from './components/ui/button';
import { Separator } from './components/ui/separator';
import { useSocket } from './SocketProvider';

const TasksDisplay = () => {
  const [tasks, setTasks] = useState<RunningStage[]>([]);
  const [selectedTask, setSelectedTask] = useState<RunningStage | null>(null);
  const assignments = useRemoteDataStore((state) => state.assignments);
  const auth = useAuth();
  const runningPathways = useRemoteDataStore((state) => state.runningPathways);
  const people = useRemoteDataStore((state) => state.people);
  const [sortedTasks, setSortedTasks] = useState<RunningStage[]>([]);
  const [selectedNext, setSelectedNext] = useState('');
  const socket = useSocket();

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
      people.find((p) => p.username === staff.id),
    );
    const parentPathway = runningPathways.find((p) =>
      p.stages.find((s) => s.id === props.task.id),
    );

    const [notes, setNotes] = useState(parentPathway?.notes);

    const nextOptions = props.task.next.map((next) => {
      const nextStage = parentPathway?.stages.find(
        (s) => s.id === next.next + '$' + parentPathway.patient,
      );
      return (
        <Card
          className={`cursor-pointer p-2 hover:bg-slate-50 ${
            selectedNext === nextStage?.id
              ? 'border-slate-300 bg-slate-200 hover:bg-slate-200'
              : ''
          }`}
          onClick={() => {
            if (nextStage) {
              setSelectedNext(nextStage.id);
            }
          }}
        >
          <p>{nextStage?.template.name}</p>
        </Card>
      );
    });

    return (
      <div className="space-y-2 p-2">
        <h1 className=" font-extrabold">{props.task.template.name}</h1>
        <p>Date: {date.toLocaleDateString()}</p>
        <p>Scheduled Time: {date.toLocaleTimeString()}</p>
        <p>Location: {props.task.assigned_room}</p>
        <p>Estimated duration: {props.task.template.durationEstimate} min</p>
        <p>Staff:</p>
        <ul className="list-disc">
          {staffNames.map((staff) => (
            <li key={staff?.username}>
              {staff?.role} - {staff?.name}
            </li>
          ))}
        </ul>
        <Textarea
          className="w-full"
          placeholder="Add notes..."
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
          }}
        />
        {props.task.next.length > 1 && (
          <Card className="flex flex-col space-y-2 p-2">{nextOptions}</Card>
        )}
        <Separator />
        <div className="flex flex-grow flex-row-reverse">
          <Button
            onClick={() => {
              const completionData = {
                next: selectedNext,
                stage: props.task.id,
                pathway: parentPathway?.id,
                notes: notes,
              };
              console.log(completionData);
              socket?.emit('completeStage', completionData);
            }}
          >
            Complete Task
          </Button>
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
          <Card className="flex min-w-[300px] max-w-[300px]">
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

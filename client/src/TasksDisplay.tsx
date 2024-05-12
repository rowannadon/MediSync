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

const TasksDisplay = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState<RunningStage | null>(null);
  useEffect(() => {
    setTimeout(() => {
      instance
        .get('/api/tasks')
        .then((res) => {
          //console.log(res.data);
          setTasks(res.data);
          if (res.data.length > 0) setSelectedTask(res.data[0]);
        })
        .catch((err) => {
          console.error(err);
        });
    }, 200);
  }, []);

  useEffect(() => {
    console.log(tasks);
    tasks.sort((a: RunningStage, b: RunningStage) => {
      if (a.date && b.date) {
        return a.date.valueOf() - b.date.valueOf();
      } else {
        return 0;
      }
    });
  }, [tasks]);

  const taskList = tasks.map((task: RunningStage) => {
    console.log(task.date);
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
        <TableCell>{task.date?.toString()}</TableCell>
      </TableRow>
    );
  });

  return (
    <Card className="mb-2 mr-2 mt-2 flex flex-grow flex-col items-center justify-center p-4">
      <p className="mb-4 text-4xl">
        <strong>Tasks</strong>
      </p>
      <div className="flex flex-grow flex-col items-center justify-center">
        <Card className="flex h-[600x] w-[600px] flex-grow space-x-4 p-4">
          <Card className="flex flex-shrink">
            <ScrollArea>
              <Table>
                <TableBody>{taskList}</TableBody>
              </Table>
            </ScrollArea>
          </Card>
          {selectedTask && (
            <h1>
              {selectedTask.template.name} {selectedTask.date.toString()}
            </h1>
          )}
        </Card>
      </div>
    </Card>
  );
};

export default TasksDisplay;

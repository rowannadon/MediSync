import NavMenu from '../NavMenu';
import TasksDisplay from '../TasksDisplay';

const TaskPage = () => {
  return (
    <div className="flex h-screen w-screen flex-row bg-secondary">
      <NavMenu />
      <TasksDisplay />
    </div>
  );
};

export default TaskPage;

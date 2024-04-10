import NavMenu from '../NavMenu';
import MyCarousel from '../TasksDisplay';

const TaskPage = () => {
  return (
    <div className="flex h-screen w-screen flex-row bg-secondary">
      <NavMenu />
      <MyCarousel />
    </div>
  );
};

export default TaskPage;

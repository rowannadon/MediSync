import { Route } from 'wouter';
import TestPage from './TestPage';
import PathwayEditor from './pages/PathwayEditorPage';
import { SocketProvider } from './SocketContext';
import Calendar from './pages/CalendarPage';
import Personnel from './pages/PersonnelPage';
import Rooms from './pages/RoomsPage';
import StageEditor from './pages/StageEditorPage';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import PathwayLaunchEditor from './pages/PathwayLaunchEditorPage';
import ConflictManager from './pages/ConflictManagerPage';
import TaskPage from './pages/TaskPage';
import AccountPage from './pages/AccountPage';
import LoginPage from './pages/LoginPage';

const App = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <SocketProvider>
        <div className="flex h-screen w-screen flex-row">
          <Route path="/" component={LoginPage}></Route>
          <Route path="/tasks" component={TaskPage}></Route>
          <Route path="/login" component={LoginPage}></Route>
          <Route path="/test" component={TestPage}></Route>
          <Route path="/pathway-editor" component={PathwayEditor}></Route>
          <Route path="/launch-pathway" component={PathwayLaunchEditor}></Route>
          <Route path="/stage-editor" component={StageEditor}></Route>
          <Route path="/calendar" component={Calendar}></Route>
          <Route path="/conflict" component={ConflictManager}></Route>
          <Route path="/rooms" component={Rooms}></Route>
          <Route path="/personnel" component={Personnel}></Route>
          <Route path="/account" component={AccountPage}></Route>
        </div>
      </SocketProvider>
    </DndProvider>
  );
};

export default App;

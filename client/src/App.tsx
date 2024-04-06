import { Route } from 'wouter';
import TestPage from './TestPage';
import PathwayEditor from './PathwayEditor';
import { SocketProvider } from './SocketContext';
import Calendar from './Calendar';
import Personnel from './Personnel';
import Rooms from './Rooms';
import StageEditor from './StageEditor';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import PathwayLaunchEditor from './PathwayLaunchEditor';
import ConflictManager from './ConflictManager';
import HomePage from './HomePage';
import AccountPage from './AccountPage';

const App = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <SocketProvider>
        <div className="flex h-screen w-screen flex-row">
          <Route path="/" component={HomePage}></Route>
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

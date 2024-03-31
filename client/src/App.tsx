import { Route } from 'wouter';
import TestPage from './TestPage';
import PathwayEditor from './PathwayEditor';
import { SocketProvider } from './SocketContext';
import Calendar from './Calendar';
import Personnel from './Personnel';
import Rooms from './Rooms';
import StageEditor from './StageEditor';

const App = () => {
  return (
    <SocketProvider>
      <div className="flex h-screen w-screen flex-row">
        <Route path="/" component={TestPage}></Route>
        <Route path="/test" component={TestPage}></Route>
        <Route path="/pathway-editor" component={PathwayEditor}></Route>
        <Route path="/stage-editor" component={StageEditor}></Route>
        <Route path="/calendar" component={Calendar}></Route>
        <Route path="/conflict" component={TestPage}></Route>
        <Route path="/rooms" component={Rooms}></Route>
        <Route path="/personnel" component={Personnel}></Route>
        <Route path="/account" component={TestPage}></Route>
      </div>
    </SocketProvider>
  );
};

export default App;

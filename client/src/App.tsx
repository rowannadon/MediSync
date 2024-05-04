import { Route } from 'wouter';
import TestPage from './TestPage';
import PathwayEditor from './pages/PathwayEditorPage';
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
import { SocketProvider } from './SocketProvider';
import { AuthProvider, useAuth } from './AuthProvider';
import { useEffect } from 'react';
import { navigate } from 'wouter/use-browser-location';
import { PrivateRoute } from './PrivateRoute';

const App = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen w-screen flex-row">
        <AuthProvider>
          <SocketProvider>
            <Route path="/" component={LoginPage}></Route>
            <PrivateRoute path="/tasks" component={TaskPage}></PrivateRoute>
            <Route path="/login" component={LoginPage}></Route>
            <PrivateRoute
              path="/pathway-editor"
              component={PathwayEditor}
            ></PrivateRoute>
            <PrivateRoute
              path="/launch-pathway"
              component={PathwayLaunchEditor}
            ></PrivateRoute>
            <PrivateRoute
              path="/stage-editor"
              component={StageEditor}
            ></PrivateRoute>
            <PrivateRoute path="/calendar" component={Calendar}></PrivateRoute>
            <PrivateRoute
              path="/conflict"
              component={ConflictManager}
            ></PrivateRoute>
            <PrivateRoute path="/rooms" component={Rooms}></PrivateRoute>
            <PrivateRoute
              path="/personnel"
              component={Personnel}
            ></PrivateRoute>
            <PrivateRoute
              path="/account"
              component={AccountPage}
            ></PrivateRoute>
            <Route path="/test" component={TestPage}></Route>
          </SocketProvider>
        </AuthProvider>
      </div>
    </DndProvider>
  );
};

export default App;

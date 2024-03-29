import { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const websocketURL = `ws://${window.location.hostname}:${window.location.port}`;
console.log(websocketURL);
const socket = io(websocketURL);

const App = () => {
  const [response, setResponse] = useState('');
  const [socketIoResponse, setSocketIoResponse] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [savedTime, setSavedTime] = useState(['']);

  useEffect(() => {
    function testResponse(message: string) {
      setSocketIoResponse(message);
    }

    setCurrentTime(new Date().toLocaleTimeString());

    socket.on('test', testResponse);

    return () => {
      socket.off('test', testResponse);
    };
  }, []);

  return (
    <div className="text-center selection:bg-green-900">
      <header className="flex min-h-screen flex-col items-center justify-center bg-[#282c34] text-white">
        <h1>Test Deployment</h1>
        <div className="mt-3">
          <button
            type="button"
            className="my-6 rounded bg-gray-300 px-2 py-2 text-[#282C34] transition-all hover:bg-gray-200"
            onClick={() => {
              axios.get('/api/test').then((res) => {
                setResponse(res.data.test);
                console.log(res.data);
              });
            }}
          >
            Get API Response
          </button>
          <p id="api-response">API response: {response}</p>
          <button
            type="button"
            className="my-6 rounded bg-gray-300 px-2 py-2 text-[#282C34] transition-all hover:bg-gray-200"
            onClick={() => {
              socket.emit(
                'testSocketIo',
                'This is a test message from the client!',
              );
            }}
          >
            Get socket.io Response
          </button>
          <p id="socket.io-response">socket.io response: {socketIoResponse}</p>
          <button
            type="button"
            className="my-6 rounded bg-gray-300 px-2 py-2 text-[#282C34] transition-all hover:bg-gray-200"
            onClick={() => {
              const t = new Date().toLocaleTimeString();
              setCurrentTime(t);
              axios.post('/api/time', { time: t });
            }}
          >
            Write current time to database
          </button>
          <p id="current-time">{currentTime}</p>
          <button
            type="button"
            className="my-6 rounded bg-gray-300 px-2 py-2 text-[#282C34] transition-all hover:bg-gray-200"
            onClick={() => {
              axios.get('/api/time').then((res) => {
                console.log(res.data);
                if (res.data.time.length > 0) {
                  setSavedTime(res.data.time);
                }
              });
            }}
          >
            Get saved times from database
          </button>
          Saved times:{' '}
          {savedTime.map((time: any, index: number) => (
            <p className="time" key={index}>
              time: {time.msg}
            </p>
          ))}
        </div>
      </header>
    </div>
  );
};

export default App;

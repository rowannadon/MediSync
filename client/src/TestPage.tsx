import { useEffect, useState } from 'react';
import axios from 'axios';
import { ScrollArea } from './components/ui/scroll-area';
import NavMenu from './NavMenu';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';

const TestPage = () => {
  const [response, setResponse] = useState('');
  const [socketIoResponse, setSocketIoResponse] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [savedTime, setSavedTime] = useState(['']);

  return (
    <div className="flex h-screen w-screen flex-row bg-secondary">
      <NavMenu />
      <Card className="mb-2 mr-2 mt-2 flex flex-grow">
        <ScrollArea className="flex flex-grow">
          <div className="flex min-h-screen flex-grow flex-col items-center justify-center text-foreground">
            <h1 className="text-4xl font-extrabold">Test Deployment</h1>
            <div className="mt-3 space-y-5">
              <Button
                variant="secondary"
                onClick={() => {
                  axios.get('/api/test').then((res) => {
                    setResponse(res.data.test);
                    console.log(res.data);
                  });
                }}
              >
                Get API Response
              </Button>
              <p id="api-response">API response: {response}</p>
              <Button
                variant="secondary"
                onClick={() => {
                  const t = new Date().toLocaleTimeString();
                  setCurrentTime(t);
                  axios.post('/api/time', { time: t });
                }}
              >
                Write current time to database
              </Button>
              <p id="current-time">{currentTime}</p>
              <Button
                variant="secondary"
                onClick={() => {
                  axios.get('/api/time').then((res) => {
                    console.log(res.data);
                    if (res.data.length > 0) {
                      setSavedTime(res.data);
                    }
                  });
                }}
              >
                Get saved times from database
              </Button>
              <p>Saved times:</p>
              {savedTime.map((time: any, index: number) => (
                <p className="time" key={index}>
                  time: {time.msg}
                </p>
              ))}
            </div>
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default TestPage;

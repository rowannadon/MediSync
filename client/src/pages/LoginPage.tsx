import { useState } from 'react';
import NavMenu from '../NavMenu';
import { useAuth } from '@/AuthProvider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { navigate } from 'wouter/use-browser-location';
import { LoaderCircle, X } from 'lucide-react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const loginFunctions = useAuth();

  return (
    <div className="flex h-screen w-screen flex-row bg-secondary">
      <NavMenu />
      <div className="flex h-screen w-screen flex-col items-center justify-center">
        <Card className="flex w-[400px] flex-col" data-cy="LoginForm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="username">Email</Label>
              <Input
                data-cy="LoginUsername"
                id="username"
                type="text"
                placeholder=" Username"
                value={username}
                onChange={(event: any) => setUsername(event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                data-cy="LoginPassword"
                id="password"
                type="password"
                placeholder=" Password"
                value={password}
                onChange={(event: any) => setPassword(event.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            {errorMessage && (
              <div className="mb-4 flex w-full flex-row justify-between rounded-lg bg-red-400 p-3">
                {errorMessage}
                <X
                  className="text-white"
                  onClick={() => {
                    setErrorMessage('');
                  }}
                />
              </div>
            )}

            <Button
              className="w-full rounded bg-primary p-2 text-white"
              onClick={() => {
                console.log('login');
                if (!username && !password) return;
                loginFunctions
                  ?.login(username, password)
                  .then(() => {
                    console.log('logged in');
                    setLoading(true);
                    setTimeout(() => {
                      setLoading(false);
                      navigate('/tasks');
                    }, 500);
                  })
                  .catch((err: any) => {
                    setErrorMessage('Invalid username or password');
                  });
              }}
              disabled={loading}
            >
              Login
              {loading && <LoaderCircle className='animate-spin w-5 h-5' />}
              
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;

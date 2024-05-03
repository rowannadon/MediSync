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

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const loginFunctions = useAuth();

  return (
    <div className="flex h-screen w-screen flex-row bg-secondary">
      <NavMenu />
      <div className="flex h-screen w-screen flex-col items-center justify-center">
        <Card className="flex w-[400px] flex-col space-y-4">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="username">Email</Label>
              <Input
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
                id="password"
                type="password"
                placeholder=" Password"
                value={password}
                onChange={(event: any) => setPassword(event.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full rounded bg-primary p-2 text-white"
              onClick={() => {
                console.log('login');
                loginFunctions
                  ?.login(username, password)
                  .then(() => {
                    console.log('logged in');
                    setTimeout(() => {
                      navigate('/tasks');
                    }, 500);
                  })
                  .catch((err: any) => {
                    console.error(err);
                  });
              }}
            >
              Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;

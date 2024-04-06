import NavMenu from './NavMenu';
import UserInfo from './UserInfo';
import { Button } from './components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './components/ui/popover';
import { Card } from './components/ui/card';

const AccountPage = () => {
  // Replace these values with the actual user's information
  const user = {
    name: 'John Doe',
    phone: '123-456-7890',
    email: 'john.doe@example.com',
    role: 'Nurse',
    department: 'Orthopedics',
    isAdmin: true,
  };

  return (
    <div className="flex h-screen w-screen flex-row bg-secondary">
      <NavMenu />
      <Card className="mb-2 mr-2 mt-2 flex flex-grow">
        <div>
          <p className="pl-12 pt-7 text-xl">
            <strong>User Information</strong>
          </p>
          <UserInfo
            name={user.name}
            phone={user.phone}
            email={user.email}
            role={user.role}
            department={user.department}
            isAdmin={user.isAdmin}
          />
        </div>
        <div className="flex flex-col space-y-4 pl-5 pt-7">
          <p className="text-xl">
            <strong>Schedule</strong>
          </p>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="rounded bg-red-400">
                Sunday: Not scheduled
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-200">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Hours</h4>
                  <p className="text-sm text-muted-foreground">
                    Set the start and end times of shift.
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="sundayStart">Start</Label>
                    <Input
                      id="sundayStart"
                      defaultValue="N/A"
                      className="col-span-2 h-8"
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="sundayEnd">End</Label>
                    <Input
                      id="sundayEnd"
                      defaultValue="N/A"
                      className="col-span-2 h-8"
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="rounded bg-blue-300">
                Monday: 7:00AM - 7:00PM
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-200">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Hours</h4>
                  <p className="text-sm text-muted-foreground">
                    Set the start and end times of shift.
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="mondayStart">Start</Label>
                    <Input
                      id="mondayStart"
                      defaultValue="7:00 AM"
                      className="col-span-2 h-8"
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="mondayEnd">End</Label>
                    <Input
                      id="mondayEnd"
                      defaultValue="7:00 PM"
                      className="col-span-2 h-8"
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="rounded bg-blue-300">
                Tuesday: 7:00AM - 7:00PM
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-200">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Hours</h4>
                  <p className="text-sm text-muted-foreground">
                    Set the start and end times of shift.
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="tuesdayStart">Start</Label>
                    <Input
                      id="tuesdayStart"
                      defaultValue="7:00 AM"
                      className="col-span-2 h-8"
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="tuesdayEnd">End</Label>
                    <Input
                      id="tuesdayEnd"
                      defaultValue="7:00 PM"
                      className="col-span-2 h-8"
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="rounded bg-blue-300">
                Wednesday: 7:00AM - 7:00PM
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-200">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Hours</h4>
                  <p className="text-sm text-muted-foreground">
                    Set the start and end times of shift.
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="wednesdayStart">Start</Label>
                    <Input
                      id="wednesdayStart"
                      defaultValue="7:00 AM"
                      className="col-span-2 h-8"
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="wednesdayEnd">End</Label>
                    <Input
                      id="wednesdayEnd"
                      defaultValue="7:00 PM"
                      className="col-span-2 h-8"
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="rounded bg-blue-300">
                Thursday: 7:00AM - 7:00PM
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-200">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Hours</h4>
                  <p className="text-sm text-muted-foreground">
                    Set the start and end times of shift.
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="thursdayStart">Start</Label>
                    <Input
                      id="thursdayStart"
                      defaultValue="7:00 AM"
                      className="col-span-2 h-8"
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="thursdayEnd">End</Label>
                    <Input
                      id="thursdayEnd"
                      defaultValue="7:00 PM"
                      className="col-span-2 h-8"
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="rounded bg-blue-300">
                Friday: 7:00AM - 7:00PM
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-200">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Hours</h4>
                  <p className="text-sm text-muted-foreground">
                    Set the start and end times of shift.
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="fridayStart">Start</Label>
                    <Input
                      id="fridayStart"
                      defaultValue="7:00 AM"
                      className="col-span-2 h-8"
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="fridayEnd">End</Label>
                    <Input
                      id="fridayEnd"
                      defaultValue="7:00 PM"
                      className="col-span-2 h-8"
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="rounded bg-red-400">
                Saturday: Not scheduled
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-200">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Hours</h4>
                  <p className="text-sm text-muted-foreground">
                    Set the start and end times of shift.
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="saturdayStart">Start</Label>
                    <Input
                      id="saturdayStart"
                      defaultValue="N/A"
                      className="col-span-2 h-8"
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="saturdayEnd">End</Label>
                    <Input
                      id="saturdayEnd"
                      defaultValue="N/A"
                      className="col-span-2 h-8"
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </Card>
    </div>
  );
};

export default AccountPage;

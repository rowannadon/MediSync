import NavMenu from '../NavMenu';
import UserInfo from '../UserInfo';
import { Button } from '../components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../components/ui/popover';
import { Card } from '../components/ui/card';
import { useAuth } from '@/AuthProvider';
import { useState, useEffect } from 'react';
import { instance } from '../AxiosInstance';
import { Person } from '@/DataTypes';
import { LoaderCircle } from 'lucide-react';

const ScheduleItem = ({
  day,
  start: initialStart,
  end: initialEnd,
  setSchedule,
}: {
  day: string;
  start: string;
  end: string;
  setSchedule: any;
}) => {
  const [start, setStart] = useState(initialStart);
  const [end, setEnd] = useState(initialEnd);
  const [isScheduled, setIsScheduled] = useState(false);

  useEffect(() => {
    if (start !== 'None' && end !== 'None') {
      setIsScheduled(true);
    } else {
      setIsScheduled(false);
    }

    setSchedule((prev: any) => {
      return {
        ...prev,
        [day]: {
          start,
          end,
        },
      };
    });
  }, [start, end]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          // className={isScheduled ? 'bg-blue-400' : 'bg-red-400'}
        >
          {day}: {start === 'Off' || end === 'Off' ? 'Not scheduled' : `${start} - ${end}`}
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
              <Label htmlFor={day}>Start</Label>
              <DateSelector day={day} value={start} onChange={setStart} />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor={day}>End</Label>
              <DateSelector day={day} value={end} onChange={setEnd} />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const DateSelector = (props: any) => {
  return (
    <select
      id={props.day}
      value={props.value}
      onChange={(e) => {
        props.onChange(e.target.value);
      }}
      className="col-span-2 h-8"
    >
      <option value="Off">Off</option>
      <option value="12:00 AM">12:00 AM</option>
      <option value="1:00 AM">1:00 AM</option>
      <option value="2:00 AM">2:00 AM</option>
      <option value="3:00 AM">3:00 AM</option>
      <option value="4:00 AM">4:00 AM</option>
      <option value="5:00 AM">5:00 AM</option>
      <option value="6:00 AM">6:00 AM</option>
      <option value="7:00 AM">7:00 AM</option>
      <option value="8:00 AM">8:00 AM</option>
      <option value="9:00 AM">9:00 AM</option>
      <option value="10:00 AM">10:00 AM</option>
      <option value="11:00 AM">11:00 AM</option>
      <option value="12:00 PM">12:00 PM</option>
      <option value="1:00 PM">1:00 PM</option>
      <option value="2:00 PM">2:00 PM</option>
      <option value="3:00 PM">3:00 PM</option>
      <option value="4:00 PM">4:00 PM</option>
      <option value="5:00 PM">5:00 PM</option>
      <option value="6:00 PM">6:00 PM</option>
      <option value="7:00 PM">7:00 PM</option>
      <option value="8:00 PM">8:00 PM</option>
      <option value="9:00 PM">9:00 PM</option>
      <option value="10:00 PM">10:00 PM</option>
      <option value="11:00 PM">11:00 PM</option>
    </select>
  );
};

const AccountPage = () => {
  const auth = useAuth();
  const [user, setUser] = useState<Person | null>(null);
  const [schedule, setSchedule] = useState<any>({});

  useEffect(() => {
    setTimeout(() => {
      instance
        .get('/api/user')
        .then((response) => {
          const fetchedUser = response.data;
          setUser(fetchedUser);
          console.log('fetched user schedule: ', fetchedUser.schedule);
          setSchedule(fetchedUser.schedule);
        })
        .catch((error) => {
          console.error(error);
        });
    }, 300);
  }, []);

  useEffect(() => {
    console.log('schedule updated', schedule);
  }, [schedule]);

  const saveChanges = () => {
    instance
      .post('/api/user/schedule', schedule)
      .then((response) => {
        console.log('Schedule updated successfully: ', response.data);
      })
      .catch((error) => {
        console.error('Error updating schedule: ', error);
      });
  };

  return (
    <div className="flex h-screen w-screen flex-row bg-secondary">
      <NavMenu />
      <Card className="mb-2 mr-2 mt-2 flex flex-grow">
        <div>
          <p className="pl-12 pt-7 text-xl">
            <strong>User Information</strong>
          </p>
          {user && (
            <UserInfo
              name={user.name}
              phone={user.phone}
              email={user.email}
              role={user.role}
              department={user.department}
              isAdmin={user.admin}
            />
          )}
          {!user && (
            <div className="m-10 flex w-full flex-row justify-center">
              <LoaderCircle className="h-5 w-5 animate-spin" />
            </div>
          )}

          <Button
            variant="outline"
            className="ml-10 bg-black text-white"
            onClick={() => {
              auth?.logout();
            }}
          >
            Log Out
          </Button>
        </div>
        <div className="flex flex-col space-y-4 pl-5 pt-7">
          <p className="text-xl">
            <strong>Schedule</strong>
          </p>
          {Object.keys(schedule).map((day) => (
            <ScheduleItem
              key={day}
              day={day}
              start={schedule[day].start}
              end={schedule[day].end}
              setSchedule={setSchedule}
            />
          ))}

          <Button
            variant="outline"
            className="mt-4 bg-black text-white"
            onClick={saveChanges}
          >
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AccountPage;

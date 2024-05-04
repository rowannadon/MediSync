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


const AccountPage = () => {

  const [sundayStart, setSundayStart] = useState('None');
  const [sundayEnd, setSundayEnd] = useState('None');
  const [isSundayScheduled, setIsSundayScheduled] = useState(false);

  const [mondayStart, setMondayStart] = useState('None');
  const [mondayEnd, setMondayEnd] = useState('None');
  const [isMondayScheduled, setIsMondayScheduled] = useState(false);

  const [tuesdayStart, setTuesdayStart] = useState('None');
  const [tuesdayEnd, setTuesdayEnd] = useState('None');
  const [isTuesdayScheduled, setIsTuesdayScheduled] = useState(false);

  const [wednesdayStart, setWednesdayStart] = useState('None');
  const [wednesdayEnd, setWednesdayEnd] = useState('None');
  const [isWednesdayScheduled, setIsWednesdayScheduled] = useState(false);

  const [thursdayStart, setThursdayStart] = useState('None');
  const [thursdayEnd, setThursdayEnd] = useState('None');
  const [isThursdayScheduled, setIsThursdayScheduled] = useState(false);

  const [fridayStart, setFridayStart] = useState('None');
  const [fridayEnd, setFridayEnd] = useState('None');
  const [isFridayScheduled, setIsFridayScheduled] = useState(false);

  const [saturdayStart, setSaturdayStart] = useState('None');
  const [saturdayEnd, setSaturdayEnd] = useState('None');
  const [isSaturdayScheduled, setIsSaturdayScheduled] = useState(false);

  const auth = useAuth();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const accessToken = auth?.getAccessToken();
      const response = await fetch('/api/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    };

    fetchUser();
  }, [auth]);

  if (!user) {
    return <div>Loading...</div>;
  }


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
          
          <Button
            variant="outline" className="ml-10 bg-black text-white"
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
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={isSundayScheduled ? 'bg-blue-400' : 'bg-red-400'}>
                Sunday: {sundayStart === 'None' ? 'Not scheduled' : `${sundayStart} - ${sundayEnd}`}
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
                    <select
                      id="sundayStart"
                      value={sundayStart}
                      onChange={(e) => {
                        setSundayStart(e.target.value);
                        setIsSundayScheduled(e.target.value !== 'None');
                      }}
                      className="col-span-2 h-8"
                    >
                      <option value="None">None</option>
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
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="sundayEnd">End</Label>
                    <select
                      id="sundayEnd"
                      value={sundayEnd}
                      onChange={(e) => {
                        setSundayEnd(e.target.value);
                        setIsSundayScheduled(e.target.value !== 'None');
                      }}
                      className="col-span-2 h-8"
                    >
                      <option value="None">None</option>
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
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={isMondayScheduled ? 'bg-blue-400' : 'bg-red-400'}>
                Monday: {mondayStart === 'None' ? 'Not scheduled' : `${mondayStart} - ${mondayEnd}`}
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
                    <select
                      id="mondayStart"
                      value={mondayStart}
                      onChange={(e) => {
                        setMondayStart(e.target.value);
                        setIsMondayScheduled(e.target.value !== 'None');
                      }}
                      className="col-span-2 h-8"
                    >
                      <option value="None">None</option>
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
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="mondayEnd">End</Label>
                    <select
                      id="mondayEnd"
                      value={mondayEnd}
                      onChange={(e) => {
                        setMondayEnd(e.target.value);
                        setIsMondayScheduled(e.target.value !== 'None');
                      }}
                      className="col-span-2 h-8"
                    >
                      <option value="None">None</option>
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
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={isTuesdayScheduled ? 'bg-blue-400' : 'bg-red-400'}>
                Tuesday: {tuesdayStart === 'None' ? 'Not scheduled' : `${tuesdayStart} - ${tuesdayEnd}`}
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
                    <select
                      id="tuesdayStart"
                      value={tuesdayStart}
                      onChange={(e) => {
                        setTuesdayStart(e.target.value);
                        setIsTuesdayScheduled(e.target.value !== 'None');
                      }}
                      className="col-span-2 h-8"
                    >
                      <option value="None">None</option>
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
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="tuesdayEnd">End</Label>
                    <select
                      id="tuesdayEnd"
                      value={tuesdayEnd}
                      onChange={(e) => {
                        setTuesdayEnd(e.target.value);
                        setIsTuesdayScheduled(e.target.value !== 'None');
                      }}
                      className="col-span-2 h-8"
                    >
                      <option value="None">None</option>
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
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={isWednesdayScheduled ? 'bg-blue-400' : 'bg-red-400'}>
                Wednesday: {wednesdayStart === 'None' ? 'Not scheduled' : `${wednesdayStart} - ${wednesdayEnd}`}
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
                    <select
                      id="wednesdayStart"
                      value={wednesdayStart}
                      onChange={(e) => {
                        setWednesdayStart(e.target.value);
                        setIsWednesdayScheduled(e.target.value !== 'None');
                      }}
                      className="col-span-2 h-8"
                    >
                      <option value="None">None</option>
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
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="wednesdayEnd">End</Label>
                    <select
                      id="wednesdayEnd"
                      value={wednesdayEnd}
                      onChange={(e) => {
                        setWednesdayEnd(e.target.value);
                        setIsWednesdayScheduled(e.target.value !== 'None');
                      }}
                      className="col-span-2 h-8"
                    >
                      <option value="None">None</option>
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
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={isThursdayScheduled ? 'bg-blue-400' : 'bg-red-400'}>
                Thursday: {thursdayStart === 'None' ? 'Not scheduled' : `${thursdayStart} - ${thursdayEnd}`}
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
                    <select
                      id="thursdayStart"
                      value={thursdayStart}
                      onChange={(e) => {
                        setThursdayStart(e.target.value);
                        setIsThursdayScheduled(e.target.value !== 'None');
                      }}
                      className="col-span-2 h-8"
                    >
                      <option value="None">None</option>
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
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="thursdayEnd">End</Label>
                    <select
                      id="thursdayEnd"
                      value={thursdayEnd}
                      onChange={(e) => {
                        setThursdayEnd(e.target.value);
                        setIsThursdayScheduled(e.target.value !== 'None');
                      }}
                      className="col-span-2 h-8"
                    >
                      <option value="None">None</option>
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
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={isFridayScheduled ? 'bg-blue-400' : 'bg-red-400'}>
                Friday: {fridayStart === 'None' ? 'Not scheduled' : `${fridayStart} - ${fridayEnd}`}
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
                    <select
                      id="fridayStart"
                      value={fridayStart}
                      onChange={(e) => {
                        setFridayStart(e.target.value);
                        setIsFridayScheduled(e.target.value !== 'None');
                      }}
                      className="col-span-2 h-8"
                    >
                      <option value="None">None</option>
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
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="fridayEnd">End</Label>
                    <select
                      id="fridayEnd"
                      value={fridayEnd}
                      onChange={(e) => {
                        setFridayEnd(e.target.value);
                        setIsFridayScheduled(e.target.value !== 'None');
                      }}
                      className="col-span-2 h-8"
                    >
                      <option value="None">None</option>
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
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={isSaturdayScheduled ? 'bg-blue-400' : 'bg-red-400'}>
                Saturday: {saturdayStart === 'None' ? 'Not scheduled' : `${saturdayStart} - ${saturdayEnd}`}
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
                    <select
                      id="saturdayStart"
                      value={saturdayStart}
                      onChange={(e) => {
                        setSaturdayStart(e.target.value);
                        setIsSaturdayScheduled(e.target.value !== 'None');
                      }}
                      className="col-span-2 h-8"
                    >
                      <option value="None">None</option>
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
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="saturdayEnd">End</Label>
                    <select
                      id="saturdayEnd"
                      value={saturdayEnd}
                      onChange={(e) => {
                        setSaturdayEnd(e.target.value);
                        setIsSaturdayScheduled(e.target.value !== 'None');
                      }}
                      className="col-span-2 h-8"
                    >
                      <option value="None">None</option>
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
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Button variant="outline" className="mt-4 bg-black text-white">
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AccountPage;

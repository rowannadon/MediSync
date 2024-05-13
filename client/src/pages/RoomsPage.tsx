import NavMenu from '../NavMenu';
import { Card } from '../components/ui/card';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ChevronsUpDown,
  Circle,
  CircleAlert,
  CircleX,
  LoaderCircle,
  MoreHorizontal,
  Plus,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DataTable } from '../DataTable';
import { Equipment, HospitalRoom, Occupancy } from '../DataTypes';
import { Badge } from '../components/ui/badge';
import { useRemoteDataStore } from '@/RemoteDataStore';
import { useEffect, useState } from 'react';
import { instance } from '@/AxiosInstance';
import { Input } from '@/components/ui/input';

export const columns: ColumnDef<HospitalRoom>[] = [
  {
    accessorKey: 'room_number',
    accessorFn: (row) => row.room_number.toString(),
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Room Number
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'type',
    accessorFn: (row) => row.type,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Type
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'equipment',
    header: 'Equipment',
    filterFn: (row, id, value) => {
      return value.every((v: string) =>
        (row.getValue(id) as Equipment[])
          .map((value: Equipment) => value.type)
          .includes(v),
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex flex-row flex-wrap space-x-2">
          {(row.getValue('equipment') as Equipment[]).map((eq: Equipment) => (
            <Badge
              className="mt-2 flex h-[30px] max-h-[30px] flex-row items-center justify-center bg-[#eee] hover:bg-[#ddd]"
              variant="secondary"
              key={eq.type}
            >
              <div className="pr-2 text-center">
                <h1 className="text-center">
                  {eq.type.charAt(0).toUpperCase()}
                  {eq.type.slice(1).replaceAll('_', ' ')}
                </h1>
              </div>

              <div className="border-l-[1px] border-l-[#bbb] pl-2">
                <h1>{eq.count}</h1>
              </div>
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: 'occupancy',
    sortingFn: (rowA, rowB, direction) => {
      const bedsA = (rowA.getValue('occupancy') as Occupancy).total;
      const bedsB = (rowB.getValue('occupancy') as Occupancy).total;

      const occupiedA = (rowA.getValue('occupancy') as Occupancy).current;
      const occupiedB = (rowB.getValue('occupancy') as Occupancy).current;

      return direction === 'asc'
        ? occupiedA / bedsA - occupiedB / bedsB
        : occupiedB / bedsB - occupiedA / bedsA;
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Occupancy
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const occupancy = row.getValue('occupancy') as Occupancy;
      if ((row.getValue('occupancy') as Occupancy).current === 0) {
        return (
          <div>
            <div className="flex w-[70px] flex-col items-center space-y-1">
              <Circle className="text-right font-medium text-green-400" />
              <p>
                {occupancy.current}/{occupancy.total}
              </p>
            </div>
          </div>
        );
      } else if (
        (row.getValue('occupancy') as Occupancy).current === occupancy.total
      ) {
        return (
          <div>
            <div className="flex w-[70px] flex-col items-center space-y-1">
              <CircleX className="text-right font-medium text-destructive" />
              <p>
                {occupancy.current}/{occupancy.total}
              </p>
            </div>
          </div>
        );
      } else {
        return (
          <div>
            <div className="flex w-[70px] flex-col items-center space-y-1">
              <CircleAlert className="text-right font-medium text-yellow-600" />
              <p>
                {occupancy.current}/{occupancy.total}
              </p>
            </div>
          </div>
        );
      }
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original;

      const handleDelete = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
      
        const roomNumber = row.original.room_number; // the room_number of the current row
      
        instance
          .delete(`/api/room/${roomNumber}`)
          .then(() => {
            alert('Room deleted');
          })
          .catch((error) => {
            console.error(error);
            alert('Failed to delete room');
          });
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => console.log(user)}>
              View room
            </DropdownMenuItem>
            <DropdownMenuItem>Edit room</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDelete}>Delete room</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const Rooms = () => {
  const rooms = useRemoteDataStore((state) => state.rooms);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [dialogKey, setDialogKey] = useState(0);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roomNumber, setRoomNumber] = useState('');
  const [roomType, setRoomType] = useState('');
  const [roomCapacity, setRoomCapacity] = useState(0);

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (!roomNumber || !roomType) {
      alert('Please fill in all fields');
      return;
    }

    const newRoom = {
      room_number: roomNumber,
      type: roomType,
      equipment: [],
      occupancy: {
        current: 0,
        total: roomCapacity,
      },
    };

    instance
      .post('/api/newRoom', newRoom)
      .then((response) => {
        console.log(response.data);
        setSuccessMessage('New room created');

        alert('New room created');

        setRoomNumber('');
        setRoomType('');
        setRoomCapacity(0);

        setDialogKey(dialogKey + 1);
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          alert(error.response.data.message);
        } else {
          console.log(error);
        }
      });
    {
      successMessage && <div>{successMessage}</div>;
    }
    console.log('new room created');
  };

  useEffect(() => {
    setTimeout(() => {
      instance
        .get('/api/user')
        .then((response) => {
          const fetchedUser = response.data;
          setUser(fetchedUser);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }, 300);
  }, []);

  if (loading) {
    return (
      <div className="m-10 flex w-full flex-row justify-center">
        <LoaderCircle className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen flex-row bg-secondary">
      <NavMenu />
      <Card className="mb-2 mr-2 mt-2 flex flex-grow">
        <DataTable
          pages={10}
          filterColumn="room_number"
          columns={columns}
          data={rooms}
          multiSelectFilterColumns={[
            {
              column: 'equipment',
              title: 'Equipment',
              options: Array.from(
                new Set(
                  rooms.flatMap((room) => room.equipment.map((eq) => eq.type)),
                ),
              ),
            },
          ]}
          singleSelectFilterColumns={[
            {
              column: 'type',
              title: 'Type',
              options: Array.from(new Set(rooms.map((room) => room.type))),
            },
          ]}
        />
        {loading && (
          <div className="absolute right-7 top-7 z-10 h-6 w-6">
            <LoaderCircle className="h-5 w-5 animate-spin" />
          </div>
        )}
        {user && (user as { admin: boolean }).admin && (
          <div className="space-x-2 pr-4 pt-4">
            <Dialog key={dialogKey}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Plus className="h-6 w-6" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Room</DialogTitle>
                  <DialogDescription>Fill in every box</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <Input
                    placeholder="Room Number"
                    className="mb-4"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                  />
                  <Input
                    placeholder="Type"
                    className="mb-4"
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                  />
                  <Input
                    placeholder="Capacity"
                    className="mb-4"
                    value={roomCapacity || ''}
                    onChange={(e) => setRoomCapacity(Number(e.target.value))}
                  />
                  <Button variant="outline" type="submit">
                    Submit
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Rooms;

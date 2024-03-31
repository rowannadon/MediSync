import NavMenu from './NavMenu';
import { Card } from './components/ui/card';
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
  ArrowUpDown,
  Circle,
  CircleAlert,
  CircleX,
  MoreHorizontal,
  X,
} from 'lucide-react';
import { DataTable } from './DataTable';
import { displayedRooms, Equipment, HospitalRoom } from './TempData';

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
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'equipment',
    header: 'Equipment',
    cell: ({ row }) => {
      return (
        <div className="flex flex-row">
          {(row.getValue('equipment') as Equipment[]).map((eq: Equipment) => (
            <Card
              className="m-1 flex w-[160px] justify-center p-1"
              key={eq.type}
            >
              <h1>
                {eq.type.charAt(0).toUpperCase()}
                {eq.type.slice(1)}
                {'\t:\t'}
                {eq.count}
              </h1>
            </Card>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: 'occupied',
    header: 'Occupancy',
    cell: ({ row }) => {
      const occupied = row.getValue('occupied') as string;
      const beds = (row.getValue('equipment') as Equipment[]).find(
        (eq: Equipment) => eq.type === 'bed',
      )?.count;
      if (row.getValue('occupied') === 0) {
        return (
          <div>
            <div className="flex w-[70px] flex-col items-center space-y-1">
              <Circle className="text-right font-medium text-green-400" />
              <p>
                {occupied}/{beds}
              </p>
            </div>
          </div>
        );
      } else if (row.getValue('occupied') === beds) {
        return (
          <div>
            <div className="flex w-[70px] flex-col items-center space-y-1">
              <CircleX className="text-right font-medium text-destructive" />
              <p>
                {occupied}/{beds}
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
                {occupied}/{beds}
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
            <DropdownMenuItem>Delete room</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const Rooms = () => {
  return (
    <div className="flex h-screen w-screen flex-row bg-secondary">
      <NavMenu />
      <Card className="mb-2 mr-2 mt-2 flex flex-grow">
        <DataTable
          pages={6}
          filterColumn="room_number"
          columns={columns}
          data={displayedRooms}
        />
      </Card>
    </div>
  );
};

export default Rooms;

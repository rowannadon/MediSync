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
  ChevronsUpDown,
  Circle,
  CircleAlert,
  CircleX,
  MoreHorizontal,
} from 'lucide-react';
import { DataTable } from './DataTable';
import { displayedRooms, Equipment, HospitalRoom } from './TempData';
import { Badge } from './components/ui/badge';

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
              className="mt-2 flex h-[30px] max-h-[30px] flex-row bg-[#eee] hover:bg-[#ddd]"
              variant="secondary"
              key={eq.type}
            >
              <div className="pr-2">
                <h1>
                  {eq.type.charAt(0).toUpperCase()}
                  {eq.type.slice(1)}
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
    accessorKey: 'occupied',
    sortingFn: (rowA, rowB, direction) => {
      const bedsA = (rowA.getValue('equipment') as Equipment[]).find(
        (eq: Equipment) => eq.type === 'bed',
      )?.count as number;
      const bedsB = (rowB.getValue('equipment') as Equipment[]).find(
        (eq: Equipment) => eq.type === 'bed',
      )?.count as number;

      const occupiedA = rowA.getValue('occupied') as number;
      const occupiedB = rowB.getValue('occupied') as number;

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
          uniqueFilterColumns={[{ column: 'equipment', title: 'Equipment' }]}
          uniqueFilterColumn={[{ column: 'type', title: 'Type' }]}
        />
      </Card>
    </div>
  );
};

export default Rooms;

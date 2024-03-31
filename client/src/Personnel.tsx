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
import { ArrowUpDown, Check, MoreHorizontal, X } from 'lucide-react';
import { DataTable } from './DataTable';
import { displayedPeople, Person } from './TempData';

export const columns: ColumnDef<Person>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
  },
  {
    accessorKey: 'department',
    header: 'Department',
  },
  {
    accessorKey: 'location',
    header: 'Location',
  },
  {
    accessorKey: 'admin',
    header: 'Admin',
    cell: ({ row }) => {
      if (row.getValue('admin')) {
        return <Check className="text-right font-medium" />;
      } else {
        return <X className="text-right font-medium" />;
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
              View account
            </DropdownMenuItem>
            <DropdownMenuItem>Edit account</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Delete account</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const Personnel = () => {
  return (
    <div className="flex h-screen w-screen flex-row bg-secondary">
      <NavMenu />
      <Card className="mb-2 mr-2 mt-2 flex flex-grow">
        <DataTable
          pages={8}
          filterColumn="name"
          columns={columns}
          data={displayedPeople}
        />
      </Card>
    </div>
  );
};

export default Personnel;

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
import { Check, ChevronsUpDown, LoaderCircle, MoreHorizontal, Plus, X } from 'lucide-react';
import { DataTable } from '../DataTable';
import { Person } from '../DataTypes';
import { useRemoteDataStore } from '@/RemoteDataStore';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { instance } from '../AxiosInstance';

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
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'role',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Role
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
  },
  {
    accessorKey: 'department',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Department
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'location',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Location
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'admin',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Admin
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex flex-row justify-center">
          {row.getValue('admin') ? (
            <Check className="text-center font-medium text-green-400" />
          ) : (
            <X className="text-center font-medium text-destructive" />
          )}
        </div>
      );
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
  const people = useRemoteDataStore((state) => state.people);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
  };

  return (
    <div className="flex h-screen w-screen flex-row bg-secondary">
      <NavMenu />
      <Card className="mb-2 mr-2 mt-2 flex flex-grow">
        
        <DataTable
          pages={8}
          filterColumn="name"
          columns={columns}
          data={people}
          
          singleSelectFilterColumns={[
            {
              column: 'role',
              title: 'Role',
              options: Array.from(new Set(people.map((person) => person.role))),
            },
            {
              column: 'department',
              title: 'Department',
              options: Array.from(
                new Set(people.map((person) => person.department)),
              ),
            },
            {
              column: 'location',
              title: 'Location',
              options: Array.from(
                new Set(people.map((person) => person.location)),
              ),
              
            },
            
          ]}
          
          
        />
        {user && (user as { admin: boolean }).admin && (
          <div className="space-x-2 pt-4 pr-4">
            <Button variant="outline" size="icon">
              <Plus className="h-6 w-6" />
            </Button>
          </div>
        )}
        
      </Card>
    </div>
  );
};

export default Personnel;

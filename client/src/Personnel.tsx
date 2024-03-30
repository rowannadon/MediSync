import NavMenu from './NavMenu';
import { Card } from './components/ui/card';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ArrowUpDown,
  Check,
  MoreHorizontal,
  Plus,
  RefreshCcw,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Input } from './components/ui/input';

type Person = {
  id: number;
  name: string;
  role: string;
  department: string;
  phone: string;
  email: string;
  admin: boolean;
  location: string;
};

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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  });

  return (
    <div className=" flex flex-grow flex-col p-4">
      <div className="flex items-center justify-between pb-4">
        <Input
          placeholder="Filter names..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="space-x-2">
          <Button variant="outline" size="icon">
            <Plus className="h-6 w-6" />
          </Button>
          <Button variant="outline" size="icon">
            <RefreshCcw className="h-6 w-6" />
          </Button>
        </div>
      </div>
      <Card className="flex flex-grow">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
      <div className="flex items-center justify-center space-x-2 pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <span>
          Page {pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

const Personnel = () => {
  const people: Person[] = [
    {
      id: 1,
      name: 'John Doe',
      role: 'Administrator',
      department: 'Information Technology',
      phone: '555-555-5555',
      email: 'john.d@hospital.org',
      admin: true,
      location: 'Room 101',
    },
    {
      id: 2,
      name: 'Jane Doe',
      role: 'Nurse',
      department: 'Emergency',
      phone: '555-523-7234',
      email: 'jane.d@hospital.org',
      admin: false,
      location: 'Room 102',
    },
    {
      id: 3,
      name: 'Jack Doe',
      role: 'Physician',
      department: 'Cardiology',
      phone: '555-123-5566',
      email: 'jack.d@hospital.org',
      admin: false,
      location: 'Room 103',
    },
    {
      id: 4,
      name: 'Jill Doe',
      role: 'Nurse',
      department: 'Radiology',
      phone: '555-442-1454',
      email: 'j.doe@hospital.org',
      admin: false,
      location: 'Room 104',
    },
    {
      id: 7,
      name: 'Emily Smith',
      role: 'Nurse',
      department: 'Pediatrics',
      phone: '555-987-6543',
      email: 'emily.s@hospital.org',
      admin: false,
      location: 'Room 215',
    },
    {
      id: 12,
      name: 'Michael Johnson',
      role: 'Surgeon',
      department: 'Orthopedics',
      phone: '555-456-7890',
      email: 'michael.j@hospital.org',
      admin: true,
      location: 'Operating Room 1',
    },
    {
      id: 19,
      name: 'Sarah Williams',
      role: 'Anesthesiologist',
      department: 'Anesthesia',
      phone: '555-321-0987',
      email: 'sarah.w@hospital.org',
      admin: false,
      location: 'Operating Room 3',
    },
    {
      id: 24,
      name: 'Christopher Brown',
      role: 'Physician Assistant',
      department: 'Emergency Medicine',
      phone: '555-876-5432',
      email: 'christopher.b@hospital.org',
      admin: false,
      location: 'Emergency Department',
    },
    {
      id: 31,
      name: 'Jessica Garcia',
      role: 'Registered Nurse',
      department: 'Intensive Care Unit',
      phone: '555-234-5678',
      email: 'jessica.g@hospital.org',
      admin: false,
      location: 'ICU Ward 2',
    },
    {
      id: 38,
      name: 'William Martinez',
      role: 'Radiologist',
      department: 'Radiology',
      phone: '555-789-0123',
      email: 'william.m@hospital.org',
      admin: false,
      location: 'Radiology Department',
    },
    {
      id: 43,
      name: 'Amanda Davis',
      role: 'Medical Technologist',
      department: 'Laboratory',
      phone: '555-543-2109',
      email: 'amanda.d@hospital.org',
      admin: false,
      location: 'Lab Room 4',
    },
    {
      id: 50,
      name: 'James Wilson',
      role: 'Physical Therapist',
      department: 'Rehabilitation Services',
      phone: '555-210-9876',
      email: 'james.w@hospital.org',
      admin: false,
      location: 'Physical Therapy Gym',
    },
    {
      id: 55,
      name: 'Jennifer Taylor',
      role: 'Clinical Psychologist',
      department: 'Psychiatry',
      phone: '555-678-9012',
      email: 'jennifer.t@hospital.org',
      admin: false,
      location: 'Psychiatry Office',
    },
    {
      id: 62,
      name: 'John Rodriguez',
      role: 'Respiratory Therapist',
      department: 'Respiratory Care',
      phone: '555-901-2345',
      email: 'john.r@hospital.org',
      admin: false,
      location: 'Respiratory Therapy Unit',
    },
  ];

  return (
    <div className="flex h-screen w-screen flex-row bg-secondary">
      <NavMenu />
      <Card className="mb-2 mr-2 mt-2 flex flex-grow">
        <DataTable columns={columns} data={people} />
      </Card>
    </div>
  );
};

export default Personnel;

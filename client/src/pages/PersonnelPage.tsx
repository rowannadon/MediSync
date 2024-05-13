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
import {
  Check,
  ChevronsUpDown,
  LoaderCircle,
  MoreHorizontal,
  Plus,
  X,
} from 'lucide-react';
import { DataTable } from '../DataTable';
import { Person } from '../DataTypes';
import { useRemoteDataStore } from '@/RemoteDataStore';
import { useEffect, useState } from 'react';
import { instance } from '../AxiosInstance';
import { Input } from '@/components/ui/input';

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
      const [currUser, setCurrUser] = useState(null);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        setTimeout(() => {
          instance
            .get('/api/user')
            .then((response) => {
              const fetchedUser = response.data;
              setCurrUser(fetchedUser);
              setLoading(false);
            })
            .catch((error) => {
              console.error(error);
              setLoading(false);
            });
        }, 300);
      }, []);

      const handleDelete = (event: { preventDefault: () => void }) => {
        event.preventDefault();

        instance
          .delete(`/api/user/${user.username}`)
          .then(() => {
            alert('User deleted');
          })
          .catch((error) => {
            console.error(error);
            alert('Failed to delete user');
          });
      };

      return currUser && (currUser as { admin: boolean }).admin ? (
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
            <DropdownMenuItem onClick={handleDelete}>
              Delete account
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null;
    },
  },
];

const Personnel = () => {
  const people = useRemoteDataStore((state) => state.people);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [dialogKey, setDialogKey] = useState(0);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [adminStatus, setAdminStatus] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (
      !name ||
      !role ||
      !department ||
      !phone ||
      !email ||
      !adminStatus ||
      !location ||
      !username ||
      !password
    ) {
      alert('Please fill in all fields');
      return;
    }
    const newUser = {
      name,
      role,
      department,
      phone,
      email,
      admin: adminStatus === 'Admin' ? true : false,
      username,
      password,
    };

    instance
      .post('/api/newUser', newUser)
      .then((response) => {
        console.log(response.data);
        setSuccessMessage('New user created');

        alert('New user created');

        setName('');
        setRole('');
        setDepartment('');
        setPhone('');
        setEmail('');
        setAdminStatus('');
        setUsername('');
        setPassword('');
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
    console.log('new user created');
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
        {loading && (
          <div className="absolute right-7 top-7 z-10 h-6 w-6">
            <LoaderCircle className="h-5 w-5 animate-spin" />
          </div>
        )}
        {user && (user as { admin: boolean }).admin && (
          <div className="absolute right-7 top-7 z-10">
            <Dialog key={dialogKey}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Plus className="h-6 w-6" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New User Account</DialogTitle>
                  <DialogDescription>Fill in every box</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <Input
                    placeholder="Name"
                    className="mb-4"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Input
                    placeholder="Role"
                    className="mb-4"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <Input
                    placeholder="Department"
                    className="mb-4"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                  <Input
                    placeholder="Phone"
                    className="mb-4"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <Input
                    placeholder="Email"
                    className="mb-4"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="mb-4">
                    <Select value={adminStatus} onValueChange={setAdminStatus}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue
                          placeholder="Admin Status"
                          className="pb-4"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="standard">
                            Standard User
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <Input
                    placeholder="Username"
                    className="mb-4"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <Input
                    placeholder="Password"
                    className="mb-4"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

export default Personnel;

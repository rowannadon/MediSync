interface UserInfoProps {
  name: string | undefined;
  phone: string | undefined;
  email: string | undefined;
  role: string | undefined;
  department: string | undefined;
  isAdmin: boolean | undefined;
}

const UserInfo: React.FC<UserInfoProps> = ({
  name,
  phone,
  email,
  role,
  department,
  isAdmin,
}) => {
  return (
    <div className="flex flex-col pl-10 pt-10">
      <p className="mb-2 border p-2">
        <strong>Name:</strong> {name}
      </p>
      <p className="mb-2 border p-2">
        <strong>Phone:</strong> {phone}
      </p>
      <p className="mb-2 border p-2">
        <strong>Email:</strong> {email}
      </p>
      <p className="mb-2 border p-2">
        <strong>Role:</strong> {role}
      </p>
      <p className="mb-2 border p-2">
        <strong>Department:</strong> {department}
      </p>
      <p className="mb-2 border p-2">
        <strong>Account Type:</strong> {isAdmin ? 'Admin' : 'User'}
      </p>
    </div>
  );
};

export default UserInfo;

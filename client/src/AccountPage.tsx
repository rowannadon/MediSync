import NavMenu from './NavMenu';
import UserInfo from './UserInfo';


const AccountPage = () => {
    // Replace these values with the actual user's information
    const user = {
        name: 'John Doe',
        phone: '123-456-7890',
        email: 'john.doe@example.com',
        role: 'Developer',
        department: 'Engineering',
        isAdmin: true,
    };

    return (
        <div className="flex h-screen w-screen flex-row bg-secondary">
            <NavMenu />
            <div>
                <p className="pl-12 pt-5 text-xl"><strong>User Information</strong></p>
                <UserInfo
                    name={user.name}
                    phone={user.phone}
                    email={user.email}
                    role={user.role}
                    department={user.department}
                    isAdmin={user.isAdmin}
                />

            </div>


        </div>
    );
}

export default AccountPage;
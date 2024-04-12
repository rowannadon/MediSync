import NavMenu from '../NavMenu';

const LoginPage = () => {
  return (
    <div className="flex h-screen w-screen flex-row bg-secondary">
      <NavMenu />
      <div className="flex h-screen w-screen flex-col items-center justify-center">
        <div className="flex flex-col space-y-4">
          <h1 className="text-4xl font-bold">Log In</h1>
          <input type="text" placeholder=" Username" />
          <input type="password" placeholder=" Password" />
          <button className="rounded bg-primary p-2 text-white">Login</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

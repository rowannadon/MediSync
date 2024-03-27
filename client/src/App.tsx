import { useState } from 'react';
import logo from './assets/images/logo.svg';
import axios from 'axios';

const App = () => {
  const [response, setResponse] = useState('');

  return (
    <div className="text-center selection:bg-green-900">
      <header className="flex min-h-screen flex-col items-center justify-center bg-[#282c34] text-white">
        <img
          src={logo}
          className="animate-speed h-60 motion-safe:animate-spin"
          alt="logo"
        />
        <style>
          {
            '\
            .animate-speed{\
              animation-duration:20s;\
            }\
          '
          }
        </style>
        <p className="bg-gradient-to-r from-emerald-300 to-sky-300 bg-clip-text text-5xl font-black text-transparent selection:bg-transparent">
          Vite + React + Typescript + Tailwindcss
        </p>
        <p className="mt-3">
          <button
            type="button"
            className="my-6 rounded bg-gray-300 px-2 py-2 text-[#282C34] transition-all hover:bg-gray-200"
            onClick={() => {
              axios.get('/api/test').then((res) => {
                setResponse(res.data.test);
                console.log(res.data);
              });
            }}
          >
            Get API response: {response}
          </button>
        </p>
      </header>
    </div>
  );
};

export default App;

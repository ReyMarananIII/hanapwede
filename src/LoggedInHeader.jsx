import { Link } from 'react-router-dom';

export default function LoggedInHeader() {
  return (
    <header className="flex h-16 items-center justify-between  px-4 lg:px-16 bg-white">
      <Link to="/" className="flex items-center">
        <img
          src="/hanapwedelogo.png"
          alt="Logo"
          className="h-8 w-auto"
        />
      </Link>
      <div className="flex items-center gap-4">
        <button className="bg-[#4CAF50] text-white px-4 py-2 text-sm rounded hover:bg-[#45a049]">
          Update Profile
        </button>
        <Link to="/profile" className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="sr-only">Profile</span>
          {/* You can replace this with an actual profile image */}
          <div className="w-8 h-8 rounded-full bg-gray-300"></div>
        </Link>
      </div>
    </header>
  );
}

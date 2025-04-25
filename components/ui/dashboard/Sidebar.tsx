import Link from 'next/link'; // Or use 'react-router-dom' if using React Router
import { FaRegFileAlt, FaUpload, FaCheckCircle, FaGlobe, FaCog, FaBaby, FaMusic, FaUser, FaChurch, FaBuilding, FaStar, FaUserPlus, FaMicrophone, FaBookOpen } from 'react-icons/fa';

export const Sidebar = () => {
  return (
    <div className="w-64 bg-white text-black flex flex-col p-15 pt-20 ">

      <nav className="flex flex-col gap-4">
        <Link href="/dashboard/index" className="block py-2 px-6 rounded-lg hover:bg-blue-300 flex items-center">
        <FaUser className="mr-3" />
        Client Registration
        </Link>
        <Link href="/dashboard/health_program" className="block py-2 px-6 rounded-lg hover:bg-blue-300 flex items-center">
        <FaBaby className="mr-3" />
        Health Programs
        </Link>
        <Link href="/dashboard/health_program_enrollment" className="block py-2 px-6 rounded-lg hover:bg-blue-300 flex items-center">
        <FaMusic className="mr-3" />
        Health Program Enrollment
        </Link>
        <Link href="/dashboard/client_details" className="block py-2 px-6 rounded-lg hover:bg-blue-300 flex items-center">
        <FaChurch className="mr-3" />
        Client Details
        </Link>
        <Link href="/dashboard/client_profile" className="block py-2 px-6 rounded-lg hover:bg-blue-300 flex items-center">
        <FaBuilding className="mr-3" />
        Client Profile
        </Link>
      
      </nav>
    </div>
  );
};


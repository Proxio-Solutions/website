import Footer from '@components/Footer';
import Navbar from '@components/Navbar';
import { Outlet } from 'react-router-dom';

export default function App() {
  return (
    <div className="bg-proxio-darker text-proxio-text-main flex min-h-screen flex-col">
      <Navbar />

      <div className="flex-1">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}

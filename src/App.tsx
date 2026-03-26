import Footer from '@components/Footer';
import Navbar from '@components/Navbar';
import ScrollToHash from '@components/ScrollToHash';
import { Outlet } from 'react-router-dom';

export default function App() {
  return (
    <div className="bg-proxio-darker text-proxio-text-main flex min-h-screen flex-col">
      <ScrollToHash />
      <Navbar />

      <div className="flex-1">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}

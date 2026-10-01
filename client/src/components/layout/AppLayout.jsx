import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-[#0e0e11] text-textPrimary overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 relative flex flex-col h-full overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}

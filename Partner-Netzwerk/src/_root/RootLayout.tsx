// Import components from the shared components directory
import Bottombar from '@/components/shared/Bottombar';
import LeftSidebar from '@/components/shared/LeftSidebar';
import Topbar from '@/components/shared/Topbar';

// Import the Outlet component from react-router-dom for rendering nested routes
import { Outlet } from 'react-router-dom';

const RootLayout = () => {
  return (
    <div className="w-full md:flex">  {/* Main container with full width, applies flex layout on medium screens and above */}
      <Topbar />  {/* Render the Topbar component */}
      <LeftSidebar />  {/* Render the LeftSidebar component */}

      <section className='flex flex-1 h-full'> {/* Content section with flex layout, takes up remaining space, and full height */}
        <Outlet />  {/* Renders content from nested routes */}
      </section>

      <Bottombar />  {/* Render the Bottombar component */}
    </div>
  )
}

export default RootLayout;

import { Outlet, Navigate } from "react-router-dom";
import VideoBg from "/assets/videos/website_video.mp4"

import { useUserContext } from "@/context/AuthContext";

export default function AuthLayout() {
  // Get the authentication state from the AuthContext
  const { isAuthenticated } = useUserContext();

  return (
    <>
      {isAuthenticated ? (
        // If user is authenticated, redirect them to the home page
        <Navigate to="/" />
      ) : (
        <>
          {/* Full-screen background video */}
          <video 
            src={VideoBg} 
            autoPlay 
            loop 
            muted 
            className="fixed top-0 left-0 w-full h-full object-cover -z-10"
          />

          {/* Semi-transparent overlay */}
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 -z-10"></div>

          {/* Container for child components */}
          <section className="flex flex-1 justify-center items-center flex-col py-10 relative z-10">
              <Outlet />
          </section>
        </>
      )}
    </>
  );
}

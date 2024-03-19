import { Outlet, Navigate } from "react-router-dom";

import { useUserContext } from "@/context/AuthContext";

export default function AuthLayout() {
  const { isAuthenticated } = useUserContext();

  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          <section className="flex flex-1 justify-center items-center flex-col py-10">
            <Outlet />
          </section>

          <img
            src="/assets/images/ecurie_aix_background_img.jpg"
            alt="logo"
            className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
            style={{
              WebkitMaskImage: 'linear-gradient(to right, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 1) 30%, rgba(0, 0, 0, 0))',
              maskImage: 'linear-gradient(to right, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 0))',
              transition: 'filter 0.5s, -webkit-mask-image 0.5s, mask-image 0.5s'
            }}
          />
        </>
      )}
    </>
  )
}
import { bottombarLinks } from '@/constants'; // Import bottombar links from constants file
import { Link, useLocation } from 'react-router-dom'; // Import Link and useLocation from react-router-dom

const Bottombar = () => {
  const { pathname } = useLocation(); // Get current pathname from useLocation hook

  return (
    <section className='bottom-bar'>
      {bottombarLinks.map((link) => {
        const isActive = pathname === link.route; // Check if current pathname matches link route

        return (
          <Link
            to={link.route}
            key={link.label}
            className={`${isActive && 'bg-ecurie-babyblue rounded-[10px]'} flex-center flex-col gap-1 p-2 transition`}>

            <img
              src={link.imgURL}
              alt={link.label}
              width={16}
              height={16}
              className={`group-hover:invert-white ${isActive && 'invert-white'}`} // Apply invert-white on hover and active
            />
            <p className='tiny-medium text-light-2'>
              {link.label}
            </p>
          </Link>
        );
      })}
    </section>
  );
};

export default Bottombar;

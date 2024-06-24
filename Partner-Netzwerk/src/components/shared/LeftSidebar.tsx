import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Button } from '../ui/button'
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations'
import { useUserContext } from '@/context/AuthContext'
import { INavLink } from '@/types'
import { sidebarLinks } from '@/constants'

const LeftSidebar = () => {

    // Get current pathname from useLocation hook
    const { pathname } = useLocation();

    // Get signOut mutation and isSuccess state from useSignOutAccount hook
    const { mutate: signOut, isSuccess } = useSignOutAccount();

    // Get navigate function from useNavigate hook for programmatic navigation
    const navigate = useNavigate();

    // Get user data from useUserContext hook
    const { user } = useUserContext();

    const [nameColor, setNameColor] = useState('');

    useEffect(() => {
        // Determine color based on user's role
        const role = user?.role[0] || '';
        if (role === 'E') {
            setNameColor('text-ecurie-babyblue');
        } else if (role === 'A') {
            setNameColor('text-ecurie-babyblue');
        } else if (role === 'P') {
            setNameColor('text-ecurie-pink');
        }
        else if (role === 'H') {
            setNameColor('text-ecurie-pink');
        }
        else {
            setNameColor('text-ecurie-darkred');
        }
    }, [user]);
    console.log(user.role)
    console.log(nameColor)

    // useEffect hook to handle navigation after successful signOut
    useEffect(() => {
        // If signOut mutation is successful, navigate back to home (/)
        if (isSuccess) {
            navigate(0); // navigate to index (home) route
        }
        // Add dependency array to avoid infinite loop on isSuccess change
        // This array ensures the effect only runs once on initial render and after isSuccess changes
    }, [isSuccess])

    return (
        <nav className="leftsidebar bg-gradient-to-l from-light-1 from:10% to-gray-300 to-90% dark:from-dark-1 dark:from-40% dark:to-dark-3 dark:to-90%">
            <div className='flex flex-col gap-11'>
                <Link to='/' className='flex gap-3 items-center'>
                    {/* Company logo */}
                    <img
                        src="/assets/images/Ecurie-Aix-Logo-blau.png"
                        alt='logo'
                        width={170}
                        height={36}
                    />
                </Link>

                <Link to={`/profile/${user.id}`} className='flex gap-3 items-center'>
                    {/* User profile picture */}
                    <img
                        src={user.imageUrl || '/assets/icons/profile-placeholder.svg'}
                        alt='profile'
                        className='h-14 w-14 rounded-full object-cover'
                    />
                    <div className='flex flex-col'>
                        <p className="body-bold font-Univers_LT_Std_57">
                            {user.name}
                        </p>
                        <p className={`small-regular ${nameColor}`}>
                            @{user.username}
                        </p>
                    </div>
                </Link>

                <ul className='flex flex-col gap-6'>
                    {/* Loop through sidebar links and render navigation items */}
                    {sidebarLinks.map((link: INavLink) => {
                        const isActive = pathname === link.route;

                        return (
                            <li key={link.label}
                                className={`rounded-lg base-medium hover:bg-ecurie-lightgrey transition leftsidebar-link group ${isActive && 'bg-ecurie-lightgrey dark:bg-ecurie-babyblue font-Univers_LT_Std_57'
                                    }`}>
                                <NavLink
                                    to={link.route}
                                    className='flex gap-4 items-center p-4'>

                                    <img
                                        src={link.imgURL}
                                        alt={link.label}
                                        className={`dark:group-hover:invert-white ${isActive && 'dark:invert-white'
                                            }`}
                                    />
                                    {link.label}
                                </NavLink>
                            </li>

                        )
                    })}
                </ul>
            </div>
            {/* Logout button */}
            <Button variant='ghost' className='shad-button_ghost' onClick={() => signOut()}>
                <img
                    src='/assets/icons/logout.svg'
                    alt='logout'
                />
                <p className='small-medium lg:base-medium'>
                    Abmelden
                </p>
            </Button>
        </nav>
    )
}

export default LeftSidebar

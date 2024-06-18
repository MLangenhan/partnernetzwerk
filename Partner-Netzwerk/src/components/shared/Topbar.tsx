import { useEffect } from 'react' // Import for managing side effects
import { Link, useNavigate } from 'react-router-dom' // Imports for navigation
import { Button } from '../ui/button' // Import for button component
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations' // Import for sign out mutation
import { useUserContext } from '@/context/AuthContext' // Import for user context

const Topbar = () => {

    const { mutate: signOut, isSuccess } = useSignOutAccount(); // Destructure signOut and isSuccess from useSignOutAccount hook
    const navigate = useNavigate(); // Hook for programmatic navigation
    const { user } = useUserContext(); // Destructure user from useUserContext hook

    useEffect(() => {
        if (isSuccess) { // Check if signOut mutation was successful
            navigate(0); // If successful, navigate to home route (/)
        }
    }, [isSuccess]); // Dependency array for useEffect - only re-run on isSuccess change

    return (
        <section className='topbar'>
            <div className='flex-between py-4 px-5'>
                <Link to='/' className='flex gap-3 items-center'>
                    {/* Logo */}
                    <img
                        src='/assets/images/Ecurie-Aix-Logo-blau.png'
                        alt='logo'
                        width={130}
                        height={325}
                    />
                </Link>
                <div className='flex gap-4'>
                    {/* Logout Button */}
                    <Button variant='ghost' className='shad-button_ghost' onClick={() => signOut()}>
                        <img src='/assets/icons/logout.svg' alt='logout' />
                    </Button>
                    {/* Profile Link */}
                    <Link to={`/profile/${user.id}`} className='flex-center gap-3'>
                        <img
                            src={user.imageUrl || '/assets/icons/profile-placeholder.svg'}
                            alt='profile'
                            className='h-8 w-8 rounded-full'
                        />
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default Topbar

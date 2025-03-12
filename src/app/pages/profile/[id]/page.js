import { UserProvider } from '@/app/contaxt/userContaxt'
import Sidebar from '@/app/components/Sidebar'
import BottomNavbar from '@/app/components/BottomNavbar'
import UserProfile from '../profile'

const page = () => {
  return (
    <div className='relative w-full h-screen'>
      <UserProvider>
        <div className='w-full flex '>
          <Sidebar />
          <UserProfile />
        </div>
        <BottomNavbar />
      </UserProvider>
    </div>
  )
}

export default page

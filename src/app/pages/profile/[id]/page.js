import { UserProvider } from '@/app/contaxt/userContaxt'
import Sidebar from '@/app/components/Sidebar'
import BottomNavbar from '@/app/components/BottomNavbar'
import UserProfile from '../profile'
import Posts from './Posts'

const page = ({params}) => {
  console.log(params)
  return (
    <div className='relative w-full h-screen'>
      <UserProvider>
        <div className='w-full flex flex-col'>
          <Sidebar />
          <UserProfile />
          {/* <Posts/> */}
        </div>
        <BottomNavbar />
      </UserProvider>
    </div>
  )
}

export default page

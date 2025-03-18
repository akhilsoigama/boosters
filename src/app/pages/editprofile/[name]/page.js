import Sidebar from '@/app/components/Sidebar'
import BottomNavbar from '@/app/components/BottomNavbar'
import EditProfile from './EditProfile'
import { use } from 'react'

const page = ({ params }) => {
    const{name}=use(params)
    
    return (
        <div className='relative w-full h-screen'>
                <div className='w-full flex flex-col'>
                    {/* <Sidebar /> */}
                    <EditProfile name={name} />
                </div>
                <BottomNavbar />
            
        </div>
    )
}

export default page

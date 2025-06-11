import BottomNavbar from '@/app/components/BottomNavbar'
import EditProfile from './EditProfile'
import { use } from 'react'

const page = ({ params }) => {
    const{name}=use(params)
    
    return (
        <div className='relative w-full  pb-10 scrollbar-hide dark:bg-slate-950'>
                <div className='w-full flex flex-col scrollbar-hide overflow-auto '>
                    <EditProfile name={name} />
                </div>
                <BottomNavbar />
            
        </div>
    )
}

export default page

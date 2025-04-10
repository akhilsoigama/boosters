import Chatbot from "@/app/components/Chatbot/chatbot"
import { Button } from "@mui/material"
import Link from "next/link"

const page = () => {
    return (
        <div className="bg-slate-950 w-full">
            <div className="w-full h-screen flex justify-center items-center bg-slate-950">
                <div>
                    <Link href='/'><Button>Back</Button></Link>
                    <Chatbot />
                </div>
            </div>
        </div>
    )
}

export default page

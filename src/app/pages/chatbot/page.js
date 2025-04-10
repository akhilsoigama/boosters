'use client'
import { Button } from "@mui/material"
import dynamic from "next/dynamic";
import Link from "next/link"
const Chatbot = dynamic(() => import('../../components/Chatbot/chatbot'), { ssr: false });

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

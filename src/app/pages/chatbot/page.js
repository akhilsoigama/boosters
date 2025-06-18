'use client'
import { Button } from "@mui/material"
import dynamic from "next/dynamic";
import Link from "next/link"
const Chatbot = dynamic(() => import('../../components/Chatbot/chatbot'), { ssr: false });

const page = () => {
    return (
        <div className="bg-slate-950 w-full min-h-screen">
            <div className="w-full h-screen flex flex-col justify-center items-center bg-slate-950">
                <div className="w-full max-w-4xl p-6 bg-slate-900 rounded-lg shadow-lg">
                    <div className="mb-6">
                        <Link href='/'>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                            >
                                Back
                            </Button>
                        </Link>
                    </div>
                    <div className="w-full dark:bg-gray-900">
                        <Chatbot />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page
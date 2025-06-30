"use client"
import { motion } from "framer-motion";
import Image from "next/image";

export default function Bot() {
    return (
        <span className="fixed  bottom-28 xl:bottom-44  left-5 xl:left-10 z-50 w-14 h-14 xl:w-20 xl:h-20 flex items-center justify-center opacity-65 xl:opacity-100">
            {/* Auriolas animadas */}
            <motion.span
                className="absolute w-20 h-20  rounded-full bg-blue/80"
                initial={{ scale: 1, opacity: 0 }}
                animate={{ scale: [1.2  , 1.1, 1 ], opacity: [0, 0.2 , .5] }}
                transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut"
                }}
            /> 
            {/* Botón principal */}
            <span className="relative z-10 bg-blue/95 transition-all ease-in-out duration-200 hover:bg-blue w-full h-full rounded-full border-2 border-white cursor-pointer" >
                <Image
                    src="/img/chatbot.png"
                    alt="Chatbot"
                    width={100}
                    height={100}
                    className="w-full h-full rounded-full"
                />
            </span>
        </span>
    );
}
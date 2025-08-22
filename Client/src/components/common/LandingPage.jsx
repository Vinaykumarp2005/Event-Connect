import { cn } from "@/lib/utils";
import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate=useNavigate();
  const liners=["Fun","Learning","Opportunities","Events","Students","People","Hackathons","WorkShops","Seminars","Technical Events","Meetups"];
  const [index,setIndex]=useState(0);
  
  useEffect(()=>{
    const interval=setInterval(()=>{setIndex((prev)=>(prev+1)%liners.length)},1000);
    return ()=>clearInterval(interval)
  },[])
  
  return (
   <div className="relative flex h-screen w-full items-center justify-center bg-white dark:bg-black">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
      <div className="flex flex-col px-4 sm:px-6 max-w-xl mx-auto">
         <h1 className="relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-4 sm:py-8 text-xl sm:text-3xl md:text-5xl font-bold text-transparent text-center">
          Find<strong className="font-bold text-[rgba(8,_112,_184,_0.7)]"> {liners[index]}</strong> near you
        </h1>
        <p className="relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text text-transparent text-pretty text-center text-sm sm:text-base md:text-lg">
          Elevate your campus experience — from hackathons and workshops to fests and meetups — and dive into a vibrant community filled with learning, networking, and unforgettable moments.
        </p>
        <button 
          className="mx-auto my-4 border border-[rgba(8,_112,_184,_0.7)] rounded-md relative z-20 py-1 px-2 sm:py-2 sm:px-4 hover:bg-neutral-900 transition-colors" 
          onClick={()=>navigate('/signup')}
        > 
          <span className="bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text text-transparent">
            Explore Events
          </span>
        </button>
      </div>
    </div>
  )
}

export default LandingPage
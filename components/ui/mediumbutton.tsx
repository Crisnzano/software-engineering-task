import React from "react";

export default function MediumButton({
    children,
    onClick,


}: {
    children: React.ReactNode
    onClick?: () => void
}) {
    return (
      <>
      <button 
      onClick={onClick}
      className="text-sm bg-gray-400 px-7 py-3 rounded-[7px] text-white font-semibold">
        {children}
      </button>
      </>  
    )
}
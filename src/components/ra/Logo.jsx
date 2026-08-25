import React from "react";
import { Image } from "@/components/ui/image";

export default function Logo({ light = false, compact = false, className = "" }) {
  const iconSize = compact
    ? "h-7 w-7 shrink-0 sm:h-9 sm:w-9"
    : "h-16 w-16 shrink-0 sm:h-20 sm:w-20 lg:h-28 lg:w-28";
  const nameSize = compact
    ? "text-base sm:text-lg"
    : "text-2xl sm:text-3xl lg:text-5xl";
  const subtitleSize = compact
    ? "text-[6px] sm:text-[10px] sm:tracking-[0.1em]"
    : "text-[9px] sm:text-sm lg:text-xl sm:tracking-[0.15em]";

  return (
    <div className={`group flex items-center gap-2 [perspective:800px] ${className}`}>
      <Image
        src="https://media.base44.com/images/public/6a7e084b2a4955a8b5e1cb3d/057207cec_ChatGPT_Image_15_de_ago_de_2026__18_55_22-removebg-preview.png"
        alt="RA Energética"
        fittingType="fit"
        className={iconSize} />
      
      <div className="relative flex flex-col leading-none transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(-8deg)_rotateX(3deg)]">
        <span
          className="font-extrabold italic tracking-tight"
          style={{ fontFamily: "Arial, sans-serif" }}>
          
          <span
            style={{
              color: light ? "#4F7CFF" : "#1B2C54",
              textShadow: light ?
              "1px 1px 0 #12278a, 2px 2px 0 #12278a, 3px 3px 4px rgba(0,0,0,0.35)" :
              "1px 1px 0 #0d1730, 2px 2px 0 #0d1730, 3px 3px 4px rgba(0,0,0,0.35)"
            }} className={nameSize}>
            
            RA
          </span>
          <span
            style={{
              color: "#E3231C",
              textShadow:
              "1px 1px 0 #a5150f, 2px 2px 0 #a5150f, 3px 3px 4px rgba(0,0,0,0.35)"
            }} className={nameSize}>
            
            ENERGÉTICA
          </span>
        </span>
        <span
          className={`-mt-0.5 whitespace-nowrap font-bold uppercase tracking-[0.1em] text-center text-[hsl(var(--popover))] ${subtitleSize}`}
          style={{
            fontFamily: "Arial, sans-serif",
            color: "#1E3FCC",
            textShadow: "1px 1px 0 #12278a, 2px 2px 3px rgba(0,0,0,0.3)"
          }}>
          
          Locações &amp; Eventos
        </span>
      </div>
    </div>);

}
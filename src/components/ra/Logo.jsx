import React from "react";
import { Image } from "@/components/ui/image";

const BLUE = "#1B2C54";
const BLUE_LIGHT = "#4F7CFF";

export default function Logo({ light = false, compact = false, tiny = false, className = "" }) {
  const color = light ? BLUE_LIGHT : BLUE;
  const iconSize = tiny
    ? "h-9 w-9 shrink-0 sm:h-10 sm:w-10"
    : compact
    ? "h-11 w-11 shrink-0 sm:h-14 sm:w-14 lg:h-16 lg:w-16"
    : "h-16 w-16 shrink-0 sm:h-24 sm:w-24 lg:h-32 lg:w-32";
  const nameSize = tiny
    ? "text-lg sm:text-xl"
    : compact
    ? "text-lg sm:text-2xl lg:text-3xl"
    : "text-3xl sm:text-5xl lg:text-6xl";
  const subtitleSize = tiny
    ? "text-[8px] sm:text-[10px]"
    : compact
    ? "text-[8px] sm:text-[11px] lg:text-xs sm:tracking-[0.14em]"
    : "text-xs sm:text-base lg:text-xl sm:tracking-[0.16em]";

  return (
    <div className={`group flex min-w-0 max-w-full items-center gap-2 sm:gap-3 [perspective:800px] ${className}`}>
      <span
        className={`${iconSize} inline-flex items-center justify-center`}
        style={{
          filter: light
            ? "brightness(0) invert(1)"
            : "brightness(0) saturate(100%) invert(13%) sepia(42%) saturate(1486%) hue-rotate(196deg) brightness(92%) contrast(95%)",
        }}
      >
        <Image
          src="https://media.base44.com/images/public/6a7e084b2a4955a8b5e1cb3d/057207cec_ChatGPT_Image_15_de_ago_de_2026__18_55_22-removebg-preview.png"
          alt="RA Energética"
          fittingType="fit"
          className="h-full w-full object-contain"
        />
      </span>

      <div className="relative flex min-w-0 flex-col leading-none transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(-8deg)_rotateX(3deg)]">
        <span
          className={`block truncate font-extrabold italic tracking-tight ${nameSize}`}
          style={{ fontFamily: "Arial, sans-serif", color }}
        >
          RAENERGÉTICA
        </span>
        <span
          className={`-mt-0.5 whitespace-nowrap text-center font-bold uppercase tracking-[0.12em] ${subtitleSize}`}
          style={{ fontFamily: "Arial, sans-serif", color }}
        >
          Geradores
        </span>
      </div>
    </div>
  );
}

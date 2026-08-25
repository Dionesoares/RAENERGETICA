import React, { useEffect, useMemo, useRef, useState } from "react";
import brazil from "@svg-maps/brazil";
import { OPERATING_STATES } from "@/lib/company";

const ACTIVE = new Set(OPERATING_STATES.map((state) => state.id));

export default function BrazilCoverageMap() {
  const svgRef = useRef(null);
  const [centers, setCenters] = useState({});
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const next = {};
    for (const location of brazil.locations) {
      const node = svg.querySelector(`[data-state="${location.id}"]`);
      if (!node || typeof node.getBBox !== "function") continue;
      const box = node.getBBox();
      next[location.id] = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    }
    setCenters(next);
  }, []);

  const hoveredMeta = useMemo(
    () => brazil.locations.find((location) => location.id === hovered),
    [hovered]
  );

  return (
    <div className="flex h-full min-h-[300px] flex-col bg-[#f7fbf3] p-4 sm:min-h-[420px] sm:p-8">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Onde atuamos</p>
        <h3 className="mt-1 font-heading text-xl font-bold text-primary">Presente no Norte e Nordeste</h3>
      </div>

      <div className="relative mx-auto w-full max-w-[460px] flex-1">
        <svg
          ref={svgRef}
          viewBox={brazil.viewBox}
          role="img"
          aria-label="Mapa do Brasil com os estados de atuação da RA Energética"
          className="h-full w-full"
        >
          {brazil.locations.map((location) => {
            const active = ACTIVE.has(location.id);
            return (
              <path
                key={location.id}
                d={location.path}
                data-state={location.id}
                onMouseEnter={() => setHovered(location.id)}
                onMouseLeave={() => setHovered(null)}
                className={
                  active
                    ? "cursor-pointer fill-primary stroke-white stroke-[1.2] transition-colors hover:fill-[#24386a]"
                    : "fill-[#cfe6b8] stroke-white stroke-[1.1]"
                }
              >
                <title>{location.name}</title>
              </path>
            );
          })}

          {brazil.locations.map((location) => {
            const point = centers[location.id];
            if (!point) return null;
            const active = ACTIVE.has(location.id);
            return (
              <text
                key={`${location.id}-label`}
                x={point.x}
                y={location.id === "to" ? point.y + 10 : point.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className={`pointer-events-none select-none font-sans text-[11px] font-extrabold ${
                  active ? "fill-white" : "fill-[#1B2C54]"
                }`}
              >
                {location.id.toUpperCase()}
              </text>
            );
          })}

          {centers.to && (
            <g transform={`translate(${centers.to.x}, ${centers.to.y - 12})`}>
              <path
                d="M0,-18 C-7.2,-18 -11.5,-12.5 -11.5,-6.2 C-11.5,2.4 0,16 0,16 C0,16 11.5,2.4 11.5,-6.2 C11.5,-12.5 7.2,-18 0,-18 Z"
                className="fill-[#E3231C] stroke-white stroke-[1.2]"
              />
              <circle cy="-8" r="3.4" className="fill-white" />
            </g>
          )}
        </svg>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {OPERATING_STATES.map((state) => (
          <div
            key={state.id}
            className={`rounded-xl px-3 py-2 text-center text-sm font-bold ${
              hovered === state.id ? "bg-primary text-white" : "bg-primary/10 text-primary"
            }`}
          >
            {state.uf}
            <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-wide opacity-80">
              {state.hq ? "Sede — Palmas" : state.name}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        {hoveredMeta
          ? ACTIVE.has(hovered)
            ? `Atendemos ${hoveredMeta.name}`
            : `${hoveredMeta.name} — expansão sob consulta`
          : "Tocantins, Maranhão, Piauí e Pará"}
      </p>
    </div>
  );
}

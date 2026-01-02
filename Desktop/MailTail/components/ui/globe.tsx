"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";
import { cn } from "@/lib/utils";

export function Globe({
  className,
  size = 600,
  dark = false,
}: {
  className?: string;
  size?: number;
  dark?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;
    let width = 0;

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };
    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvasRef.current!, {
      devicePixelRatio: 2,
      width: size * 2,
      height: size * 2,
      phi: 0,
      theta: 0.3,
      dark: dark ? 1 : 0,
      diffuse: dark ? 1.2 : 3,
      mapSamples: 16000,
      mapBrightness: dark ? 6 : 1.2,
      baseColor: dark ? [0.1, 0.1, 0.1] : [1, 1, 1],
      markerColor: [0.133, 0.773, 0.369], // #22c55e
      glowColor: dark ? [0.1, 0.1, 0.1] : [1, 1, 1],
      markers: [
        // Major email hubs
        { location: [37.7749, -122.4194], size: 0.05 }, // San Francisco
        { location: [40.7128, -74.006], size: 0.05 }, // New York
        { location: [51.5074, -0.1278], size: 0.05 }, // London
        { location: [35.6762, 139.6503], size: 0.04 }, // Tokyo
        { location: [1.3521, 103.8198], size: 0.04 }, // Singapore
        { location: [52.52, 13.405], size: 0.04 }, // Berlin
        { location: [-33.8688, 151.2093], size: 0.03 }, // Sydney
        { location: [19.4326, -99.1332], size: 0.03 }, // Mexico City
        { location: [55.7558, 37.6173], size: 0.03 }, // Moscow
        { location: [28.6139, 77.209], size: 0.03 }, // New Delhi
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.003;
      },
    });

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [size, dark]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("w-full h-full", className)}
      style={{
        width: size,
        height: size,
        maxWidth: "100%",
        aspectRatio: 1,
      }}
    />
  );
}

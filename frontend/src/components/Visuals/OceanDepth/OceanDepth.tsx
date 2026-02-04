import { useRef, useEffect } from "react";
import type { VisualProps } from "../types";

interface Organism {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hue: number;
  pulse: number;
}

export default function OceanDepth({ isActive, speed = 1 }: VisualProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const organisms: Organism[] = Array.from({ length: 30 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 8 + 2,
      hue: 180 + Math.random() * 60, // Cyan to blue range
      pulse: Math.random() * Math.PI * 2,
    }));

    let animationId: number;
    let time = 0;

    const render = () => {
      if (!isActive) return;

      // Dark blue gradient background
      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      bgGradient.addColorStop(0, "#001220");
      bgGradient.addColorStop(1, "#000510");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Draw organisms with glow
      organisms.forEach((org) => {
        const brightness = 0.5 + Math.sin(time * speed + org.pulse) * 0.5;

        // Glow effect
        const glow = ctx.createRadialGradient(
          org.x,
          org.y,
          0,
          org.x,
          org.y,
          org.radius * 4,
        );
        glow.addColorStop(0, `hsla(${org.hue}, 100%, 70%, ${brightness})`);
        glow.addColorStop(
          0.5,
          `hsla(${org.hue}, 100%, 50%, ${brightness * 0.3})`,
        );
        glow.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.arc(org.x, org.y, org.radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(org.x, org.y, org.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${org.hue}, 100%, 80%, ${brightness})`;
        ctx.fill();

        // Update position
        org.x += org.vx * speed;
        org.y += org.vy * speed;

        // Wrap around
        if (org.x < -20) org.x = width + 20;
        if (org.x > width + 20) org.x = -20;
        if (org.y < -20) org.y = height + 20;
        if (org.y > height + 20) org.y = -20;
      });

      time += 0.02;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [isActive, speed]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

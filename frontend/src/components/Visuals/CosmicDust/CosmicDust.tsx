import { useRef, useEffect } from "react";
import type { VisualProps } from "../types";

interface Star {
  x: number;
  y: number;
  z: number;
  radius: number;
  twinkle: number;
}

export default function CosmicDust({ isActive, speed = 1 }: VisualProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const stars: Star[] = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      z: Math.random(),
      radius: Math.random() * 2 + 0.5,
      twinkle: Math.random() * Math.PI * 2,
    }));

    let animationId: number;
    let time = 0;

    const render = () => {
      if (!isActive) return;

      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      stars.forEach((star) => {
        // Twinkle effect
        const brightness = 0.5 + Math.sin(time * speed + star.twinkle) * 0.5;

        // Draw star with glow
        const gradient = ctx.createRadialGradient(
          star.x,
          star.y,
          0,
          star.x,
          star.y,
          star.radius * 3,
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${brightness})`);
        gradient.addColorStop(0.5, `rgba(200, 220, 255, ${brightness * 0.5})`);
        gradient.addColorStop(1, "rgba(200, 220, 255, 0)");

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Move stars slowly
        star.y += star.z * 0.2 * speed;
        if (star.y > canvas.offsetHeight) {
          star.y = 0;
          star.x = Math.random() * canvas.offsetWidth;
        }
      });

      time += 0.02;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [isActive, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full bg-black"
    />
  );
}

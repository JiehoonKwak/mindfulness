import { useRef, useEffect } from "react";
import type { VisualProps } from "../types";

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export default function LiquidMetal({ isActive, speed = 1 }: VisualProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    // Reduce ball count on mobile for performance
    const isMobile = width < 768;
    const ballCount = isMobile ? 5 : 8;

    const balls: Ball[] = Array.from({ length: ballCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      radius: 50 + Math.random() * 30,
    }));

    let animationId: number;

    const render = () => {
      if (!isActive) return;

      ctx.clearRect(0, 0, width, height);

      // Update ball positions
      balls.forEach((ball) => {
        ball.x += ball.vx * speed;
        ball.y += ball.vy * speed;

        // Bounce off walls
        if (ball.x < ball.radius || ball.x > width - ball.radius) ball.vx *= -1;
        if (ball.y < ball.radius || ball.y > height - ball.radius)
          ball.vy *= -1;

        // Draw metallic gradient
        const gradient = ctx.createRadialGradient(
          ball.x - ball.radius * 0.3,
          ball.y - ball.radius * 0.3,
          0,
          ball.x,
          ball.y,
          ball.radius,
        );
        gradient.addColorStop(0, "#ffffff");
        gradient.addColorStop(0.3, "#c0c0c0");
        gradient.addColorStop(0.7, "#808080");
        gradient.addColorStop(1, "#404040");

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [isActive, speed]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

import { useRef, useEffect } from "react";
import type { VisualProps } from "../types";

export default function AuroraFallback({ isActive, speed = 1 }: VisualProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    let time = 0;
    let animationId: number;

    const render = () => {
      if (!isActive) return;

      // Dark sky background
      const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
      skyGradient.addColorStop(0, "#001020");
      skyGradient.addColorStop(1, "#000510");
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, width, height);

      // Create aurora bands with gradients
      for (let i = 0; i < 5; i++) {
        const yBase = height * 0.3 + Math.sin(time * 0.5 + i * 0.5) * 30;
        const yEnd = height * 0.7 + Math.cos(time * 0.3 + i * 0.7) * 40;

        const gradient = ctx.createLinearGradient(0, yBase, 0, yEnd);

        // Color varies by band
        const hue = 120 + Math.sin(time * 0.2 + i) * 40; // Green to cyan
        gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
        gradient.addColorStop(0.3, `hsla(${hue}, 80%, 50%, ${0.1 + i * 0.03})`);
        gradient.addColorStop(0.5, `hsla(${hue}, 80%, 60%, ${0.15 + i * 0.02})`);
        gradient.addColorStop(
          0.7,
          `hsla(${hue + 20}, 70%, 50%, ${0.1 + i * 0.02})`
        );
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      time += 0.02 * speed;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [isActive, speed]);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
  );
}

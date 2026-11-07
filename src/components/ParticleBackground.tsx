import React, { useEffect, useRef } from 'react';

export const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // 3D Starfield with Z-axis depth
    const starCount = Math.min(100, Math.floor((width * height) / 12000));
    const stars: Array<{
      x: number;
      y: number;
      z: number;
      size: number;
      color: string;
      alpha: number;
    }> = [];

    const colors = ['#0284c7', '#6366f1', '#8b5cf6', '#059669', '#d97706', '#38bdf8'];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 1.5,
        y: (Math.random() - 0.5) * height * 1.5,
        z: Math.random() * 1000 + 100,
        size: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.7 + 0.3,
      });
    }

    // Laser/Quantum nodes
    const nodeCount = 20;
    const nodes: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
    }> = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2.2 + 1.8,
        color: i % 2 === 0 ? '#0284c7' : '#8b5cf6',
      });
    }

    // Colorful Floating 3D Planets & Science Orbs
    const planets = [
      {
        baseX: width * 0.15,
        baseY: height * 0.22,
        radius: 38,
        color1: '#38bdf8',
        color2: '#0284c7',
        ringColor: 'rgba(56, 189, 248, 0.4)',
        hasRing: true,
        angle: 0.2,
        speed: 0.003,
        parallax: 0.04,
      },
      {
        baseX: width * 0.88,
        baseY: height * 0.35,
        radius: 46,
        color1: '#ec4899',
        color2: '#8b5cf6',
        ringColor: 'rgba(236, 72, 153, 0.35)',
        hasRing: true,
        angle: -0.35,
        speed: 0.002,
        parallax: 0.03,
      },
      {
        baseX: width * 0.78,
        baseY: height * 0.82,
        radius: 28,
        color1: '#f59e0b',
        color2: '#f97316',
        ringColor: 'rgba(251, 191, 36, 0.4)',
        hasRing: false,
        angle: 0,
        speed: 0.004,
        parallax: 0.06,
      },
      {
        baseX: width * 0.08,
        baseY: height * 0.75,
        radius: 30,
        color1: '#10b981',
        color2: '#059669',
        ringColor: 'rgba(16, 185, 129, 0.35)',
        hasRing: true,
        angle: 0.5,
        speed: 0.0035,
        parallax: 0.05,
      },
    ];

    let atomicAngle = 0;

    const render = () => {
      // Smooth mouse parallax interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      const offsetX = (mouseX - width / 2) * 0.08;
      const offsetY = (mouseY - height / 2) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // 1. Luminous Airy Science Nebula backdrop (Soft Blue, Lavender, Coral Pink, Warm Gold)
      const grad1 = ctx.createRadialGradient(
        width * 0.25 - offsetX * 0.5,
        height * 0.25 - offsetY * 0.5,
        50,
        width * 0.25,
        height * 0.25,
        Math.max(width, height) * 0.7
      );
      grad1.addColorStop(0, 'rgba(56, 189, 248, 0.20)'); // Radiant sky blue
      grad1.addColorStop(0.5, 'rgba(192, 132, 252, 0.15)'); // Soft lavender
      grad1.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // Secondary Solar & Coral Energy Aura
      const grad2 = ctx.createRadialGradient(
        width * 0.85 + offsetX * 0.3,
        height * 0.65 + offsetY * 0.3,
        20,
        width * 0.85,
        height * 0.65,
        Math.max(width, height) * 0.6
      );
      grad2.addColorStop(0, 'rgba(251, 146, 60, 0.14)'); // Coral orange
      grad2.addColorStop(0.5, 'rgba(251, 191, 36, 0.12)'); // Sunny gold
      grad2.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Floating 3D Planets with atmospheric auras and rings
      planets.forEach((p, idx) => {
        const floatY = Math.sin(Date.now() * 0.001 + idx) * 8;
        const px = p.baseX - offsetX * p.parallax;
        const py = p.baseY - offsetY * p.parallax + floatY;

        // Outer soft glow
        const auraGrad = ctx.createRadialGradient(px, py, p.radius * 0.8, px, py, p.radius * 1.8);
        auraGrad.addColorStop(0, p.color1 + '33');
        auraGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(px, py, p.radius * 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Planet 3D Sphere shading
        const sphereGrad = ctx.createRadialGradient(
          px - p.radius * 0.35,
          py - p.radius * 0.35,
          p.radius * 0.1,
          px,
          py,
          p.radius
        );
        sphereGrad.addColorStop(0, '#ffffff');
        sphereGrad.addColorStop(0.2, p.color1);
        sphereGrad.addColorStop(0.85, p.color2);
        sphereGrad.addColorStop(1, '#0f172a');

        ctx.beginPath();
        ctx.arc(px, py, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = sphereGrad;
        ctx.shadowColor = p.color1;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Planet Planetary Ring
        if (p.hasRing) {
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(p.angle);
          ctx.beginPath();
          ctx.ellipse(0, 0, p.radius * 1.8, p.radius * 0.45, 0, 0, Math.PI * 2);
          ctx.strokeStyle = p.ringColor;
          ctx.lineWidth = 3;
          ctx.stroke();
          ctx.restore();
        }
      });

      // 3. Floating 3D Atomic Orbit (Molecular Physics symbol)
      atomicAngle += 0.015;
      const atomX = width * 0.5 - offsetX * 0.02;
      const atomY = height * 0.18 - offsetY * 0.02;
      ctx.save();
      ctx.translate(atomX, atomY);
      for (let r = 0; r < 3; r++) {
        ctx.save();
        ctx.rotate(atomicAngle + (r * Math.PI) / 3);
        ctx.beginPath();
        ctx.ellipse(0, 0, 50, 16, 0, 0, Math.PI * 2);
        ctx.strokeStyle = r === 0 ? 'rgba(56, 189, 248, 0.35)' : r === 1 ? 'rgba(168, 85, 247, 0.3)' : 'rgba(16, 185, 129, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Orbiting electron
        const ex = Math.cos(atomicAngle * 2 + r) * 50;
        const ey = Math.sin(atomicAngle * 2 + r) * 16;
        ctx.beginPath();
        ctx.arc(ex, ey, 3, 0, Math.PI * 2);
        ctx.fillStyle = r === 0 ? '#0284c7' : r === 1 ? '#a855f7' : '#10b981';
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();

      // 4. Draw 3D Stars with parallax and warp depth
      const cx = width / 2;
      const cy = height / 2;

      stars.forEach((star) => {
        star.z -= 0.6;
        if (star.z <= 10) {
          star.z = 1000;
          star.x = (Math.random() - 0.5) * width * 1.5;
          star.y = (Math.random() - 0.5) * height * 1.5;
        }

        const k = 400 / star.z;
        const px = (star.x - offsetX) * k + cx;
        const py = (star.y - offsetY) * k + cy;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const currentSize = Math.max(0.6, star.size * k * 0.8);
          ctx.beginPath();
          ctx.arc(px, py, currentSize, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.globalAlpha = Math.min(1, star.alpha * (1 - star.z / 1000));
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1;

      // 5. Draw Quantum Constellation lines between nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x - offsetX * 0.3, nodes[i].y - offsetY * 0.3);
            ctx.lineTo(nodes[j].x - offsetX * 0.3, nodes[j].y - offsetY * 0.3);
            const lineAlpha = (1 - dist / 130) * 0.25;
            ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      }

      // Update & draw Quantum Nodes
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0) n.x = width;
        if (n.x > width) n.x = 0;
        if (n.y < 0) n.y = height;
        if (n.y > height) n.y = 0;

        ctx.beginPath();
        ctx.arc(n.x - offsetX * 0.3, n.y - offsetY * 0.3, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.shadowColor = n.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};

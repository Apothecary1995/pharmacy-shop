import React, { useEffect, useRef } from 'react';
// did debugging on the cursor to lightweight website 
function SplashCursor() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const ctx = canvas.getContext('2d');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let particles = [];

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
     
      for (let i = 0; i < 3; i++) {
        particles.push({
          x: mouseX,
          y: mouseY,
          size: Math.random() * 4 + 2,
          speedX: Math.random() * 6 - 3,
          speedY: Math.random() * 6 - 3,
          color: `hsl(${Math.random() * 360}, 100%, 50%)`,
          life: 50
        });
      }
    };

    const animate = () => {
    
      //ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.clearRect(0, 0, canvas.width, canvas.height);

    
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 4, 0, Math.PI * 2);
      ctx.fill();

      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        p.x += p.speedX;
        p.y += p.speedY;
        p.life--;

        const alpha = p.life / 50;
        ctx.fillStyle = p.color.replace(')', `, ${alpha})`).replace('hsl', 'hsla');
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.life <= 0) {
          particles.splice(i, 1);
          i--;
        }
      }

      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 9999,
      pointerEvents: 'none',
      width: '100%',
      height: '100%'
    }}>
      <canvas 
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block'
        }}
      />
    </div>
  );
}

export default SplashCursor;
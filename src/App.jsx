import React, { useState, useEffect, useRef } from 'react';

const AnimationApp = () => {
  const [selectedAnimation, setSelectedAnimation] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [size, setSize] = useState(1);
  const [hueShift, setHueShift] = useState(0);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Fully data-driven animation configurations
  const animationData = [
    {
      id: 0,
      name: '🌊 Wave Pool',
      config: {
        cols: 50,
        rows: 30,
        baseSpeed: 0.03,
        baseAmplitude: 20,
        baseParticleSize: 3,
        baseHue: 200,
        offsetMultiplier: 0.1,
        trailColor: 'rgba(10, 10, 30, 0.1)',
        saturation: 70,
        lightness: 60
      },
      init: (canvas, config) => {
        const particles = [];
        for (let i = 0; i < config.cols; i++) {
          for (let j = 0; j < config.rows; j++) {
            particles.push({
              x: (canvas.width / config.cols) * i,
              y: (canvas.height / config.rows) * j,
              baseY: (canvas.height / config.rows) * j,
              offset: (i + j) * config.offsetMultiplier
            });
          }
        }
        return { particles, time: 0 };
      },
      animate: (ctx, canvas, config, state) => {
        ctx.fillStyle = config.trailColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        state.particles.forEach(p => {
          const wave = Math.sin(state.time + p.offset) * config.baseAmplitude * config.size;
          ctx.fillStyle = `hsl(${(config.baseHue + wave * 2 + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
          ctx.beginPath();
          ctx.arc(p.x, p.baseY + wave, config.baseParticleSize * config.size, 0, Math.PI * 2);
          ctx.fill();
        });

        state.time += config.baseSpeed * config.speed;
      }
    },
    {
      id: 1,
      name: '🎯 Orbit Dance',
      config: {
        count: 8,
        baseRadius: 100,
        radiusIncrement: 20,
        baseSpeed: 0.02,
        speedIncrement: 0.005,
        baseSize: 8,
        baseHue: 0,
        hueIncrement: 45,
        trailColor: 'rgba(0, 0, 0, 0.05)',
        glowAmount: 20,
        saturation: 80,
        lightness: 60
      },
      init: (canvas, config) => {
        const orbiters = [];
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        for (let i = 0; i < config.count; i++) {
          orbiters.push({
            angle: (Math.PI * 2 / config.count) * i,
            radius: (config.baseRadius + i * config.radiusIncrement) * config.size,
            speed: (config.baseSpeed + i * config.speedIncrement) * config.speed,
            baseHue: config.baseHue + i * config.hueIncrement
          });
        }
        return { orbiters, centerX, centerY };
      },
      animate: (ctx, canvas, config, state) => {
        ctx.fillStyle = config.trailColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        state.orbiters.forEach(orb => {
          const x = state.centerX + Math.cos(orb.angle) * orb.radius;
          const y = state.centerY + Math.sin(orb.angle) * orb.radius;
          const color = `hsl(${(orb.baseHue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
          
          ctx.fillStyle = color;
          ctx.shadowBlur = config.glowAmount;
          ctx.shadowColor = color;
          ctx.beginPath();
          ctx.arc(x, y, config.baseSize * config.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          orb.angle += orb.speed;
        });
      }
    },
    {
      id: 2,
      name: '✨ Particle Rain',
      config: {
        count: 100,
        baseSpeed: 2,
        speedVariation: 3,
        baseLength: 10,
        lengthVariation: 20,
        baseHue: 180,
        hueVariation: 60,
        lineWidth: 2,
        trailColor: 'rgba(0, 0, 20, 0.1)',
        saturation: 70,
        lightness: 60
      },
      init: (canvas, config) => {
        const drops = [];
        for (let i = 0; i < config.count; i++) {
          drops.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: (config.baseSpeed + Math.random() * config.speedVariation) * config.speed,
            length: (config.baseLength + Math.random() * config.lengthVariation) * config.size,
            baseHue: config.baseHue + Math.random() * config.hueVariation
          });
        }
        return { drops };
      },
      animate: (ctx, canvas, config, state) => {
        ctx.fillStyle = config.trailColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        state.drops.forEach(drop => {
          ctx.strokeStyle = `hsl(${(drop.baseHue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
          ctx.lineWidth = config.lineWidth * config.size;
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x, drop.y + drop.length);
          ctx.stroke();

          drop.y += drop.speed;
          if (drop.y > canvas.height) {
            drop.y = -drop.length;
            drop.x = Math.random() * canvas.width;
          }
        });
      }
    },
    {
      id: 3,
      name: '🌀 Spiral Galaxy',
      config: {
        particleCount: 200,
        spiralTurns: 8,
        maxRadius: 200,
        baseSpeed: 0.01,
        speedVariation: 0.02,
        baseSize: 2,
        sizeVariation: 3,
        baseHue: 260,
        trailColor: 'rgba(0, 0, 10, 0.05)',
        saturation: 80,
        lightness: 60
      },
      init: (canvas, config) => {
        const particles = [];
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        for (let i = 0; i < config.particleCount; i++) {
          const angle = (i / config.particleCount) * Math.PI * config.spiralTurns;
          const radius = (i / config.particleCount) * config.maxRadius * config.size;
          particles.push({
            angle,
            radius,
            speed: (config.baseSpeed + (1 - i / config.particleCount) * config.speedVariation) * config.speed,
            size: (config.baseSize + Math.random() * config.sizeVariation) * config.size,
            baseHue: config.baseHue + i / 2
          });
        }
        return { particles, centerX, centerY };
      },
      animate: (ctx, canvas, config, state) => {
        ctx.fillStyle = config.trailColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        state.particles.forEach(p => {
          const x = state.centerX + Math.cos(p.angle) * p.radius;
          const y = state.centerY + Math.sin(p.angle) * p.radius;

          ctx.fillStyle = `hsl(${(p.baseHue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
          ctx.beginPath();
          ctx.arc(x, y, p.size, 0, Math.PI * 2);
          ctx.fill();

          p.angle += p.speed;
        });
      }
    },
    {
      id: 4,
      name: '💫 Bouncing Balls',
      config: {
        count: 30,
        baseRadius: 10,
        radiusVariation: 20,
        baseVelocity: 4,
        gravity: 0.2,
        damping: 0.9,
        baseHue: 0,
        trailColor: 'rgba(20, 20, 40, 0.1)',
        saturation: 70,
        lightness: 60
      },
      init: (canvas, config) => {
        const balls = [];
        for (let i = 0; i < config.count; i++) {
          balls.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * config.baseVelocity * config.speed,
            vy: (Math.random() - 0.5) * config.baseVelocity * config.speed,
            radius: (config.baseRadius + Math.random() * config.radiusVariation) * config.size,
            baseHue: config.baseHue + Math.random() * 360,
            gravity: config.gravity * config.speed
          });
        }
        return { balls };
      },
      animate: (ctx, canvas, config, state) => {
        ctx.fillStyle = config.trailColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        state.balls.forEach(ball => {
          ball.vy += ball.gravity;
          ball.x += ball.vx;
          ball.y += ball.vy;

          if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
            ball.vx *= -config.damping;
            ball.x = ball.x + ball.radius > canvas.width ? canvas.width - ball.radius : ball.radius;
          }
          if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
            ball.vy *= -config.damping;
            ball.y = ball.y + ball.radius > canvas.height ? canvas.height - ball.radius : ball.radius;
          }

          ctx.fillStyle = `hsl(${(ball.baseHue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
          ctx.beginPath();
          ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    },
    {
      id: 5,
      name: '🌟 Star Field',
      config: {
        starCount: 200,
        baseSpeed: 5,
        maxStarSize: 5,
        baseHue: 200,
        hueVariation: 60,
        trailColor: 'rgba(0, 0, 0, 0.2)',
        saturation: 70,
        lightness: 70
      },
      init: (canvas, config) => {
        const stars = [];
        for (let i = 0; i < config.starCount; i++) {
          stars.push({
            x: Math.random() * canvas.width - canvas.width / 2,
            y: Math.random() * canvas.height - canvas.height / 2,
            z: Math.random() * canvas.width,
            baseHue: config.baseHue + Math.random() * config.hueVariation
          });
        }
        return { stars };
      },
      animate: (ctx, canvas, config, state) => {
        ctx.fillStyle = config.trailColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        state.stars.forEach(star => {
          star.z -= config.baseSpeed * config.speed;
          if (star.z <= 0) {
            star.z = canvas.width;
            star.x = Math.random() * canvas.width - canvas.width / 2;
            star.y = Math.random() * canvas.height - canvas.height / 2;
          }

          const sx = (star.x / star.z) * canvas.width + canvas.width / 2;
          const sy = (star.y / star.z) * canvas.height + canvas.height / 2;
          const starSize = (1 - star.z / canvas.width) * config.maxStarSize * config.size;

          ctx.fillStyle = `hsl(${(star.baseHue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
          ctx.beginPath();
          ctx.arc(sx, sy, starSize, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    },
    {
      id: 6,
      name: '🧲 Magnetic Particles',
      config: {
        particleCount: 100,
        magnetForce: 0.1,
        maxForce: 5,
        minDistance: 200,
        friction: 0.95,
        particleSize: 4,
        baseHue: 0,
        trailColor: 'rgba(0, 0, 0, 0.1)',
        saturation: 70,
        lightness: 60
      },
      init: (canvas, config) => {
        const particles = [];
        const mousePos = { x: canvas.width / 2, y: canvas.height / 2 };
        
        for (let i = 0; i < config.particleCount; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: 0,
            vy: 0,
            baseHue: config.baseHue + Math.random() * 360
          });
        }
        
        const handleMouseMove = (e) => {
          const rect = canvas.getBoundingClientRect();
          mousePos.x = e.clientX - rect.left;
          mousePos.y = e.clientY - rect.top;
        };
        
        canvas.addEventListener('mousemove', handleMouseMove);
        
        return { particles, mousePos, cleanup: () => canvas.removeEventListener('mousemove', handleMouseMove) };
      },
      animate: (ctx, canvas, config, state) => {
        ctx.fillStyle = config.trailColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        state.particles.forEach(p => {
          const dx = state.mousePos.x - p.x;
          const dy = state.mousePos.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const force = Math.min(config.minDistance / dist, config.maxForce) * config.speed;

          p.vx += (dx / dist) * force * config.magnetForce;
          p.vy += (dy / dist) * force * config.magnetForce;
          p.vx *= config.friction;
          p.vy *= config.friction;
          p.x += p.vx;
          p.y += p.vy;

          ctx.fillStyle = `hsl(${(p.baseHue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, config.particleSize * config.size, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    },
    {
      id: 7,
      name: '🎭 Ripple Effect',
      config: {
        rippleSpeed: 3,
        maxRadius: 200,
        lineWidth: 3,
        baseHue: 0,
        trailColor: 'rgba(0, 0, 0, 0.05)',
        saturation: 70,
        lightness: 60
      },
      init: (canvas, config) => {
        const ripples = [];
        
        const handleClick = (e) => {
          const rect = canvas.getBoundingClientRect();
          ripples.push({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            radius: 0,
            maxRadius: config.maxRadius * config.size,
            baseHue: config.baseHue + Math.random() * 360
          });
        };
        
        canvas.addEventListener('click', handleClick);
        
        return { ripples, cleanup: () => canvas.removeEventListener('click', handleClick) };
      },
      animate: (ctx, canvas, config, state) => {
        ctx.fillStyle = config.trailColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        state.ripples.forEach((ripple, index) => {
          ripple.radius += config.rippleSpeed * config.speed;
          const alpha = 1 - ripple.radius / ripple.maxRadius;

          ctx.strokeStyle = `hsl(${(ripple.baseHue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
          ctx.globalAlpha = alpha;
          ctx.lineWidth = config.lineWidth * config.size;
          ctx.beginPath();
          ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 1;

          if (ripple.radius >= ripple.maxRadius) {
            state.ripples.splice(index, 1);
          }
        });
      }
    },
    {
      id: 8,
      name: '🌈 Color Waves',
      config: {
        spacing: 5,
        wave1Frequency: 0.01,
        wave1Amplitude: 50,
        wave2Frequency: 0.02,
        wave2Amplitude: 30,
        wave2SpeedMultiplier: 1.5,
        baseSpeed: 2,
        baseHue: 0,
        trailColor: 'rgba(0, 0, 0, 0.1)',
        saturation: 70,
        lightness: 60
      },
      init: (canvas, config) => {
        return { time: 0 };
      },
      animate: (ctx, canvas, config, state) => {
        ctx.fillStyle = config.trailColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let x = 0; x < canvas.width; x += config.spacing) {
          const wave1 = Math.sin((x + state.time) * config.wave1Frequency) * config.wave1Amplitude * config.size;
          const wave2 = Math.sin((x + state.time * config.wave2SpeedMultiplier) * config.wave2Frequency) * config.wave2Amplitude * config.size;
          const y = canvas.height / 2 + wave1 + wave2;
          
          ctx.fillStyle = `hsl(${(config.baseHue + x / 2 + state.time + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
          ctx.fillRect(x, y, config.spacing, config.spacing);
        }

        state.time += config.baseSpeed * config.speed;
      }
    },
    {
      id: 9,
      name: '🌀 Vortex Flow',
      config: {
        particleCount: 200,
        maxRadius: 300,
        minRadius: 10,
        baseSpeed: 0.02,
        speedVariation: 0.02,
        pullSpeed: 0.5,
        particleSize: 3,
        baseHue: 0,
        trailColor: 'rgba(0, 0, 0, 0.1)',
        saturation: 70,
        lightness: 60
      },
      init: (canvas, config) => {
        const particles = [];
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        for (let i = 0; i < config.particleCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const radius = Math.random() * config.maxRadius * config.size;
          particles.push({
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius,
            angle,
            radius,
            speed: (config.baseSpeed + Math.random() * config.speedVariation) * config.speed,
            baseHue: config.baseHue + Math.random() * 360
          });
        }
        return { particles, centerX, centerY };
      },
      animate: (ctx, canvas, config, state) => {
        ctx.fillStyle = config.trailColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        state.particles.forEach(p => {
          p.angle += p.speed;
          p.radius -= config.pullSpeed * config.speed;

          if (p.radius < config.minRadius * config.size) {
            p.radius = config.maxRadius * config.size;
            p.angle = Math.random() * Math.PI * 2;
          }

          p.x = state.centerX + Math.cos(p.angle) * p.radius;
          p.y = state.centerY + Math.sin(p.angle) * p.radius;

          ctx.fillStyle = `hsl(${(p.baseHue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
          ctx.globalAlpha = p.radius / (config.maxRadius * config.size);
          ctx.beginPath();
          ctx.arc(p.x, p.y, config.particleSize * config.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        });
      }
    },
    {
      id: 10,
      name: '✨ Sparkle Trail',
      config: {
        sparklesPerFrame: 3,
        autoSparkles: 2,
        autoRadius: 150,
        autoRadiusY: 100,
        autoSpeed: 0.05,
        particleLife: 60,
        baseSize: 2,
        sizeVariation: 4,
        baseVelocity: 2,
        glowAmount: 10,
        baseHue: 0,
        trailColor: 'rgba(0, 0, 0, 0.1)',
        saturation: 70,
        lightness: 60
      },
      init: (canvas, config) => {
        const sparkles = [];
        const mousePos = { x: canvas.width / 2, y: canvas.height / 2 };
        const autoPos = { x: canvas.width / 2, y: canvas.height / 2, angle: 0 };

        const handleMouseMove = (e) => {
          const rect = canvas.getBoundingClientRect();
          mousePos.x = e.clientX - rect.left;
          mousePos.y = e.clientY - rect.top;
          
          for (let i = 0; i < config.sparklesPerFrame; i++) {
            sparkles.push({
              x: mousePos.x + (Math.random() - 0.5) * 10,
              y: mousePos.y + (Math.random() - 0.5) * 10,
              vx: (Math.random() - 0.5) * config.baseVelocity,
              vy: (Math.random() - 0.5) * config.baseVelocity,
              life: config.particleLife,
              size: (config.baseSize + Math.random() * config.sizeVariation) * config.size,
              baseHue: config.baseHue + Math.random() * 360
            });
          }
        };

        canvas.addEventListener('mousemove', handleMouseMove);

        return { 
          sparkles, 
          mousePos, 
          autoPos, 
          cleanup: () => canvas.removeEventListener('mousemove', handleMouseMove) 
        };
      },
      animate: (ctx, canvas, config, state) => {
        ctx.fillStyle = config.trailColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        state.autoPos.angle += config.autoSpeed * config.speed;
        state.autoPos.x = canvas.width / 2 + Math.cos(state.autoPos.angle) * config.autoRadius * config.size;
        state.autoPos.y = canvas.height / 2 + Math.sin(state.autoPos.angle) * config.autoRadiusY * config.size;

        for (let i = 0; i < config.autoSparkles; i++) {
          state.sparkles.push({
            x: state.autoPos.x + (Math.random() - 0.5) * 10,
            y: state.autoPos.y + (Math.random() - 0.5) * 10,
            vx: (Math.random() - 0.5) * config.baseVelocity,
            vy: (Math.random() - 0.5) * config.baseVelocity,
            life: config.particleLife,
            size: (config.baseSize + Math.random() * config.sizeVariation) * config.size,
            baseHue: (state.autoPos.angle * 50) % 360
          });
        }

        state.sparkles.forEach((sparkle, index) => {
          sparkle.x += sparkle.vx;
          sparkle.y += sparkle.vy;
          sparkle.life -= config.speed;

          const alpha = sparkle.life / config.particleLife;
          const color = `hsl(${(sparkle.baseHue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
          ctx.fillStyle = color;
          ctx.globalAlpha = alpha;
          ctx.shadowBlur = config.glowAmount;
          ctx.shadowColor = color;
          ctx.beginPath();
          ctx.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;

          if (sparkle.life <= 0) {
            state.sparkles.splice(index, 1);
          }
        });
      }
    }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const currentAnim = animationData[selectedAnimation];
    const config = { ...currentAnim.config, speed, size, hueShift };
    
    // Initialize animation state
    const state = currentAnim.init(canvas, config);

    const animate = () => {
      currentAnim.animate(ctx, canvas, config, state);
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (state.cleanup) {
        state.cleanup();
      }
    };
  }, [selectedAnimation, speed, size, hueShift]);

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      {/* Sidebar */}
      <div style={{
        width: '280px',
        background: 'rgba(20, 20, 40, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '20px',
        overflowY: 'auto',
        boxShadow: '4px 0 20px rgba(0, 0, 0, 0.5)',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#fff',
          marginBottom: '30px',
          textAlign: 'center',
          background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          ✨ Satisfying Animations
        </h1>
      
        {/* Controls */}
        <div style={{
          marginBottom: '30px',
          padding: '15px',
          background: 'rgba(40, 40, 80, 0.4)',
          borderRadius: '12px',
          border: '1px solid rgba(100, 100, 255, 0.2)'
        }}>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              color: '#fff',
              fontSize: '13px',
              marginBottom: '8px',
              fontWeight: '500'
            }}>
              Size: {size.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.3"
              max="2"
              step="0.1"
              value={size}
              onChange={(e) => setSize(parseFloat(e.target.value))}
              style={{
                width: '100%',
                accentColor: '#667eea'
              }}
            />
          </div>
            {/* Speed Control */}
  <div style={{ marginBottom: '15px' }}>
    <label style={{
      display: 'block',
      color: '#fff',
      fontSize: '13px',
      marginBottom: '8px',
      fontWeight: '500'
    }}>
      Speed: {speed.toFixed(1)}x
    </label>
    <input
      type="range"
      min="0.2"
      max="3"
      step="0.1"
      value={speed}
      onChange={(e) => setSpeed(parseFloat(e.target.value))}
      style={{
        width: '100%',
        accentColor: '#667eea'
      }}
    />
  </div>
          <div>
            <label style={{
              display: 'block',
              color: '#fff',
              fontSize: '13px',
              marginBottom: '8px',
              fontWeight: '500'
            }}>
              Color Shift: {hueShift}°
            </label>
            <input
              type="range"
              min="0"
              max="360"
              step="10"
              value={hueShift}
              onChange={(e) => setHueShift(parseInt(e.target.value))}
              style={{
                width: '100%',
                accentColor: '#667eea'
              }}
            />
          </div>
        </div>

        {/* Animation List */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {animationData.map((anim) => (
            <button
              key={anim.id}
              onClick={() => setSelectedAnimation(anim.id)}
              style={{
                padding: '14px 18px',
                background: selectedAnimation === anim.id
                  ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%)'
                  : 'rgba(40, 40, 80, 0.6)',
                border: selectedAnimation === anim.id
                  ? '2px solid rgba(102, 126, 234, 0.8)'
                  : '2px solid rgba(100, 100, 255, 0.3)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '15px',
                fontWeight: '500',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: selectedAnimation === anim.id ? 'translateX(8px) scale(1.02)' : 'none',
                boxShadow: selectedAnimation === anim.id
                  ? '0 8px 30px rgba(102, 126, 234, 0.6)'
                  : 'none'
              }}
              onMouseEnter={(e) => {
                if (selectedAnimation !== anim.id) {
                  e.currentTarget.style.background = 'rgba(60, 60, 120, 0.8)';
                  e.currentTarget.style.borderColor = 'rgba(100, 150, 255, 0.6)';
                  e.currentTarget.style.transform = 'translateX(8px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(100, 100, 255, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedAnimation !== anim.id) {
                  e.currentTarget.style.background = 'rgba(40, 40, 80, 0.6)';
                  e.currentTarget.style.borderColor = 'rgba(100, 100, 255, 0.3)';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {anim.name}
              {selectedAnimation === anim.id && (
                <span style={{
                  float: 'right',
                  fontSize: '12px'
                }}>▶</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas Container */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative'
      }}>
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '16px',
            boxShadow: '0 10px 50px rgba(0, 0, 0, 0.5)',
            background: 'rgba(0, 0, 0, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        />
      </div>
    </div>
  );
};

export default AnimationApp;
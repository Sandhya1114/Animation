import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const AnimationApp = () => {
  const [selectedAnimation, setSelectedAnimation] = useState(0);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const animations = [
    { id: 0, name: '🌊 Wave Pool', type: 'wavePool' },
    { id: 1, name: '🎯 Orbit Dance', type: 'orbitDance' },
    { id: 2, name: '✨ Particle Rain', type: 'particleRain' },
    { id: 3, name: '🌀 Spiral Galaxy', type: 'spiralGalaxy' },
    { id: 4, name: '💫 Bouncing Balls', type: 'bouncingBalls' },
    { id: 5, name: '🔮 Gravity Wells', type: 'gravityWells' },
    { id: 6, name: '🌈 Color Waves', type: 'colorWaves' },
    { id: 7, name: '⚡ Lightning Orbs', type: 'lightningOrbs' },
    { id: 8, name: '🎪 Pendulum Harmony', type: 'pendulumHarmony' },
    { id: 9, name: '🌸 Flower Bloom', type: 'flowerBloom' },
    { id: 10, name: '🎨 Paint Splash', type: 'paintSplash' },
    { id: 11, name: '🔷 Hexagon Grid', type: 'hexagonGrid' },
    { id: 12, name: '🌟 Star Field', type: 'starField' },
    { id: 13, name: '🧲 Magnetic Particles', type: 'magneticParticles' },
    { id: 14, name: '🎭 Ripple Effect', type: 'rippleEffect' },
    { id: 15, name: '🎪 Carousel Spin', type: 'carouselSpin' },
    { id: 16, name: '🌊 Fluid Simulation', type: 'fluidSimulation' },
    { id: 17, name: '🎯 Target Practice', type: 'targetPractice' },
    { id: 18, name: '🌀 Vortex Flow', type: 'vortexFlow' },
    { id: 19, name: '✨ Sparkle Trail', type: 'sparkleTrail' }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const animate = animations[selectedAnimation].type;
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const animationFunctions = {
      wavePool: () => createWavePool(ctx, canvas),
      orbitDance: () => createOrbitDance(ctx, canvas),
      particleRain: () => createParticleRain(ctx, canvas),
      spiralGalaxy: () => createSpiralGalaxy(ctx, canvas),
      bouncingBalls: () => createBouncingBalls(ctx, canvas),
      gravityWells: () => createGravityWells(ctx, canvas),
      colorWaves: () => createColorWaves(ctx, canvas),
      lightningOrbs: () => createLightningOrbs(ctx, canvas),
      pendulumHarmony: () => createPendulumHarmony(ctx, canvas),
      flowerBloom: () => createFlowerBloom(ctx, canvas),
      paintSplash: () => createPaintSplash(ctx, canvas),
      hexagonGrid: () => createHexagonGrid(ctx, canvas),
      starField: () => createStarField(ctx, canvas),
      magneticParticles: () => createMagneticParticles(ctx, canvas),
      rippleEffect: () => createRippleEffect(ctx, canvas),
      carouselSpin: () => createCarouselSpin(ctx, canvas),
      fluidSimulation: () => createFluidSimulation(ctx, canvas),
      targetPractice: () => createTargetPractice(ctx, canvas),
      vortexFlow: () => createVortexFlow(ctx, canvas),
      sparkleTrail: () => createSparkleTrail(ctx, canvas)
    };

    animationFunctions[animate]();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [selectedAnimation]);

  // Animation 1: Wave Pool
  const createWavePool = (ctx, canvas) => {
    const particles = [];
    const cols = 50;
    const rows = 30;
    
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        particles.push({
          x: (canvas.width / cols) * i,
          y: (canvas.height / rows) * j,
          baseY: (canvas.height / rows) * j,
          offset: (i + j) * 0.1
        });
      }
    }

    let time = 0;
    const draw = () => {
      ctx.fillStyle = 'rgba(10, 10, 30, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        const wave = Math.sin(time + p.offset) * 20;
        ctx.fillStyle = `hsl(${200 + wave * 2}, 70%, 60%)`;
        ctx.beginPath();
        ctx.arc(p.x, p.baseY + wave, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      time += 0.03;
      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  // Animation 2: Orbit Dance
  const createOrbitDance = (ctx, canvas) => {
    const orbiters = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    for (let i = 0; i < 8; i++) {
      orbiters.push({
        angle: (Math.PI * 2 / 8) * i,
        radius: 100 + i * 20,
        speed: 0.02 + i * 0.005,
        color: `hsl(${i * 45}, 80%, 60%)`
      });
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      orbiters.forEach(orb => {
        const x = centerX + Math.cos(orb.angle) * orb.radius;
        const y = centerY + Math.sin(orb.angle) * orb.radius;
        
        ctx.fillStyle = orb.color;
        ctx.shadowBlur = 20;
        ctx.shadowColor = orb.color;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        orb.angle += orb.speed;
      });

      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  // Animation 3: Particle Rain
  const createParticleRain = (ctx, canvas) => {
    const drops = [];
    
    for (let i = 0; i < 100; i++) {
      drops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 2 + Math.random() * 3,
        length: 10 + Math.random() * 20,
        color: `hsl(${180 + Math.random() * 60}, 70%, 60%)`
      });
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 20, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drops.forEach(drop => {
        ctx.strokeStyle = drop.color;
        ctx.lineWidth = 2;
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

      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  // Animation 4: Spiral Galaxy
  const createSpiralGalaxy = (ctx, canvas) => {
    const particles = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let i = 0; i < 200; i++) {
      const angle = (i / 200) * Math.PI * 8;
      const radius = (i / 200) * 200;
      particles.push({
        angle,
        radius,
        speed: 0.01 + (1 - i / 200) * 0.02,
        size: 2 + Math.random() * 3,
        color: `hsl(${260 + i / 2}, 80%, 60%)`
      });
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 10, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        const x = centerX + Math.cos(p.angle) * p.radius;
        const y = centerY + Math.sin(p.angle) * p.radius;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();

        p.angle += p.speed;
      });

      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  // Animation 5: Bouncing Balls
  const createBouncingBalls = (ctx, canvas) => {
    const balls = [];
    
    for (let i = 0; i < 30; i++) {
      balls.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        radius: 10 + Math.random() * 20,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        gravity: 0.2
      });
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(20, 20, 40, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      balls.forEach(ball => {
        ball.vy += ball.gravity;
        ball.x += ball.vx;
        ball.y += ball.vy;

        if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
          ball.vx *= -0.9;
          ball.x = ball.x + ball.radius > canvas.width ? canvas.width - ball.radius : ball.radius;
        }
        if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
          ball.vy *= -0.9;
          ball.y = ball.y + ball.radius > canvas.height ? canvas.height - ball.radius : ball.radius;
        }

        ctx.fillStyle = ball.color;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  // Animation 6: Gravity Wells
  const createGravityWells = (ctx, canvas) => {
    const particles = [];
    const wells = [
      { x: canvas.width * 0.3, y: canvas.height * 0.5 },
      { x: canvas.width * 0.7, y: canvas.height * 0.5 }
    ];

    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: 0,
        vy: 0,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`
      });
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        wells.forEach(well => {
          const dx = well.x - p.x;
          const dy = well.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const force = 0.5;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        });

        p.vx *= 0.99;
        p.vy *= 0.99;
        p.x += p.vx;
        p.y += p.vy;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      wells.forEach(well => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(well.x, well.y, 20, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  // Animation 7: Color Waves
  const createColorWaves = (ctx, canvas) => {
    let time = 0;
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let x = 0; x < canvas.width; x += 5) {
        const wave1 = Math.sin((x + time) * 0.01) * 50;
        const wave2 = Math.sin((x + time * 1.5) * 0.02) * 30;
        const y = canvas.height / 2 + wave1 + wave2;
        
        ctx.fillStyle = `hsl(${x / 2 + time}, 70%, 60%)`;
        ctx.fillRect(x, y, 5, 5);
      }

      time += 2;
      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  // Animation 8: Lightning Orbs
  const createLightningOrbs = (ctx, canvas) => {
    const orbs = [];
    for (let i = 0; i < 5; i++) {
      orbs.push({
        x: (canvas.width / 6) * (i + 1),
        y: canvas.height / 2,
        radius: 30,
        connections: []
      });
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 20, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      orbs.forEach((orb, i) => {
        orbs.forEach((other, j) => {
          if (i < j && Math.random() < 0.1) {
            ctx.strokeStyle = `rgba(100, 200, 255, ${Math.random()})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(orb.x, orb.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });

        ctx.fillStyle = `rgba(100, 200, 255, 0.6)`;
        ctx.shadowBlur = 30;
        ctx.shadowColor = 'cyan';
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  // Animation 9: Pendulum Harmony
  const createPendulumHarmony = (ctx, canvas) => {
    const pendulums = [];
    for (let i = 0; i < 10; i++) {
      pendulums.push({
        x: canvas.width / 2,
        y: 50,
        length: 100 + i * 20,
        angle: Math.PI / 4,
        velocity: 0,
        color: `hsl(${i * 36}, 70%, 60%)`
      });
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      pendulums.forEach(p => {
        const gravity = 0.5;
        const damping = 0.995;
        const acceleration = (-gravity / p.length) * Math.sin(p.angle);
        p.velocity += acceleration;
        p.velocity *= damping;
        p.angle += p.velocity;

        const bobX = p.x + p.length * Math.sin(p.angle);
        const bobY = p.y + p.length * Math.cos(p.angle);

        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(bobX, bobY);
        ctx.stroke();

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(bobX, bobY, 10, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  // Animation 10: Flower Bloom
  const createFlowerBloom = (ctx, canvas) => {
    let time = 0;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const petals = 12;
      for (let i = 0; i < petals; i++) {
        const angle = (Math.PI * 2 / petals) * i + time * 0.01;
        const radius = 100 + Math.sin(time * 0.02 + i) * 50;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        ctx.fillStyle = `hsl(${i * 30 + time}, 70%, 60%)`;
        ctx.beginPath();
        ctx.arc(x, y, 20 + Math.sin(time * 0.05) * 10, 0, Math.PI * 2);
        ctx.fill();
      }

      time += 1;
      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  // Animation 11: Paint Splash
  const createPaintSplash = (ctx, canvas) => {
    const splashes = [];

    const createSplash = () => {
      const splash = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        particles: []
      };

      for (let i = 0; i < 50; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 5;
        splash.particles.push({
          x: splash.x,
          y: splash.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: `hsl(${Math.random() * 360}, 70%, 60%)`,
          life: 100
        });
      }

      splashes.push(splash);
    };

    setInterval(createSplash, 1000);

    const draw = () => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      splashes.forEach((splash, si) => {
        splash.particles = splash.particles.filter(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.2;
          p.life -= 1;

          if (p.life > 0) {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life / 100;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
            return true;
          }
          return false;
        });

        if (splash.particles.length === 0) {
          splashes.splice(si, 1);
        }
      });

      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  // Animation 12: Hexagon Grid
  const createHexagonGrid = (ctx, canvas) => {
    const hexagons = [];
    const size = 30;
    const cols = Math.ceil(canvas.width / (size * 1.5));
    const rows = Math.ceil(canvas.height / (size * Math.sqrt(3)));

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * size * 1.5;
        const y = row * size * Math.sqrt(3) + (col % 2) * size * Math.sqrt(3) / 2;
        hexagons.push({ x, y, phase: Math.random() * Math.PI * 2 });
      }
    }

    let time = 0;
    const draw = () => {
      ctx.fillStyle = 'rgb(10, 10, 30)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      hexagons.forEach(hex => {
        const brightness = (Math.sin(time + hex.phase) + 1) / 2;
        ctx.fillStyle = `hsl(${200 + brightness * 60}, 70%, ${30 + brightness * 40}%)`;
        
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          const hx = hex.x + size * Math.cos(angle);
          const hy = hex.y + size * Math.sin(angle);
          if (i === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.fill();
      });

      time += 0.05;
      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  // Animation 13: Star Field
  const createStarField = (ctx, canvas) => {
    const stars = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width - canvas.width / 2,
        y: Math.random() * canvas.height - canvas.height / 2,
        z: Math.random() * canvas.width,
        color: `hsl(${Math.random() * 60 + 200}, 70%, 70%)`
      });
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        star.z -= 5;
        if (star.z <= 0) {
          star.z = canvas.width;
          star.x = Math.random() * canvas.width - canvas.width / 2;
          star.y = Math.random() * canvas.height - canvas.height / 2;
        }

        const sx = (star.x / star.z) * canvas.width + canvas.width / 2;
        const sy = (star.y / star.z) * canvas.height + canvas.height / 2;
        const size = (1 - star.z / canvas.width) * 5;

        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  // Animation 14: Magnetic Particles
  const createMagneticParticles = (ctx, canvas) => {
    const particles = [];
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: 0,
        vy: 0,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`
      });
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const force = Math.min(200 / dist, 5);

        p.vx += (dx / dist) * force * 0.1;
        p.vy += (dy / dist) * force * 0.1;
        p.vx *= 0.95;
        p.vy *= 0.95;
        p.x += p.vx;
        p.y += p.vy;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  // Animation 15: Ripple Effect
  const createRippleEffect = (ctx, canvas) => {
    const ripples = [];

    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      ripples.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        radius: 0,
        maxRadius: 200,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`
      });
    });

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ripples.forEach((ripple, index) => {
        ripple.radius += 3;
        const alpha = 1 - ripple.radius / ripple.maxRadius;

        ctx.strokeStyle = ripple.color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;

        if (ripple.radius >= ripple.maxRadius) {
          ripples.splice(index, 1);
        }
      });

      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  // Animation 16: Carousel Spin
  const createCarouselSpin = (ctx, canvas) => {
    const items = [];
    const numItems = 12;
    let rotation = 0;

    for (let i = 0; i < numItems; i++) {
      items.push({
        angle: (Math.PI * 2 / numItems) * i,
        color: `hsl(${(360 / numItems) * i}, 70%, 60%)`
      });
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 150;

      items.forEach(item => {
        const angle = item.angle + rotation;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius * 0.5;
        const z = Math.sin(angle);
        const size = 20 + z * 10;

        ctx.fillStyle = item.color;
        ctx.globalAlpha = (z + 1) / 2;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      rotation += 0.02;
      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  // Animation 17: Fluid Simulation
  const createFluidSimulation = (ctx, canvas) => {
    const particles = [];
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        color: `hsl(${180 + Math.random() * 60}, 70%, 60%)`
      });
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        particles.forEach((other, j) => {
          if (i !== j) {
            const dx = other.x - p.x;
            const dy = other.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 50 && dist > 0) {
              const force = (50 - dist) / 50;
              p.vx -= (dx / dist) * force * 0.1;
              p.vy -= (dy / dist) * force * 0.1;
            }
          }
        });

        p.vx *= 0.99;
        p.vy *= 0.99;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  // Animation 18: Target Practice
  const createTargetPractice = (ctx, canvas) => {
    const targets = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let i = 0; i < 8; i++) {
      targets.push({
        radius: 30 + i * 25,
        color: i % 2 === 0 ? `hsl(${i * 20}, 70%, 50%)` : `hsl(${i * 20 + 180}, 70%, 50%)`
      });
    }

    let rotation = 0;
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);

      targets.reverse().forEach(target => {
        ctx.fillStyle = target.color;
        ctx.beginPath();
        ctx.arc(0, 0, target.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();

      rotation += 0.02;
      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  // Animation 19: Vortex Flow
  const createVortexFlow = (ctx, canvas) => {
    const particles = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let i = 0; i < 200; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 300;
      particles.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        angle,
        radius,
        speed: 0.02 + Math.random() * 0.02,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`
      });
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.angle += p.speed;
        p.radius -= 0.5;

        if (p.radius < 10) {
          p.radius = 300;
          p.angle = Math.random() * Math.PI * 2;
        }

        p.x = centerX + Math.cos(p.angle) * p.radius;
        p.y = centerY + Math.sin(p.angle) * p.radius;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.radius / 300;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  // Animation 20: Sparkle Trail
  const createSparkleTrail = (ctx, canvas) => {
    const sparkles = [];
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    let autoX = canvas.width / 2;
    let autoY = canvas.height / 2;
    let autoAngle = 0;

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      
      for (let i = 0; i < 3; i++) {
        sparkles.push({
          x: mouseX + (Math.random() - 0.5) * 10,
          y: mouseY + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: 60,
          size: 2 + Math.random() * 4,
          color: `hsl(${Math.random() * 360}, 70%, 60%)`
        });
      }
    });

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      autoAngle += 0.05;
      autoX = canvas.width / 2 + Math.cos(autoAngle) * 150;
      autoY = canvas.height / 2 + Math.sin(autoAngle) * 100;

      for (let i = 0; i < 2; i++) {
        sparkles.push({
          x: autoX + (Math.random() - 0.5) * 10,
          y: autoY + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: 60,
          size: 2 + Math.random() * 4,
          color: `hsl(${(autoAngle * 50) % 360}, 70%, 60%)`
        });
      }

      sparkles.forEach((sparkle, index) => {
        sparkle.x += sparkle.vx;
        sparkle.y += sparkle.vy;
        sparkle.life -= 1;

        const alpha = sparkle.life / 60;
        ctx.fillStyle = sparkle.color;
        ctx.globalAlpha = alpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = sparkle.color;
        ctx.beginPath();
        ctx.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;

        if (sparkle.life <= 0) {
          sparkles.splice(index, 1);
        }
      });

      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <h1 className="title">✨ Satisfying Animations</h1>
        <div className="animation-list">
          {animations.map((anim) => (
            <button
              key={anim.id}
              className={`animation-button ${selectedAnimation === anim.id ? 'active' : ''}`}
              onClick={() => setSelectedAnimation(anim.id)}
            >
              {anim.name}
            </button>
          ))}
        </div>
      </div>
      <div className="canvas-container">
        <canvas ref={canvasRef} className="animation-canvas" />
      </div>
    </div>
  );
};

export default AnimationApp;
import React, { useState, useEffect, useRef } from 'react';

const AnimationApp = () => {
  const [selectedAnimation, setSelectedAnimation] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [size, setSize] = useState(1);
  const [hueShift, setHueShift] = useState(0);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Data-driven animation configurations
  const animationData = [
    {
      id: 0,
      name: '🌊 Wave Pool',
      type: 'wavePool',
      config: {
        cols: 50,
        rows: 30,
        baseSpeed: 0.03,
        baseAmplitude: 20,
        baseParticleSize: 3,
        baseHue: 200,
        offsetMultiplier: 0.1
      }
    },
    {
      id: 1,
      name: '🎯 Orbit Dance',
      type: 'orbitDance',
      config: {
        count: 8,
        baseRadius: 100,
        radiusIncrement: 20,
        baseSpeed: 0.02,
        speedIncrement: 0.005,
        baseSize: 8,
        baseHue: 0,
        hueIncrement: 45
      }
    },
    {
      id: 2,
      name: '✨ Particle Rain',
      type: 'particleRain',
      config: {
        count: 100,
        baseSpeed: 2,
        speedVariation: 3,
        baseLength: 10,
        lengthVariation: 20,
        baseHue: 180,
        hueVariation: 60,
        lineWidth: 2
      }
    },
    {
      id: 3,
      name: '🌀 Spiral Galaxy',
      type: 'spiralGalaxy',
      config: {
        particleCount: 200,
        spiralTurns: 8,
        maxRadius: 200,
        baseSpeed: 0.01,
        speedVariation: 0.02,
        baseSize: 2,
        sizeVariation: 3,
        baseHue: 260
      }
    },
    {
      id: 4,
      name: '💫 Bouncing Balls',
      type: 'bouncingBalls',
      config: {
        count: 30,
        baseRadius: 10,
        radiusVariation: 20,
        baseVelocity: 4,
        gravity: 0.2,
        damping: 0.9,
        baseHue: 0
      }
    },
    {
      id: 5,
      name: '🔮 Gravity Wells',
      type: 'gravityWells',
      config: {
        particleCount: 150,
        wellCount: 2,
        wellPositions: [0.3, 0.7],
        force: 0.5,
        friction: 0.99,
        particleSize: 3,
        wellSize: 20,
        baseHue: 0
      }
    },
    {
      id: 6,
      name: '🌈 Color Waves',
      type: 'colorWaves',
      config: {
        spacing: 5,
        wave1Frequency: 0.01,
        wave1Amplitude: 50,
        wave2Frequency: 0.02,
        wave2Amplitude: 30,
        wave2SpeedMultiplier: 1.5,
        baseSpeed: 2,
        baseHue: 0
      }
    },
    {
      id: 7,
      name: '⚡ Lightning Orbs',
      type: 'lightningOrbs',
      config: {
        orbCount: 5,
        orbRadius: 30,
        connectionChance: 0.1,
        lineWidth: 2,
        baseHue: 180,
        glowAmount: 30
      }
    },
    {
      id: 8,
      name: '🎪 Pendulum Harmony',
      type: 'pendulumHarmony',
      config: {
        count: 10,
        baseLength: 100,
        lengthIncrement: 20,
        initialAngle: Math.PI / 4,
        gravity: 0.5,
        damping: 0.995,
        bobSize: 10,
        lineWidth: 2,
        baseHue: 0,
        hueIncrement: 36
      }
    },
    {
      id: 9,
      name: '🌸 Flower Bloom',
      type: 'flowerBloom',
      config: {
        petalCount: 12,
        baseRadius: 100,
        radiusVariation: 50,
        baseSize: 20,
        sizeVariation: 10,
        rotationSpeed: 0.01,
        pulseSpeed: 0.02,
        breatheSpeed: 0.05,
        baseHue: 0,
        hueIncrement: 30
      }
    },
    {
      id: 10,
      name: '🎨 Paint Splash',
      type: 'paintSplash',
      config: {
        particlesPerSplash: 50,
        splashInterval: 1000,
        baseSpeed: 2,
        speedVariation: 5,
        gravity: 0.2,
        particleSize: 3,
        particleLife: 100,
        baseHue: 0
      }
    },
    {
      id: 11,
      name: '🔷 Hexagon Grid',
      type: 'hexagonGrid',
      config: {
        hexSize: 30,
        waveSpeed: 0.05,
        baseHue: 200,
        hueVariation: 60,
        brightnessMin: 30,
        brightnessMax: 70
      }
    },
    {
      id: 12,
      name: '🌟 Star Field',
      type: 'starField',
      config: {
        starCount: 200,
        baseSpeed: 5,
        maxStarSize: 5,
        baseHue: 200,
        hueVariation: 60
      }
    },
    {
      id: 13,
      name: '🧲 Magnetic Particles',
      type: 'magneticParticles',
      config: {
        particleCount: 100,
        magnetForce: 0.1,
        maxForce: 5,
        minDistance: 200,
        friction: 0.95,
        particleSize: 4,
        baseHue: 0
      }
    },
    {
      id: 14,
      name: '🎭 Ripple Effect',
      type: 'rippleEffect',
      config: {
        rippleSpeed: 3,
        maxRadius: 200,
        lineWidth: 3,
        baseHue: 0
      }
    },
    {
      id: 15,
      name: '🎪 Carousel Spin',
      type: 'carouselSpin',
      config: {
        itemCount: 12,
        radius: 150,
        rotationSpeed: 0.02,
        baseSize: 20,
        sizeVariation: 10,
        perspective: 0.5,
        baseHue: 0
      }
    },
    {
      id: 16,
      name: '🌊 Fluid Simulation',
      type: 'fluidSimulation',
      config: {
        particleCount: 150,
        baseVelocity: 2,
        interactionDistance: 50,
        repulsionForce: 0.1,
        friction: 0.99,
        particleSize: 4,
        baseHue: 180,
        hueVariation: 60
      }
    },
    {
      id: 17,
      name: '🎯 Target Practice',
      type: 'targetPractice',
      config: {
        ringCount: 8,
        baseRadius: 30,
        radiusIncrement: 25,
        rotationSpeed: 0.02,
        baseHue: 0,
        hueIncrement: 20
      }
    },
    {
      id: 18,
      name: '🌀 Vortex Flow',
      type: 'vortexFlow',
      config: {
        particleCount: 200,
        maxRadius: 300,
        minRadius: 10,
        baseSpeed: 0.02,
        speedVariation: 0.02,
        pullSpeed: 0.5,
        particleSize: 3,
        baseHue: 0
      }
    },
    {
      id: 19,
      name: '✨ Sparkle Trail',
      type: 'sparkleTrail',
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
        baseHue: 0
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

    const animationFunctions = {
      wavePool: () => createWavePool(ctx, canvas, config),
      orbitDance: () => createOrbitDance(ctx, canvas, config),
      particleRain: () => createParticleRain(ctx, canvas, config),
      spiralGalaxy: () => createSpiralGalaxy(ctx, canvas, config),
      bouncingBalls: () => createBouncingBalls(ctx, canvas, config),
      gravityWells: () => createGravityWells(ctx, canvas, config),
      colorWaves: () => createColorWaves(ctx, canvas, config),
      lightningOrbs: () => createLightningOrbs(ctx, canvas, config),
      pendulumHarmony: () => createPendulumHarmony(ctx, canvas, config),
      flowerBloom: () => createFlowerBloom(ctx, canvas, config),
      paintSplash: () => createPaintSplash(ctx, canvas, config),
      hexagonGrid: () => createHexagonGrid(ctx, canvas, config),
      starField: () => createStarField(ctx, canvas, config),
      magneticParticles: () => createMagneticParticles(ctx, canvas, config),
      rippleEffect: () => createRippleEffect(ctx, canvas, config),
      carouselSpin: () => createCarouselSpin(ctx, canvas, config),
      fluidSimulation: () => createFluidSimulation(ctx, canvas, config),
      targetPractice: () => createTargetPractice(ctx, canvas, config),
      vortexFlow: () => createVortexFlow(ctx, canvas, config),
      sparkleTrail: () => createSparkleTrail(ctx, canvas, config)
    };

    animationFunctions[currentAnim.type]();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [selectedAnimation, speed, size, hueShift]);

  // Animation implementations with config parameters
  const createWavePool = (ctx, canvas, config) => {
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

    let time = 0;
    const draw = () => {
      ctx.fillStyle = 'rgba(10, 10, 30, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        const wave = Math.sin(time + p.offset) * config.baseAmplitude * config.size;
        ctx.fillStyle = `hsl(${(config.baseHue + wave * 2 + config.hueShift) % 360}, 70%, 60%)`;
        ctx.beginPath();
        ctx.arc(p.x, p.baseY + wave, config.baseParticleSize * config.size, 0, Math.PI * 2);
        ctx.fill();
      });

      time += config.baseSpeed * config.speed;
      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  const createOrbitDance = (ctx, canvas, config) => {
    const orbiters = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    for (let i = 0; i < config.count; i++) {
      orbiters.push({
        angle: (Math.PI * 2 / config.count) * i,
        radius: (config.baseRadius + i * config.radiusIncrement) * config.size,
        speed: (config.baseSpeed + i * config.speedIncrement) * config.speed,
        color: `hsl(${(config.baseHue + i * config.hueIncrement + config.hueShift) % 360}, 80%, 60%)`
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
        ctx.arc(x, y, config.baseSize * config.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        orb.angle += orb.speed;
      });

      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  const createParticleRain = (ctx, canvas, config) => {
    const drops = [];
    
    for (let i = 0; i < config.count; i++) {
      drops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: (config.baseSpeed + Math.random() * config.speedVariation) * config.speed,
        length: (config.baseLength + Math.random() * config.lengthVariation) * config.size,
        color: `hsl(${(config.baseHue + Math.random() * config.hueVariation + config.hueShift) % 360}, 70%, 60%)`
      });
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 20, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drops.forEach(drop => {
        ctx.strokeStyle = drop.color;
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

      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  const createSpiralGalaxy = (ctx, canvas, config) => {
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
        color: `hsl(${(config.baseHue + i / 2 + config.hueShift) % 360}, 80%, 60%)`
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

  const createBouncingBalls = (ctx, canvas, config) => {
    const balls = [];
    
    for (let i = 0; i < config.count; i++) {
      balls.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * config.baseVelocity * config.speed,
        vy: (Math.random() - 0.5) * config.baseVelocity * config.speed,
        radius: (config.baseRadius + Math.random() * config.radiusVariation) * config.size,
        color: `hsl(${(config.baseHue + Math.random() * 360 + config.hueShift) % 360}, 70%, 60%)`,
        gravity: config.gravity * config.speed
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
          ball.vx *= -config.damping;
          ball.x = ball.x + ball.radius > canvas.width ? canvas.width - ball.radius : ball.radius;
        }
        if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
          ball.vy *= -config.damping;
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

  const createGravityWells = (ctx, canvas, config) => {
    const particles = [];
    const wells = config.wellPositions.map(pos => ({
      x: canvas.width * pos,
      y: canvas.height * 0.5
    }));

    for (let i = 0; i < config.particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: 0,
        vy: 0,
        color: `hsl(${(config.baseHue + Math.random() * 360 + config.hueShift) % 360}, 70%, 60%)`
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
          const force = config.force * config.speed;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        });

        p.vx *= config.friction;
        p.vy *= config.friction;
        p.x += p.vx;
        p.y += p.vy;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, config.particleSize * config.size, 0, Math.PI * 2);
        ctx.fill();
      });

      wells.forEach(well => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(well.x, well.y, config.wellSize * config.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  const createColorWaves = (ctx, canvas, config) => {
    let time = 0;
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let x = 0; x < canvas.width; x += config.spacing) {
        const wave1 = Math.sin((x + time) * config.wave1Frequency) * config.wave1Amplitude * config.size;
        const wave2 = Math.sin((x + time * config.wave2SpeedMultiplier) * config.wave2Frequency) * config.wave2Amplitude * config.size;
        const y = canvas.height / 2 + wave1 + wave2;
        
        ctx.fillStyle = `hsl(${(config.baseHue + x / 2 + time + config.hueShift) % 360}, 70%, 60%)`;
        ctx.fillRect(x, y, config.spacing, config.spacing);
      }

      time += config.baseSpeed * config.speed;
      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  const createLightningOrbs = (ctx, canvas, config) => {
    const orbs = [];
    for (let i = 0; i < config.orbCount; i++) {
      orbs.push({
        x: (canvas.width / (config.orbCount + 1)) * (i + 1),
        y: canvas.height / 2,
        radius: config.orbRadius * config.size
      });
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 20, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      orbs.forEach((orb, i) => {
        orbs.forEach((other, j) => {
          if (i < j && Math.random() < config.connectionChance * config.speed) {
            ctx.strokeStyle = `hsla(${(config.baseHue + config.hueShift) % 360}, 80%, 70%, ${Math.random()})`;
            ctx.lineWidth = config.lineWidth * config.size;
            ctx.beginPath();
            ctx.moveTo(orb.x, orb.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });

        ctx.fillStyle = `hsla(${(config.baseHue + config.hueShift) % 360}, 80%, 70%, 0.6)`;
        ctx.shadowBlur = config.glowAmount;
        ctx.shadowColor = `hsl(${(config.baseHue + config.hueShift) % 360}, 80%, 70%)`;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  const createPendulumHarmony = (ctx, canvas, config) => {
    const pendulums = [];
    for (let i = 0; i < config.count; i++) {
      pendulums.push({
        x: canvas.width / 2,
        y: 50,
        length: (config.baseLength + i * config.lengthIncrement) * config.size,
        angle: config.initialAngle,
        velocity: 0,
        color: `hsl(${(config.baseHue + i * config.hueIncrement + config.hueShift) % 360}, 70%, 60%)`
      });
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      pendulums.forEach(p => {
        const gravity = config.gravity * config.speed;
        const acceleration = (-gravity / p.length) * Math.sin(p.angle);
        p.velocity += acceleration;
        p.velocity *= config.damping;
        p.angle += p.velocity;

        const bobX = p.x + p.length * Math.sin(p.angle);
        const bobY = p.y + p.length * Math.cos(p.angle);

        ctx.strokeStyle = p.color;
        ctx.lineWidth = config.lineWidth * config.size;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(bobX, bobY);
        ctx.stroke();

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(bobX, bobY, config.bobSize * config.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  const createFlowerBloom = (ctx, canvas, config) => {
    let time = 0;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < config.petalCount; i++) {
        const angle = (Math.PI * 2 / config.petalCount) * i + time * config.rotationSpeed;
        const radius = (config.baseRadius + Math.sin(time * config.pulseSpeed + i) * config.radiusVariation) * config.size;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        ctx.fillStyle = `hsl(${(config.baseHue + i * config.hueIncrement + time + config.hueShift) % 360}, 70%, 60%)`;
        ctx.beginPath();
        ctx.arc(x, y, (config.baseSize + Math.sin(time * config.breatheSpeed) * config.sizeVariation) * config.size, 0, Math.PI * 2);
        ctx.fill();
      }

      time += config.speed;
      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  const createPaintSplash = (ctx, canvas, config) => {
    const splashes = [];
    let intervalId;

    const createSplash = () => {
      const splash = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        particles: []
      };

      for (let i = 0; i < config.particlesPerSplash; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = (config.baseSpeed + Math.random() * config.speedVariation) * config.speed;
        splash.particles.push({
          x: splash.x,
          y: splash.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: `hsl(${(config.baseHue + Math.random() * 360 + config.hueShift) % 360}, 70%, 60%)`,
          life: config.particleLife
        });
      }

      splashes.push(splash);
    };

    intervalId = setInterval(createSplash, config.splashInterval / config.speed);

    const draw = () => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      splashes.forEach((splash, si) => {
        splash.particles = splash.particles.filter(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += config.gravity * config.speed;
          p.life -= config.speed;

          if (p.life > 0) {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life / config.particleLife;
            ctx.beginPath();
            ctx.arc(p.x, p.y, config.particleSize * config.size, 0, Math.PI * 2);
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

    return () => clearInterval(intervalId);
  };

  const createHexagonGrid = (ctx, canvas, config) => {
    const hexagons = [];
    const size = config.hexSize * config.size;
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
        ctx.fillStyle = `hsl(${(config.baseHue + brightness * config.hueVariation + config.hueShift) % 360}, 70%, ${config.brightnessMin + brightness * (config.brightnessMax - config.brightnessMin)}%)`;
        
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

      time += config.waveSpeed * config.speed;
      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  const createStarField = (ctx, canvas, config) => {
    const stars = [];
    for (let i = 0; i < config.starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width - canvas.width / 2,
        y: Math.random() * canvas.height - canvas.height / 2,
        z: Math.random() * canvas.width,
        color: `hsl(${(config.baseHue + Math.random() * config.hueVariation + config.hueShift) % 360}, 70%, 70%)`
      });
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        star.z -= config.baseSpeed * config.speed;
        if (star.z <= 0) {
          star.z = canvas.width;
          star.x = Math.random() * canvas.width - canvas.width / 2;
          star.y = Math.random() * canvas.height - canvas.height / 2;
        }

        const sx = (star.x / star.z) * canvas.width + canvas.width / 2;
        const sy = (star.y / star.z) * canvas.height + canvas.height / 2;
        const starSize = (1 - star.z / canvas.width) * config.maxStarSize * config.size;

        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(sx, sy, starSize, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  const createMagneticParticles = (ctx, canvas, config) => {
    const particles = [];
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    for (let i = 0; i < config.particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: 0,
        vy: 0,
        color: `hsl(${(config.baseHue + Math.random() * 360 + config.hueShift) % 360}, 70%, 60%)`
      });
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const force = Math.min(config.minDistance / dist, config.maxForce) * config.speed;

        p.vx += (dx / dist) * force * config.magnetForce;
        p.vy += (dy / dist) * force * config.magnetForce;
        p.vx *= config.friction;
        p.vy *= config.friction;
        p.x += p.vx;
        p.y += p.vy;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, config.particleSize * config.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => canvas.removeEventListener('mousemove', handleMouseMove);
  };

  const createRippleEffect = (ctx, canvas, config) => {
    const ripples = [];

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      ripples.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        radius: 0,
        maxRadius: config.maxRadius * config.size,
        color: `hsl(${(config.baseHue + Math.random() * 360 + config.hueShift) % 360}, 70%, 60%)`
      });
    };

    canvas.addEventListener('click', handleClick);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ripples.forEach((ripple, index) => {
        ripple.radius += config.rippleSpeed * config.speed;
        const alpha = 1 - ripple.radius / ripple.maxRadius;

        ctx.strokeStyle = ripple.color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = config.lineWidth * config.size;
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

    return () => canvas.removeEventListener('click', handleClick);
  };

  const createCarouselSpin = (ctx, canvas, config) => {
    const items = [];
    let rotation = 0;

    for (let i = 0; i < config.itemCount; i++) {
      items.push({
        angle: (Math.PI * 2 / config.itemCount) * i,
        color: `hsl(${(config.baseHue + (360 / config.itemCount) * i + config.hueShift) % 360}, 70%, 60%)`
      });
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 150 * config.size;

      items.forEach(item => {
        const angle = item.angle + rotation;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius * config.perspective;
        const z = Math.sin(angle);
        const itemSize = (config.baseSize + z * config.sizeVariation) * config.size;

        ctx.fillStyle = item.color;
        ctx.globalAlpha = (z + 1) / 2;
        ctx.beginPath();
        ctx.arc(x, y, itemSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      rotation += config.rotationSpeed * config.speed;
      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  const createFluidSimulation = (ctx, canvas, config) => {
    const particles = [];
    for (let i = 0; i < config.particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * config.baseVelocity,
        vy: (Math.random() - 0.5) * config.baseVelocity,
        color: `hsl(${(config.baseHue + Math.random() * config.hueVariation + config.hueShift) % 360}, 70%, 60%)`
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
            
            if (dist < config.interactionDistance * config.size && dist > 0) {
              const force = (config.interactionDistance * config.size - dist) / (config.interactionDistance * config.size);
              p.vx -= (dx / dist) * force * config.repulsionForce * config.speed;
              p.vy -= (dy / dist) * force * config.repulsionForce * config.speed;
            }
          }
        });

        p.vx *= config.friction;
        p.vy *= config.friction;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, config.particleSize * config.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  const createTargetPractice = (ctx, canvas, config) => {
    const targets = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let i = 0; i < config.ringCount; i++) {
      targets.push({
        radius: (config.baseRadius + i * config.radiusIncrement) * config.size,
        color: `hsl(${(config.baseHue + i * config.hueIncrement + config.hueShift) % 360}, 70%, 50%)`
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

      rotation += config.rotationSpeed * config.speed;
      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  const createVortexFlow = (ctx, canvas, config) => {
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
        color: `hsl(${(config.baseHue + Math.random() * 360 + config.hueShift) % 360}, 70%, 60%)`
      });
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.angle += p.speed;
        p.radius -= config.pullSpeed * config.speed;

        if (p.radius < config.minRadius * config.size) {
          p.radius = config.maxRadius * config.size;
          p.angle = Math.random() * Math.PI * 2;
        }

        p.x = centerX + Math.cos(p.angle) * p.radius;
        p.y = centerY + Math.sin(p.angle) * p.radius;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.radius / (config.maxRadius * config.size);
        ctx.beginPath();
        ctx.arc(p.x, p.y, config.particleSize * config.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  const createSparkleTrail = (ctx, canvas, config) => {
    const sparkles = [];
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    let autoX = canvas.width / 2;
    let autoY = canvas.height / 2;
    let autoAngle = 0;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      
      for (let i = 0; i < config.sparklesPerFrame; i++) {
        sparkles.push({
          x: mouseX + (Math.random() - 0.5) * 10,
          y: mouseY + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * config.baseVelocity,
          vy: (Math.random() - 0.5) * config.baseVelocity,
          life: config.particleLife,
          size: (config.baseSize + Math.random() * config.sizeVariation) * config.size,
          color: `hsl(${(config.baseHue + Math.random() * 360 + config.hueShift) % 360}, 70%, 60%)`
        });
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      autoAngle += config.autoSpeed * config.speed;
      autoX = canvas.width / 2 + Math.cos(autoAngle) * config.autoRadius * config.size;
      autoY = canvas.height / 2 + Math.sin(autoAngle) * config.autoRadiusY * config.size;

      for (let i = 0; i < config.autoSparkles; i++) {
        sparkles.push({
          x: autoX + (Math.random() - 0.5) * 10,
          y: autoY + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * config.baseVelocity,
          vy: (Math.random() - 0.5) * config.baseVelocity,
          life: config.particleLife,
          size: (config.baseSize + Math.random() * config.sizeVariation) * config.size,
          color: `hsl(${((autoAngle * 50 + config.hueShift) % 360)}, 70%, 60%)`
        });
      }

      sparkles.forEach((sparkle, index) => {
        sparkle.x += sparkle.vx;
        sparkle.y += sparkle.vy;
        sparkle.life -= config.speed;

        const alpha = sparkle.life / config.particleLife;
        ctx.fillStyle = sparkle.color;
        ctx.globalAlpha = alpha;
        ctx.shadowBlur = config.glowAmount;
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

    return () => canvas.removeEventListener('mousemove', handleMouseMove);
  };

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
              Speed: {speed.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.1"
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
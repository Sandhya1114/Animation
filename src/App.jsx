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
    },
    {
      id: 11,
      name: '🫧 Floating Bubbles',
      config: {
        bubbleCount: 50,
        baseSize: 10,
        sizeVariation: 30,
        baseSpeed: 1,
        speedVariation: 2,
        wobbleSpeed: 0.05,
        wobbleAmount: 2,
        baseHue: 180,
        trailColor: 'rgba(230, 240, 255, 0.05)',
        saturation: 50,
        lightness: 70
      },
      init: (canvas, config) => {
        const bubbles = [];
        for (let i = 0; i < config.bubbleCount; i++) {
          bubbles.push({
            x: Math.random() * canvas.width,
            y: canvas.height + Math.random() * 100,
            size: (config.baseSize + Math.random() * config.sizeVariation) * config.size,
            speed: (config.baseSpeed + Math.random() * config.speedVariation) * config.speed,
            wobble: Math.random() * Math.PI * 2,
            baseHue: config.baseHue + Math.random() * 40
          });
        }
        return { bubbles };
      },
      animate: (ctx, canvas, config, state) => {
        ctx.fillStyle = config.trailColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        state.bubbles.forEach(bubble => {
          bubble.y -= bubble.speed;
          bubble.wobble += config.wobbleSpeed * config.speed;
          const wobbleX = Math.sin(bubble.wobble) * config.wobbleAmount;

          if (bubble.y + bubble.size < 0) {
            bubble.y = canvas.height + bubble.size;
            bubble.x = Math.random() * canvas.width;
          }

          ctx.strokeStyle = `hsl(${(bubble.baseHue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
          ctx.lineWidth = 2;
          ctx.globalAlpha = 0.6;
          ctx.beginPath();
          ctx.arc(bubble.x + wobbleX, bubble.y, bubble.size, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 1;
        });
      }
    },
    {
      id: 12,
      name: '🌸 Petal Fall',
      config: {
        petalCount: 60,
        baseSize: 8,
        sizeVariation: 6,
        fallSpeed: 1,
        swayAmount: 3,
        swaySpeed: 0.03,
        rotationSpeed: 0.05,
        baseHue: 330,
        trailColor: 'rgba(255, 240, 245, 0.08)',
        saturation: 70,
        lightness: 75
      },
      init: (canvas, config) => {
        const petals = [];
        for (let i = 0; i < config.petalCount; i++) {
          petals.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: (config.baseSize + Math.random() * config.sizeVariation) * config.size,
            rotation: Math.random() * Math.PI * 2,
            sway: Math.random() * Math.PI * 2,
            speed: config.fallSpeed * (0.5 + Math.random() * 0.5),
            baseHue: config.baseHue + Math.random() * 30
          });
        }
        return { petals };
      },
      animate: (ctx, canvas, config, state) => {
        ctx.fillStyle = config.trailColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        state.petals.forEach(petal => {
          petal.y += petal.speed * config.speed;
          petal.sway += config.swaySpeed * config.speed;
          petal.rotation += config.rotationSpeed * config.speed;
          petal.x += Math.sin(petal.sway) * config.swayAmount;

          if (petal.y > canvas.height) {
            petal.y = -20;
            petal.x = Math.random() * canvas.width;
          }

          ctx.save();
          ctx.translate(petal.x, petal.y);
          ctx.rotate(petal.rotation);
          ctx.fillStyle = `hsl(${(petal.baseHue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
          ctx.beginPath();
          ctx.ellipse(0, 0, petal.size, petal.size * 0.6, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      }
    },
    {
      id: 13,
      name: '🌊 Ocean Waves',
      config: {
        waveCount: 5,
        baseAmplitude: 40,
        amplitudeIncrement: 10,
        frequency: 0.005,
        baseSpeed: 1,
        speedIncrement: 0.3,
        baseHue: 200,
        hueIncrement: 10,
        trailColor: 'rgba(10, 30, 60, 0.1)',
        saturation: 60,
        lightness: 60
      },
      init: (canvas, config) => {
        const waves = [];
        for (let i = 0; i < config.waveCount; i++) {
          waves.push({
            amplitude: (config.baseAmplitude + i * config.amplitudeIncrement) * config.size,
            offset: 0,
            speed: (config.baseSpeed + i * config.speedIncrement) * config.speed,
            yPosition: canvas.height / 2 + i * 30,
            baseHue: config.baseHue + i * config.hueIncrement,
            alpha: 0.3 + (i * 0.15)
          });
        }
        return { waves };
      },
      animate: (ctx, canvas, config, state) => {
        ctx.fillStyle = config.trailColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        state.waves.forEach(wave => {
          wave.offset += wave.speed;
          ctx.strokeStyle = `hsl(${(wave.baseHue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
          ctx.lineWidth = 3 * config.size;
          ctx.globalAlpha = wave.alpha;
          ctx.beginPath();

          for (let x = 0; x <= canvas.width; x += 5) {
            const y = wave.yPosition + Math.sin(x * config.frequency + wave.offset * 0.02) * wave.amplitude;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
          ctx.globalAlpha = 1;
        });
      }
    },
    {
      id: 14,
      name: '❄️ Snowfall',
      config: {
        flakeCount: 100,
        baseSize: 3,
        sizeVariation: 5,
        fallSpeed: 1,
        driftSpeed: 0.5,
        baseHue: 200,
        trailColor: 'rgba(20, 30, 50, 0.1)',
        saturation: 30,
        lightness: 90
      },
      init: (canvas, config) => {
        const flakes = [];
        for (let i = 0; i < config.flakeCount; i++) {
          flakes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: (config.baseSize + Math.random() * config.sizeVariation) * config.size,
            speed: config.fallSpeed * (0.3 + Math.random() * 0.7),
            drift: (Math.random() - 0.5) * config.driftSpeed,
            baseHue: config.baseHue + Math.random() * 20
          });
        }
        return { flakes };
      },
      animate: (ctx, canvas, config, state) => {
        ctx.fillStyle = config.trailColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        state.flakes.forEach(flake => {
          flake.y += flake.speed * config.speed;
          flake.x += flake.drift * config.speed;

          if (flake.y > canvas.height) {
            flake.y = -10;
            flake.x = Math.random() * canvas.width;
          }

          ctx.fillStyle = `hsl(${(flake.baseHue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = ctx.fillStyle;
          ctx.beginPath();
          ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      }
    },
    {
      id: 15,
      name: '🔮 Crystal Growth',
      config: {
        segments: 12,
        maxRadius: 200,
        growthSpeed: 0.5,
        rotationSpeed: 0.01,
        baseHue: 280,
        trailColor: 'rgba(20, 0, 40, 0.05)',
        saturation: 70,
        lightness: 60
      },
      init: (canvas, config) => {
        return {
          centerX: canvas.width / 2,
          centerY: canvas.height / 2,
          radius: 0,
          rotation: 0
        };
      },
      animate: (ctx, canvas, config, state) => {
        ctx.fillStyle = config.trailColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        state.radius += config.growthSpeed * config.speed;
        state.rotation += config.rotationSpeed * config.speed;

        if (state.radius > config.maxRadius * config.size) {
          state.radius = 0;
        }

        for (let i = 0; i < config.segments; i++) {
          const angle = (Math.PI * 2 / config.segments) * i + state.rotation;
          const x = state.centerX + Math.cos(angle) * state.radius;
          const y = state.centerY + Math.sin(angle) * state.radius;

          ctx.strokeStyle = `hsl(${(config.baseHue + i * 30 + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
          ctx.lineWidth = 2 * config.size;
          ctx.globalAlpha = 1 - state.radius / (config.maxRadius * config.size);
          ctx.beginPath();
          ctx.moveTo(state.centerX, state.centerY);
          ctx.lineTo(x, y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    },
    {
      id: 16,
      name: '🌙 Moon Phases',
      config: {
        moonSize: 80,
        orbitRadius: 150,
        orbitSpeed: 0.02,
        shadowSpeed: 0.015,
        baseHue: 50,
        trailColor: 'rgba(10, 10, 30, 0.1)',
        saturation: 30,
        lightness: 80
      },
      init: (canvas, config) => {
        return {
          centerX: canvas.width / 2,
          centerY: canvas.height / 2,
          angle: 0,
          shadowAngle: 0
        };
      },
      animate: (ctx, canvas, config, state) => {
        ctx.fillStyle = config.trailColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        state.angle += config.orbitSpeed * config.speed;
        state.shadowAngle += config.shadowSpeed * config.speed;

        const x = state.centerX + Math.cos(state.angle) * config.orbitRadius * config.size;
        const y = state.centerY + Math.sin(state.angle) * config.orbitRadius * config.size;

        ctx.fillStyle = `hsl(${(config.baseHue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
        ctx.shadowBlur = 30;
        ctx.shadowColor = ctx.fillStyle;
        ctx.beginPath();
        ctx.arc(x, y, config.moonSize * config.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(10, 10, 30, 0.7)';
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(x + Math.cos(state.shadowAngle) * config.moonSize * config.size * 0.5, 
                y, 
                config.moonSize * config.size, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    {
      id: 17,
      name: '🎨 Paint Drips',
      config: {
        dripCount: 15,
        baseSpeed: 2,
        maxLength: 200,
        width: 10,
        baseHue: 0,
        trailColor: 'rgba(240, 240, 245, 0.05)',
        saturation: 70,
        lightness: 60
      },
      init: (canvas, config) => {
        const drips = [];
        for (let i = 0; i < config.dripCount; i++) {
          drips.push({
            x: (canvas.width / config.dripCount) * i + canvas.width / (config.dripCount * 2),
            y: 0,
            length: 0,
            speed: config.baseSpeed * (0.5 + Math.random() * 0.5),
            baseHue: (360 / config.dripCount) * i
          });
        }
        return { drips };
      },
      animate: (ctx, canvas, config, state) => {
        ctx.fillStyle = config.trailColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        state.drips.forEach(drip => {
          drip.length += drip.speed * config.speed;

          if (drip.length > config.maxLength * config.size) {
            drip.length = 0;
          }

          ctx.fillStyle = `hsl(${(drip.baseHue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
          ctx.fillRect(drip.x - config.width * config.size / 2, drip.y, config.width * config.size, drip.length);
        });
      }
    },
    {
      id: 18,
      name: '🌺 Mandala Bloom',
      config: {
        petals: 16,
        layers: 5,
        pulseSpeed: 0.03,
        rotationSpeed: 0.005,
        baseSize: 15,
        baseHue: 300,
        trailColor: 'rgba(20, 0, 20, 0.05)',
        saturation: 70,
        lightness: 60
      },
      init: (canvas, config) => {
        return {
          centerX: canvas.width / 2,
          centerY: canvas.height / 2,
          pulse: 0,
          rotation: 0
        };
      },
      animate: (ctx, canvas, config, state) => {
        ctx.fillStyle = config.trailColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        state.pulse += config.pulseSpeed * config.speed;
        state.rotation += config.rotationSpeed * config.speed;
        const pulseScale = 0.8 + Math.sin(state.pulse) * 0.2;

        for (let layer = 0; layer < config.layers; layer++) {
          for (let i = 0; i < config.petals; i++) {
            const angle = (Math.PI * 2 / config.petals) * i + state.rotation + layer * 0.2;
            const radius = (50 + layer * 30) * config.size * pulseScale;
            const x = state.centerX + Math.cos(angle) * radius;
            const y = state.centerY + Math.sin(angle) * radius;

            ctx.fillStyle = `hsl(${(config.baseHue + layer * 15 + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
            ctx.globalAlpha = 0.6;
            ctx.beginPath();
            ctx.arc(x, y, config.baseSize * config.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
          }
        }
      }
    },
    {
      id: 19,
      name: '💎 Diamond Rain',
      config: {
        diamondCount: 40,
        baseSize: 8,
        sizeVariation: 8,
        fallSpeed: 2,
        rotationSpeed: 0.1,
        sparkleChance: 0.02,
        baseHue: 180,
        trailColor: 'rgba(10, 10, 30, 0.1)',
        saturation: 80,
        lightness: 70
      },
      init: (canvas, config) => {
        const diamonds = [];
        for (let i = 0; i < config.diamondCount; i++) {
          diamonds.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: (config.baseSize + Math.random() * config.sizeVariation) * config.size,
            rotation: Math.random() * Math.PI * 2,
            speed: config.fallSpeed * (0.5 + Math.random() * 0.5),
            baseHue: config.baseHue + Math.random() * 60,
            sparkle: false
          });
        }
        return { diamonds };
      },
      animate: (ctx, canvas, config, state) => {
        ctx.fillStyle = config.trailColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        state.diamonds.forEach(diamond => {
          diamond.y += diamond.speed * config.speed;
          diamond.rotation += config.rotationSpeed * config.speed;
          
          if (Math.random() < config.sparkleChance) {
            diamond.sparkle = true;
            setTimeout(() => diamond.sparkle = false, 100);
          }

          if (diamond.y > canvas.height) {
            diamond.y = -20;
            diamond.x = Math.random() * canvas.width;
          }

          ctx.save();
          ctx.translate(diamond.x, diamond.y);
          ctx.rotate(diamond.rotation);

          if (diamond.sparkle) {
            ctx.shadowBlur = 20;
            ctx.shadowColor = `hsl(${(diamond.baseHue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
          }

          ctx.fillStyle = `hsl(${(diamond.baseHue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
          ctx.beginPath();
          ctx.moveTo(0, -diamond.size);
          ctx.lineTo(diamond.size * 0.7, 0);
          ctx.lineTo(0, diamond.size);
          ctx.lineTo(-diamond.size * 0.7, 0);
          ctx.closePath();
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.restore();
        });
      }
    },
    {
      id: 20,
      name: '🌟 Starburst',
      config: {
        rayCount: 20,
        pulseSpeed: 0.05,
        rotationSpeed: 0.01,
        maxLength: 150,
        baseHue: 50,
        trailColor: 'rgba(0, 0, 0, 0.1)',
        saturation: 80,
        lightness: 70
      },
      init: (canvas, config) => {
        return {
          centerX: canvas.width / 2,
          centerY: canvas.height / 2,
          pulse: 0,
          rotation: 0
        };
      },
      animate: (ctx, canvas, config, state) => {
        ctx.fillStyle = config.trailColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        state.pulse += config.pulseSpeed * config.speed;
        state.rotation += config.rotationSpeed * config.speed;
        const length = (Math.sin(state.pulse) * 0.5 + 0.5) * config.maxLength * config.size;

        for (let i = 0; i < config.rayCount; i++) {
          const angle = (Math.PI * 2 / config.rayCount) * i + state.rotation;
          const x = state.centerX + Math.cos(angle) * length;
          const y = state.centerY + Math.sin(angle) * length;

          const gradient = ctx.createLinearGradient(state.centerX, state.centerY, x, y);
          gradient.addColorStop(0, `hsl(${(config.baseHue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`);
          gradient.addColorStop(1, `hsla(${(config.baseHue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%, 0)`);

          ctx.strokeStyle = gradient;
          ctx.lineWidth = 3 * config.size;
          ctx.beginPath();
          ctx.moveTo(state.centerX, state.centerY);
          ctx.lineTo(x, y);
          ctx.stroke();
        }
      }
    },
    {
      id: 21,
      name: '🦋 Butterfly Swarm',
      config: {
        butterflyCount: 25,
        baseSpeed: 2,
        wingFlapSpeed: 0.2,
        wanderAmount: 2,
        baseSize: 8,
        baseHue: 280,
        trailColor: 'rgba(240, 230, 255, 0.08)',
        saturation: 70,
        lightness: 65
      },
      init: (canvas, config) => {
        const butterflies = [];
        for (let i = 0; i < config.butterflyCount; i++) {
          butterflies.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * config.baseSpeed,
            vy: (Math.random() - 0.5) * config.baseSpeed,
            wingPhase: Math.random() * Math.PI * 2,
            baseHue: config.baseHue + Math.random() * 80
          });
        }
        return { butterflies };
      },
      animate: (ctx, canvas, config, state) => {
        ctx.fillStyle = config.trailColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        state.butterflies.forEach(butterfly => {
          butterfly.vx += (Math.random() - 0.5) * config.wanderAmount * config.speed;
          butterfly.vy += (Math.random() - 0.5) * config.wanderAmount * config.speed;
          butterfly.x += butterfly.vx * config.speed;
          butterfly.y += butterfly.vy * config.speed;
          butterfly.wingPhase += config.wingFlapSpeed * config.speed;

          if (butterfly.x < 0) butterfly.x = canvas.width;
          if (butterfly.x > canvas.width) butterfly.x = 0;
          if (butterfly.y < 0) butterfly.y = canvas.height;
          if (butterfly.y > canvas.height) butterfly.y = 0;

          const wingSpread = Math.sin(butterfly.wingPhase) * config.baseSize * config.size;

          ctx.fillStyle = `hsl(${(butterfly.baseHue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
          ctx.beginPath();
          ctx.ellipse(butterfly.x - wingSpread / 2, butterfly.y, Math.abs(wingSpread), config.baseSize * config.size, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(butterfly.x + wingSpread / 2, butterfly.y, Math.abs(wingSpread), config.baseSize * config.size, 0, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    },
    {
      id: 22,
      name: '🌀 DNA Helix',
      config: {
        strands: 2,
        pointsPerStrand: 100,
        amplitude: 80,
        frequency: 0.1,
        scrollSpeed: 2,
        baseHue: 180,
        trailColor: 'rgba(0, 20, 30, 0.1)',
        saturation: 70,
        lightness: 60
      },
      init: (canvas, config) => {
        return { offset: 0 };
      },
      animate: (ctx, canvas, config, state) => {
        ctx.fillStyle = config.trailColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        state.offset += config.scrollSpeed * config.speed;

        for (let strand = 0; strand < config.strands; strand++) {
          const phaseShift = (Math.PI * 2 / config.strands) * strand;
          
          for (let i = 0; i < config.pointsPerStrand; i++) {
            const x = (canvas.width / config.pointsPerStrand) * i;
            const wave = Math.sin(i * config.frequency + state.offset * 0.02 + phaseShift) * config.amplitude * config.size;
            const y = canvas.height / 2 + wave;

            ctx.fillStyle = `hsl(${(config.baseHue + strand * 180 + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
            ctx.beginPath();
            ctx.arc(x, y, 5 * config.size, 0, Math.PI * 2);
            ctx.fill();

            if (i % 5 === 0 && Math.abs(wave) < 10) {
              const otherWave = Math.sin(i * config.frequency + state.offset * 0.02 + phaseShift + Math.PI) * config.amplitude * config.size;
              const y2 = canvas.height / 2 + otherWave;
              
              ctx.strokeStyle = `hsla(${(config.baseHue + 90 + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%, 0.3)`;
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(x, y2);
              ctx.stroke();
            }
          }
        }
      }
    },
    {
      id: 23,
      name: '🎪 Carousel',
      config: {
        seats: 12,
        radius: 120,
        upDownAmplitude: 30,
        rotationSpeed: 0.02,
        upDownSpeed: 0.05,
        seatSize: 12,
        baseHue: 0,
        trailColor: 'rgba(30, 20, 40, 0.08)',
        saturation: 75,
        lightness: 65
      },
      init: (canvas, config) => {
        return {
          centerX: canvas.width / 2,
          centerY: canvas.height / 2,
          rotation: 0,
          upDownPhase: 0
        };
      },
      animate: (ctx, canvas, config, state) => {
        ctx.fillStyle = config.trailColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        state.rotation += config.rotationSpeed * config.speed;
        state.upDownPhase += config.upDownSpeed * config.speed;

        for (let i = 0; i < config.seats; i++) {
          const angle = (Math.PI * 2 / config.seats) * i + state.rotation;
          const upDown = Math.sin(state.upDownPhase + i * 0.5) * config.upDownAmplitude * config.size;
          const x = state.centerX + Math.cos(angle) * config.radius * config.size;
          const y = state.centerY + Math.sin(angle) * config.radius * config.size + upDown;

          ctx.fillStyle = `hsl(${((360 / config.seats) * i + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
          ctx.shadowBlur = 15;
          ctx.shadowColor = ctx.fillStyle;
          ctx.beginPath();
          ctx.arc(x, y, config.seatSize * config.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    },
    
    {
        id: 23,
        name: '🌊 Liquid Ripple',
        audio: "/sounds/ambient.mp3",
        config: {
            rippleCount: 8,
            maxRadius: 300,
            rippleSpeed: 2,
            waveAmplitude: 15,
            waveFrequency: 0.05,
            baseHue: 190,
            trailColor: 'rgba(5, 15, 35, 0.15)',
            saturation: 75,
            lightness: 65
        },
        init: (canvas, config) => {
            return {
                centerX: canvas.width / 2,
                centerY: canvas.height / 2,
                ripples: [],
                time: 0
            };
        },
        animate: (ctx, canvas, config, state) => {
            ctx.fillStyle = config.trailColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (state.time % 30 === 0) {
                state.ripples.push({ radius: 0, alpha: 1 });
            }

            state.ripples = state.ripples.filter(ripple => {
                ripple.radius += config.rippleSpeed * config.speed;
                ripple.alpha -= 0.01;

                for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
                    const wave = Math.sin(angle * 10 + state.time * 0.1) * config.waveAmplitude * config.size;
                    const r = ripple.radius + wave;
                    const x = state.centerX + Math.cos(angle) * r;
                    const y = state.centerY + Math.sin(angle) * r;

                    ctx.fillStyle = `hsla(${(config.baseHue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%, ${ripple.alpha})`;
                    ctx.beginPath();
                    ctx.arc(x, y, 3 * config.size, 0, Math.PI * 2);
                    ctx.fill();
                }

                return ripple.radius < config.maxRadius * config.size && ripple.alpha > 0;
            });

            state.time++;
        }
    },
    {
        id: 24,
        name: '🎪 Ferris Wheel',
        audio: "/sounds/ambient.mp3",
        config: {
            gondolas: 16,
            wheelRadius: 140,
            gondolaSize: 12,
            rotationSpeed: 0.015,
            swingAmplitude: 0.3,
            swingSpeed: 0.1,
            baseHue: 45,
            trailColor: 'rgba(25, 20, 40, 0.08)',
            saturation: 75,
            lightness: 65
        },
        init: (canvas, config) => {
            return {
                centerX: canvas.width / 2,
                centerY: canvas.height / 2,
                rotation: 0,
                time: 0
            };
        },
        animate: (ctx, canvas, config, state) => {
            ctx.fillStyle = config.trailColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            state.rotation += config.rotationSpeed * config.speed;
            state.time += config.swingSpeed * config.speed;

            // Draw spokes
            for (let i = 0; i < config.gondolas; i++) {
                const angle = (Math.PI * 2 / config.gondolas) * i + state.rotation;
                const x = state.centerX + Math.cos(angle) * config.wheelRadius * config.size;
                const y = state.centerY + Math.sin(angle) * config.wheelRadius * config.size;

                ctx.strokeStyle = `hsla(${(config.baseHue + config.hueShift) % 360}, 40%, 50%, 0.3)`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(state.centerX, state.centerY);
                ctx.lineTo(x, y);
                ctx.stroke();
            }

            // Draw gondolas
            for (let i = 0; i < config.gondolas; i++) {
                const angle = (Math.PI * 2 / config.gondolas) * i + state.rotation;
                const swing = Math.sin(state.time + i) * config.swingAmplitude;
                const x = state.centerX + Math.cos(angle) * config.wheelRadius * config.size;
                const y = state.centerY + Math.sin(angle) * config.wheelRadius * config.size;

                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(swing);
                ctx.fillStyle = `hsl(${((360 / config.gondolas) * i + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
                ctx.shadowBlur = 15;
                ctx.shadowColor = ctx.fillStyle;
                ctx.fillRect(-config.gondolaSize * config.size / 2, -config.gondolaSize * config.size / 2, 
                           config.gondolaSize * config.size, config.gondolaSize * config.size);
                ctx.shadowBlur = 0;
                ctx.restore();
            }

            // Draw center hub
            ctx.fillStyle = `hsl(${(config.baseHue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
            ctx.beginPath();
            ctx.arc(state.centerX, state.centerY, 15 * config.size, 0, Math.PI * 2);
            ctx.fill();
        }
    },
    {
        id: 25,
        name: '🔥 Flame Dance',
        audio: "/sounds/ambient.mp3",
        config: {
            particleCount: 150,
            riseSpeed: 3,
            flameHeight: 250,
            flickerAmount: 20,
            baseHue: 25,
            trailColor: 'rgba(10, 5, 0, 0.15)',
            saturation: 85,
            lightness: 60
        },
        init: (canvas, config) => {
            const particles = [];
            for (let i = 0; i < config.particleCount; i++) {
                particles.push({
                    x: canvas.width / 2 + (Math.random() - 0.5) * 60,
                    y: canvas.height - 50,
                    vy: config.riseSpeed * (0.5 + Math.random()),
                    life: 1,
                    baseHue: config.baseHue + Math.random() * 40
                });
            }
            return { particles };
        },
        animate: (ctx, canvas, config, state) => {
            ctx.fillStyle = config.trailColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            state.particles.forEach((p, i) => {
                p.y -= p.vy * config.speed;
                p.x += (Math.random() - 0.5) * config.flickerAmount * config.speed;
                p.life -= 0.008 * config.speed;

                if (p.y < canvas.height - config.flameHeight * config.size || p.life <= 0) {
                    p.x = canvas.width / 2 + (Math.random() - 0.5) * 60;
                    p.y = canvas.height - 50;
                    p.life = 1;
                }

                const hue = p.baseHue + (1 - p.life) * 20;
                const size = p.life * 8 * config.size;

                ctx.fillStyle = `hsla(${(hue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%, ${p.life})`;
                ctx.shadowBlur = 20;
                ctx.shadowColor = ctx.fillStyle;
                ctx.beginPath();
                ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            });
        }
    },
    {
        id: 26,
        name: '🌸 Blooming Flowers',
        audio: "/sounds/ambient.mp3",
        config: {
            flowerCount: 12,
            petalCount: 8,
            bloomSpeed: 0.02,
            maxSize: 40,
            rotationSpeed: 0.01,
            baseHue: 320,
            trailColor: 'rgba(255, 245, 250, 0.1)',
            saturation: 70,
            lightness: 70
        },
        init: (canvas, config) => {
            const flowers = [];
            const cols = 4;
            const rows = 3;
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    flowers.push({
                        x: (canvas.width / cols) * i + canvas.width / (cols * 2),
                        y: (canvas.height / rows) * j + canvas.height / (rows * 2),
                        bloom: 0,
                        rotation: Math.random() * Math.PI * 2,
                        baseHue: config.baseHue + (i + j) * 15
                    });
                }
            }
            return { flowers };
        },
        animate: (ctx, canvas, config, state) => {
            ctx.fillStyle = config.trailColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            state.flowers.forEach(flower => {
                flower.bloom += config.bloomSpeed * config.speed;
                flower.rotation += config.rotationSpeed * config.speed;
                if (flower.bloom > 1) flower.bloom = 0;

                const bloomScale = Math.sin(flower.bloom * Math.PI);

                for (let i = 0; i < config.petalCount; i++) {
                    const angle = (Math.PI * 2 / config.petalCount) * i + flower.rotation;
                    const petalDist = bloomScale * config.maxSize * config.size;
                    const x = flower.x + Math.cos(angle) * petalDist;
                    const y = flower.y + Math.sin(angle) * petalDist;

                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(angle);
                    ctx.fillStyle = `hsl(${(flower.baseHue + i * 5 + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
                    ctx.globalAlpha = bloomScale;
                    ctx.beginPath();
                    ctx.ellipse(0, 0, 15 * config.size * bloomScale, 8 * config.size * bloomScale, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.globalAlpha = 1;
                    ctx.restore();
                }

                // Center
                ctx.fillStyle = `hsl(${(flower.baseHue + 180 + config.hueShift) % 360}, 80%, 60%)`;
                ctx.beginPath();
                ctx.arc(flower.x, flower.y, 8 * config.size * bloomScale, 0, Math.PI * 2);
                ctx.fill();
            });
        }
    },
    {
        id: 27,
        name: '⚡ Lightning Storm',
        audio: "/sounds/ambient.mp3",
        config: {
            boltChance: 0.03,
            segments: 20,
            branchChance: 0.3,
            spread: 40,
            baseHue: 200,
            trailColor: 'rgba(5, 5, 20, 0.2)',
            saturation: 80,
            lightness: 80
        },
        init: (canvas, config) => {
            return { bolts: [], time: 0 };
        },
        animate: (ctx, canvas, config, state) => {
            ctx.fillStyle = config.trailColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (Math.random() < config.boltChance * config.speed) {
                const startX = Math.random() * canvas.width;
                const bolt = [{
                    x: startX,
                    y: 0,
                    targetX: startX + (Math.random() - 0.5) * 100,
                    targetY: canvas.height,
                    life: 10
                }];
                state.bolts.push(bolt);
            }

            state.bolts = state.bolts.filter(bolt => {
                bolt[0].life--;
                
                ctx.strokeStyle = `hsl(${(config.baseHue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
                ctx.lineWidth = 3 * config.size;
                ctx.shadowBlur = 20;
                ctx.shadowColor = ctx.strokeStyle;
                ctx.globalAlpha = bolt[0].life / 10;

                let x = bolt[0].x;
                let y = bolt[0].y;

                ctx.beginPath();
                ctx.moveTo(x, y);

                for (let i = 0; i < config.segments; i++) {
                    x += (Math.random() - 0.5) * config.spread;
                    y += (bolt[0].targetY - bolt[0].y) / config.segments;
                    ctx.lineTo(x, y);

                    if (Math.random() < config.branchChance) {
                        const branchLength = 5 + Math.random() * 10;
                        const branchAngle = (Math.random() - 0.5) * Math.PI / 2;
                        ctx.moveTo(x, y);
                        ctx.lineTo(
                            x + Math.cos(branchAngle) * branchLength * config.size,
                            y + Math.sin(branchAngle) * branchLength * config.size
                        );
                        ctx.moveTo(x, y);
                    }
                }

                ctx.stroke();
                ctx.shadowBlur = 0;
                ctx.globalAlpha = 1;

                return bolt[0].life > 0;
            });
        }
    },
    {
        id: 28,
        name: '🧬 Cellular Division',
        audio: "/sounds/ambient.mp3",
        config: {
            maxCells: 32,
            initialSize: 40,
            divisionTime: 120,
            moveSpeed: 0.5,
            baseHue: 150,
            trailColor: 'rgba(230, 255, 240, 0.1)',
            saturation: 60,
            lightness: 65
        },
        init: (canvas, config) => {
            return {
                cells: [{
                    x: canvas.width / 2,
                    y: canvas.height / 2,
                    size: config.initialSize,
                    age: 0,
                    vx: 0,
                    vy: 0,
                    hue: config.baseHue
                }]
            };
        },
        animate: (ctx, canvas, config, state) => {
            ctx.fillStyle = config.trailColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            state.cells.forEach((cell, index) => {
                cell.age++;
                cell.x += cell.vx * config.speed;
                cell.y += cell.vy * config.speed;

                // Bounce off walls
                if (cell.x < cell.size || cell.x > canvas.width - cell.size) cell.vx *= -1;
                if (cell.y < cell.size || cell.y > canvas.height - cell.size) cell.vy *= -1;

                // Division
                if (cell.age > config.divisionTime && state.cells.length < config.maxCells) {
                    const angle = Math.random() * Math.PI * 2;
                    state.cells.push({
                        x: cell.x + Math.cos(angle) * 20,
                        y: cell.y + Math.sin(angle) * 20,
                        size: cell.size * 0.8,
                        age: 0,
                        vx: Math.cos(angle) * config.moveSpeed,
                        vy: Math.sin(angle) * config.moveSpeed,
                        hue: (cell.hue + 20) % 360
                    });
                    cell.vx = -Math.cos(angle) * config.moveSpeed;
                    cell.vy = -Math.sin(angle) * config.moveSpeed;
                    cell.age = 0;
                }

                // Draw cell
                ctx.fillStyle = `hsl(${(cell.hue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
                ctx.globalAlpha = 0.7;
                ctx.beginPath();
                ctx.arc(cell.x, cell.y, cell.size * config.size, 0, Math.PI * 2);
                ctx.fill();

                // Nucleus
                ctx.fillStyle = `hsl(${(cell.hue + 30 + config.hueShift) % 360}, ${config.saturation}%, 50%)`;
                ctx.beginPath();
                ctx.arc(cell.x, cell.y, cell.size * 0.3 * config.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            });
        }
    },
    {
        id: 29,
        name: '🎵 Sound Wave Visualizer',
        audio: "/sounds/ambient.mp3",
        config: {
            bars: 64,
            baseHeight: 20,
            maxHeight: 200,
            smoothing: 0.8,
            pulseSpeed: 0.1,
            baseHue: 280,
            trailColor: 'rgba(10, 0, 20, 0.3)',
            saturation: 75,
            lightness: 65
        },
        init: (canvas, config) => {
            const heights = new Array(config.bars).fill(0);
            return { heights, time: 0 };
        },
        animate: (ctx, canvas, config, state) => {
            ctx.fillStyle = config.trailColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            state.time += config.pulseSpeed * config.speed;
            const barWidth = canvas.width / config.bars;

            for (let i = 0; i < config.bars; i++) {
                const targetHeight = (Math.sin(state.time + i * 0.3) * 0.5 + 0.5) * 
                                    (Math.cos(state.time * 0.5 + i * 0.1) * 0.5 + 0.5) * 
                                    config.maxHeight * config.size;
                
                state.heights[i] += (targetHeight - state.heights[i]) * (1 - config.smoothing);

                const x = i * barWidth;
                const height = config.baseHeight * config.size + state.heights[i];
                const y = canvas.height / 2 - height / 2;

                const gradient = ctx.createLinearGradient(x, y, x, y + height);
                gradient.addColorStop(0, `hsl(${(config.baseHue + i * 3 + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`);
                gradient.addColorStop(1, `hsl(${(config.baseHue + i * 3 + 60 + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness - 20}%)`);

                ctx.fillStyle = gradient;
                ctx.fillRect(x, y, barWidth - 2, height);

                // Reflection
                ctx.globalAlpha = 0.3;
                ctx.fillRect(x, canvas.height / 2 + height / 2, barWidth - 2, height * 0.5);
                ctx.globalAlpha = 1;
            }
        }
    },
    {
        id: 30,
        name: '🌀 Hypnotic Spiral',
        audio: "/sounds/ambient.mp3",
        config: {
            segments: 200,
            rotationSpeed: 0.02,
            pulseSpeed: 0.05,
            minRadius: 20,
            maxRadius: 200,
            baseHue: 270,
            trailColor: 'rgba(0, 0, 0, 0.05)',
            saturation: 80,
            lightness: 65
        },
        init: (canvas, config) => {
            return {
                centerX: canvas.width / 2,
                centerY: canvas.height / 2,
                rotation: 0,
                pulse: 0
            };
        },
        animate: (ctx, canvas, config, state) => {
            ctx.fillStyle = config.trailColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            state.rotation += config.rotationSpeed * config.speed;
            state.pulse += config.pulseSpeed * config.speed;

            const pulseScale = Math.sin(state.pulse) * 0.3 + 1;

            for (let i = 0; i < config.segments; i++) {
                const progress = i / config.segments;
                const angle = progress * Math.PI * 8 + state.rotation;
                const radius = (config.minRadius + progress * (config.maxRadius - config.minRadius)) * config.size * pulseScale;
                
                const x = state.centerX + Math.cos(angle) * radius;
                const y = state.centerY + Math.sin(angle) * radius;

                const size = (3 + progress * 8) * config.size;
                const hue = (config.baseHue + progress * 120 + config.hueShift) % 360;

                ctx.fillStyle = `hsl(${hue}, ${config.saturation}%, ${config.lightness}%)`;
                ctx.shadowBlur = 15;
                ctx.shadowColor = ctx.fillStyle;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }
    },
    {
        id: 31,
        name: '🎆 Firework Burst',
        audio: "/sounds/ambient.mp3",
        config: {
            maxFireworks: 5,
            particlesPerBurst: 80,
            launchChance: 0.02,
            gravity: 0.15,
            trailColor: 'rgba(0, 0, 10, 0.15)',
            saturation: 85,
            lightness: 65
        },
        init: (canvas, config) => {
            return { fireworks: [], particles: [] };
        },
        animate: (ctx, canvas, config, state) => {
            ctx.fillStyle = config.trailColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Launch new fireworks
            if (Math.random() < config.launchChance * config.speed && state.fireworks.length < config.maxFireworks) {
                state.fireworks.push({
                    x: Math.random() * canvas.width,
                    y: canvas.height,
                    vy: -8 - Math.random() * 4,
                    targetY: 100 + Math.random() * 200,
                    hue: Math.random() * 360
                });
            }

            // Update fireworks
            state.fireworks = state.fireworks.filter(fw => {
                fw.y += fw.vy * config.speed;

                ctx.fillStyle = `hsl(${(fw.hue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
                ctx.beginPath();
                ctx.arc(fw.x, fw.y, 3 * config.size, 0, Math.PI * 2);
                ctx.fill();

                if (fw.y <= fw.targetY) {
                    // Burst
                    for (let i = 0; i < config.particlesPerBurst; i++) {
                        const angle = (Math.PI * 2 / config.particlesPerBurst) * i;
                        const speed = 2 + Math.random() * 4;
                        state.particles.push({
                            x: fw.x,
                            y: fw.y,
                            vx: Math.cos(angle) * speed,
                            vy: Math.sin(angle) * speed,
                            hue: fw.hue + Math.random() * 30,
                            life: 1
                        });
                    }
                    return false;
                }
                return true;
            });

            // Update particles
            state.particles = state.particles.filter(p => {
                p.x += p.vx * config.speed;
                p.y += p.vy * config.speed;
                p.vy += config.gravity * config.speed;
                p.life -= 0.015 * config.speed;

                ctx.fillStyle = `hsla(${(p.hue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%, ${p.life})`;
                ctx.shadowBlur = 10;
                ctx.shadowColor = ctx.fillStyle;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2 * config.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;

                return p.life > 0;
            });
        }
    },
    {
        id: 32,
        name: '🌊 Tidal Wave',
        audio: "/sounds/ambient.mp3",
        config: {
            layers: 7,
            waveSpeed: 2,
            amplitude: 60,
            frequency: 0.008,
            baseHue: 195,
            trailColor: 'rgba(15, 25, 45, 0.1)',
            saturation: 70,
            lightness: 60
        },
        init: (canvas, config) => {
            return { offset: 0 };
        },
        animate: (ctx, canvas, config, state) => {
            ctx.fillStyle = config.trailColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            state.offset += config.waveSpeed * config.speed;

            for (let layer = 0; layer < config.layers; layer++) {
                const yBase = canvas.height - (layer * 40 * config.size);
                const layerOffset = layer * 50;

                ctx.beginPath();
                ctx.moveTo(0, canvas.height);

                for (let x = 0; x <= canvas.width; x += 3) {
                    const wave1 = Math.sin((x + state.offset + layerOffset) * config.frequency) * config.amplitude * config.size;
                    const wave2 = Math.sin((x * 2 + state.offset * 1.5 + layerOffset) * config.frequency * 0.5) * config.amplitude * 0.5 * config.size;
                    const y = yBase + wave1 + wave2;
                    ctx.lineTo(x, y);
                }

                ctx.lineTo(canvas.width, canvas.height);
                ctx.closePath();

                ctx.fillStyle = `hsla(${(config.baseHue + layer * 8 + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness - layer * 5}%, ${0.5 - layer * 0.05})`;
                ctx.fill();
            }
        }
    },
    {
        id: 33,
        name: '🔮 Magic Orbs',
        audio: "/sounds/ambient.mp3",
        config: {
            orbCount: 7,
            baseRadius: 30,
            orbitRadius: 120,
            orbitSpeed: 0.02,
            pulseSpeed: 0.05,
            baseHue: 280,
            trailColor: 'rgba(20, 0, 40, 0.08)',
            saturation: 80,
            lightness: 70
        },
        init: (canvas, config) => {
            const orbs = [];
            for (let i = 0; i < config.orbCount; i++) {
                orbs.push({
                    angle: (Math.PI * 2 / config.orbCount) * i,
                    orbitRadius: config.orbitRadius + i * 25,
                    speed: config.orbitSpeed * (1 + i * 0.2),
                    pulsePhase: (Math.PI * 2 / config.orbCount) * i,
                    baseHue: (360 / config.orbCount) * i
                });
            }
            return {
                centerX: canvas.width / 2,
                centerY: canvas.height / 2,
                orbs,
                pulse: 0
            };
        },
        animate: (ctx, canvas, config, state) => {
            ctx.fillStyle = config.trailColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            state.pulse += config.pulseSpeed * config.speed;

            state.orbs.forEach(orb => {
                orb.angle += orb.speed * config.speed;

                const pulseScale = Math.sin(state.pulse + orb.pulsePhase) * 0.4 + 1;
                const radius = config.baseRadius * config.size * pulseScale;
                const x = state.centerX + Math.cos(orb.angle) * orb.orbitRadius * config.size;
                const y = state.centerY + Math.sin(orb.angle) * orb.orbitRadius * config.size;

                const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                gradient.addColorStop(0, `hsl(${(orb.baseHue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`);
                gradient.addColorStop(1, `hsla(${(orb.baseHue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%, 0)`);

                ctx.fillStyle = gradient;
                ctx.shadowBlur = 30;
                ctx.shadowColor = `hsl(${(orb.baseHue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            });
        }
    },
    {
        id: 34,
        name: '🎭 Kaleidoscope',
        audio: "/sounds/ambient.mp3",
        config: {
            segments: 12,
            particleCount: 50,
            rotationSpeed: 0.01,
            moveSpeed: 1,
            baseHue: 0,
            trailColor: 'rgba(0, 0, 0, 0.05)',
            saturation: 80,
            lightness: 65
        },
        init: (canvas, config) => {
            const particles = [];
            for (let i = 0; i < config.particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width / config.segments,
                    y: Math.random() * canvas.height / 2,
                    vx: (Math.random() - 0.5) * config.moveSpeed,
                    vy: (Math.random() - 0.5) * config.moveSpeed,
                    size: 2 + Math.random() * 6,
                    hue: Math.random() * 360
                });
            }
            return {
                centerX: canvas.width / 2,
                centerY: canvas.height / 2,
                rotation: 0,
                particles
            };
        },
        animate: (ctx, canvas, config, state) => {
            ctx.fillStyle = config.trailColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            state.rotation += config.rotationSpeed * config.speed;

            ctx.save();
            ctx.translate(state.centerX, state.centerY);

            for (let seg = 0; seg < config.segments; seg++) {
                const angle = (Math.PI * 2 / config.segments) * seg + state.rotation;
                
                ctx.save();
                ctx.rotate(angle);

                state.particles.forEach(p => {
                    p.x += p.vx * config.speed;
                    p.y += p.vy * config.speed;

                    const maxX = canvas.width / config.segments;
                    const maxY = canvas.height / 2;

                    if (p.x < 0 || p.x > maxX) p.vx *= -1;
                    if (p.y < 0 || p.y > maxY) p.vy *= -1;

                    ctx.fillStyle = `hsl(${(p.hue + seg * 30 + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * config.size, 0, Math.PI * 2);
                    ctx.fill();

                    // Mirror
                    ctx.beginPath();
                    ctx.arc(p.x, -p.y, p.size * config.size, 0, Math.PI * 2);
                    ctx.fill();
                });

                ctx.restore();
            }

            ctx.restore();
        }
    },
    {
        id: 35,
        name: '🌌 Nebula Cloud',
        audio: "/sounds/ambient.mp3",
        config: {
            particleCount: 300,
            flowSpeed: 0.3,
            noiseScale: 0.005,
            baseHue: 260,
            trailColor: 'rgba(5, 0, 15, 0.03)',
            saturation: 70,
            lightness: 60
        },
        init: (canvas, config) => {
            const particles = [];
            for (let i = 0; i < config.particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: 1 + Math.random() * 4,
                    hue: config.baseHue + Math.random() * 60,
                    alpha: 0.3 + Math.random() * 0.7
                });
            }
            return { particles, time: 0 };
        },
        animate: (ctx, canvas, config, state) => {
            ctx.fillStyle = config.trailColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            state.time += 0.01 * config.speed;

            state.particles.forEach(p => {
                // Perlin-like flow using sine waves
                const noiseX = Math.sin(p.x * config.noiseScale + state.time) * Math.cos(p.y * config.noiseScale);
                const noiseY = Math.cos(p.x * config.noiseScale) * Math.sin(p.y * config.noiseScale + state.time);

                p.x += noiseX * config.flowSpeed * config.speed;
                p.y += noiseY * config.flowSpeed * config.speed;

                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.fillStyle = `hsla(${(p.hue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%, ${p.alpha})`;
                ctx.shadowBlur = 20;
                ctx.shadowColor = ctx.fillStyle;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * config.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            });
        }
    },
    {
        id: 36,
        name: '🎪 Juggling Balls',
        audio: "/sounds/ambient.mp3",
        config: {
            ballCount: 5,
            throwHeight: 200,
            throwSpeed: 8,
            gravity: 0.4,
            spacing: 80,
            baseHue: 0,
            trailColor: 'rgba(30, 30, 40, 0.1)',
            saturation: 75,
            lightness: 65
        },
        init: (canvas, config) => {
            const balls = [];
            const startY = canvas.height - 100;
            for (let i = 0; i < config.ballCount; i++) {
                balls.push({
                    x: canvas.width / 2,
                    y: startY,
                    vy: -config.throwSpeed,
                    gravity: config.gravity,
                    delay: i * 15,
                    active: i === 0,
                    hue: (360 / config.ballCount) * i
                });
            }
            return { balls, time: 0 };
        },
        animate: (ctx, canvas, config, state) => {
            ctx.fillStyle = config.trailColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            state.time++;

            state.balls.forEach((ball, i) => {
                if (!ball.active && state.time >= ball.delay) {
                    ball.active = true;
                }

                if (ball.active) {
                    ball.vy += ball.gravity * config.speed;
                    ball.y += ball.vy * config.speed;

                    if (ball.y >= canvas.height - 100) {
                        ball.y = canvas.height - 100;
                        ball.vy = -config.throwSpeed;
                    }

                    const arcX = canvas.width / 2 + Math.sin(state.time * 0.02 + i * 1.2) * config.spacing * config.size;

                    ctx.fillStyle = `hsl(${(ball.hue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = ctx.fillStyle;
                    ctx.beginPath();
                    ctx.arc(arcX, ball.y, 12 * config.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            });
        }
    },
    {
        id: 37,
        name: '🌸 Cherry Blossom',
        audio: "/sounds/ambient.mp3",
        config: {
            branchCount: 8,
            blossomCount: 60,
            growSpeed: 2,
            swaySpeed: 0.02,
            swayAmount: 30,
            baseHue: 330,
            trailColor: 'rgba(255, 245, 250, 0.05)',
            saturation: 65,
            lightness: 75
        },
        init: (canvas, config) => {
            const branches = [];
            const centerX = canvas.width / 2;
            const centerY = canvas.height;

            for (let i = 0; i < config.branchCount; i++) {
                const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI / 3;
                branches.push({
                    x: centerX,
                    y: centerY,
                    angle,
                    length: 0,
                    maxLength: 100 + Math.random() * 100,
                    blossoms: []
                });
            }
            return { branches, sway: 0 };
        },
        animate: (ctx, canvas, config, state) => {
            ctx.fillStyle = config.trailColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            state.sway += config.swaySpeed * config.speed;

            state.branches.forEach(branch => {
                if (branch.length < branch.maxLength) {
                    branch.length += config.growSpeed * config.speed;

                    if (branch.length >= branch.maxLength && branch.blossoms.length === 0) {
                        const blossomPerBranch = Math.floor(config.blossomCount / config.branchCount);
                        for (let i = 0; i < blossomPerBranch; i++) {
                            const progress = Math.random();
                            branch.blossoms.push({
                                progress,
                                offsetX: (Math.random() - 0.5) * 20,
                                phase: Math.random() * Math.PI * 2
                            });
                        }
                    }
                }

                const endX = branch.x + Math.cos(branch.angle) * branch.length * config.size;
                const endY = branch.y + Math.sin(branch.angle) * branch.length * config.size;

                ctx.strokeStyle = `hsl(${(30 + config.hueShift) % 360}, 40%, 30%)`;
                ctx.lineWidth = 4 * config.size;
                ctx.beginPath();
                ctx.moveTo(branch.x, branch.y);
                ctx.lineTo(endX, endY);
                ctx.stroke();

                branch.blossoms.forEach(blossom => {
                    const blossomX = branch.x + Math.cos(branch.angle) * branch.length * blossom.progress * config.size + 
                                    blossom.offsetX + Math.sin(state.sway + blossom.phase) * config.swayAmount;
                    const blossomY = branch.y + Math.sin(branch.angle) * branch.length * blossom.progress * config.size;

                    for (let p = 0; p < 5; p++) {
                        const petalAngle = (Math.PI * 2 / 5) * p;
                        const px = blossomX + Math.cos(petalAngle) * 5 * config.size;
                        const py = blossomY + Math.sin(petalAngle) * 5 * config.size;

                        ctx.fillStyle = `hsl(${(config.baseHue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
                        ctx.beginPath();
                        ctx.arc(px, py, 4 * config.size, 0, Math.PI * 2);
                        ctx.fill();
                    }

                    ctx.fillStyle = `hsl(${(config.baseHue + 30 + config.hueShift) % 360}, 80%, 50%)`;
                    ctx.beginPath();
                    ctx.arc(blossomX, blossomY, 2 * config.size, 0, Math.PI * 2);
                    ctx.fill();
                });
            });
        }
    },
    {
        id: 38,
        name: '⚛️ Atom Spin',
        audio: "/sounds/ambient.mp3",
        config: {
            electrons: 12,
            orbitRadius: 100,
            orbitSpeed: 0.03,
            nucleusSize: 20,
            electronSize: 6,
            baseHue: 190,
            trailColor: 'rgba(0, 10, 20, 0.1)',
            saturation: 75,
            lightness: 65
        },
        init: (canvas, config) => {
            const electrons = [];
            for (let i = 0; i < config.electrons; i++) {
                electrons.push({
                    angle: (Math.PI * 2 / config.electrons) * i,
                    orbitAngle: (Math.PI / 3) * (i % 3),
                    speed: config.orbitSpeed * (1 + (i % 3) * 0.5)
                });
            }
            return {
                centerX: canvas.width / 2,
                centerY: canvas.height / 2,
                electrons,
                nucleusRotation: 0
            };
        },
        animate: (ctx, canvas, config, state) => {
            ctx.fillStyle = config.trailColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            state.nucleusRotation += 0.02 * config.speed;

            // Draw orbit paths
            for (let i = 0; i < 3; i++) {
                const orbitAngle = (Math.PI / 3) * i;
                ctx.save();
                ctx.translate(state.centerX, state.centerY);
                ctx.rotate(orbitAngle);
                ctx.strokeStyle = `hsla(${(config.baseHue + config.hueShift) % 360}, 30%, 50%, 0.3)`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.ellipse(0, 0, config.orbitRadius * config.size, config.orbitRadius * 0.3 * config.size, 0, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
            }

            // Draw nucleus
            ctx.save();
            ctx.translate(state.centerX, state.centerY);
            ctx.rotate(state.nucleusRotation);
            for (let i = 0; i < 3; i++) {
                const angle = (Math.PI * 2 / 3) * i;
                const x = Math.cos(angle) * config.nucleusSize * 0.3 * config.size;
                const y = Math.sin(angle) * config.nucleusSize * 0.3 * config.size;
                
                ctx.fillStyle = `hsl(${(config.baseHue + 120 + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
                ctx.shadowBlur = 15;
                ctx.shadowColor = ctx.fillStyle;
                ctx.beginPath();
                ctx.arc(x, y, config.nucleusSize * 0.5 * config.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }
            ctx.restore();

            // Draw electrons
            state.electrons.forEach((electron, i) => {
                electron.angle += electron.speed * config.speed;

                ctx.save();
                ctx.translate(state.centerX, state.centerY);
                ctx.rotate(electron.orbitAngle);

                const x = Math.cos(electron.angle) * config.orbitRadius * config.size;
                const y = Math.sin(electron.angle) * config.orbitRadius * 0.3 * config.size;

                ctx.fillStyle = `hsl(${(config.baseHue + i * 30 + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
                ctx.shadowBlur = 10;
                ctx.shadowColor = ctx.fillStyle;
                ctx.beginPath();
                ctx.arc(x, y, config.electronSize * config.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;

                ctx.restore();
            });
        }
    },
    {
        id: 39,
        name: '🎨 Color Morph',
        audio: "/sounds/ambient.mp3",
        config: {
            gridSize: 20,
            morphSpeed: 0.02,
            baseHue: 0,
            trailColor: 'rgba(0, 0, 0, 0.05)',
            saturation: 75,
            lightness: 65
        },
        init: (canvas, config) => {
            const cells = [];
            const cols = Math.floor(canvas.width / config.gridSize);
            const rows = Math.floor(canvas.height / config.gridSize);

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    cells.push({
                        x: i * config.gridSize,
                        y: j * config.gridSize,
                        phase: (i + j) * 0.5
                    });
                }
            }
            return { cells, time: 0 };
        },
        animate: (ctx, canvas, config, state) => {
            ctx.fillStyle = config.trailColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            state.time += config.morphSpeed * config.speed;

            state.cells.forEach(cell => {
                const wave1 = Math.sin(state.time + cell.phase);
                const wave2 = Math.cos(state.time * 0.7 + cell.phase * 1.3);
                const brightness = (wave1 * wave2 + 1) / 2;
                const hue = (state.time * 50 + cell.phase * 30) % 360;

                ctx.fillStyle = `hsl(${(hue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness * brightness}%)`;
                ctx.fillRect(cell.x, cell.y, config.gridSize, config.gridSize);
            });
        }
    },
    {
        id: 40,
        name: '🌙 Eclipse',
        audio: "/sounds/ambient.mp3",
        config: {
            sunSize: 80,
            moonSize: 85,
            orbitRadius: 150,
            orbitSpeed: 0.01,
            coronaSize: 100,
            baseHue: 40,
            trailColor: 'rgba(5, 5, 15, 0.1)',
            saturation: 70,
            lightness: 65
        },
        init: (canvas, config) => {
            return {
                centerX: canvas.width / 2,
                centerY: canvas.height / 2,
                moonAngle: 0
            };
        },
        animate: (ctx, canvas, config, state) => {
            ctx.fillStyle = config.trailColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            state.moonAngle += config.orbitSpeed * config.speed;

            const moonX = state.centerX + Math.cos(state.moonAngle) * config.orbitRadius * config.size;
            const moonY = state.centerY + Math.sin(state.moonAngle) * config.orbitRadius * config.size;

            // Sun corona
            const gradient = ctx.createRadialGradient(state.centerX, state.centerY, config.sunSize * config.size, 
                                                     state.centerX, state.centerY, config.coronaSize * config.size);
            gradient.addColorStop(0, `hsl(${(config.baseHue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`);
            gradient.addColorStop(1, `hsla(${(config.baseHue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.shadowBlur = 40;
            ctx.shadowColor = `hsl(${(config.baseHue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
            ctx.beginPath();
            ctx.arc(state.centerX, state.centerY, config.coronaSize * config.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Sun
            ctx.fillStyle = `hsl(${(config.baseHue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
            ctx.beginPath();
            ctx.arc(state.centerX, state.centerY, config.sunSize * config.size, 0, Math.PI * 2);
            ctx.fill();

            // Moon
            ctx.fillStyle = `hsl(${(220 + config.hueShift) % 360}, 20%, 30%)`;
            ctx.beginPath();
            ctx.arc(moonX, moonY, config.moonSize * config.size, 0, Math.PI * 2);
            ctx.fill();
        }
    },
    {
        id: 41,
        name: '🎯 Target Practice',
        audio: "/sounds/ambient.mp3",
        config: {
            rings: 8,
            pulseSpeed: 0.05,
            rotationSpeed: 0.01,
            baseHue: 0,
            trailColor: 'rgba(0, 0, 0, 0.1)',
            saturation: 75,
            lightness: 65
        },
        init: (canvas, config) => {
            return {
                centerX: canvas.width / 2,
                centerY: canvas.height / 2,
                pulse: 0,
                rotation: 0
            };
        },
        animate: (ctx, canvas, config, state) => {
            ctx.fillStyle = config.trailColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            state.pulse += config.pulseSpeed * config.speed;
            state.rotation += config.rotationSpeed * config.speed;

            for (let i = config.rings; i > 0; i--) {
                const pulseOffset = Math.sin(state.pulse + i * 0.3) * 15;
                const radius = (i * 25 + pulseOffset) * config.size;

                ctx.save();
                ctx.translate(state.centerX, state.centerY);
                ctx.rotate(state.rotation * i);

                const gradient = ctx.createRadialGradient(0, 0, radius * 0.8, 0, 0, radius);
                gradient.addColorStop(0, `hsla(${((360 / config.rings) * i + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%, 0)`);
                gradient.addColorStop(1, `hsl(${((360 / config.rings) * i + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`);

                ctx.strokeStyle = gradient;
                ctx.lineWidth = 20 * config.size;
                ctx.beginPath();
                ctx.arc(0, 0, radius, 0, Math.PI * 2);
                ctx.stroke();

                ctx.restore();
            }

            // Center dot
            ctx.fillStyle = `hsl(${config.hueShift % 360}, ${config.saturation}%, ${config.lightness}%)`;
            ctx.shadowBlur = 20;
            ctx.shadowColor = ctx.fillStyle;
            ctx.beginPath();
            ctx.arc(state.centerX, state.centerY, 10 * config.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    },
    {
        id: 42,
        name: '🌊 Quantum Waves',
        audio: "/sounds/ambient.mp3",
        config: {
            particleCount: 80,
            waveLength: 100,
            amplitude: 80,
            speed: 2,
            connectionDistance: 120,
            baseHue: 180,
            trailColor: 'rgba(0, 15, 30, 0.1)',
            saturation: 70,
            lightness: 65
        },
        init: (canvas, config) => {
            const particles = [];
            for (let i = 0; i < config.particleCount; i++) {
                particles.push({
                    x: (canvas.width / config.particleCount) * i,
                    baseY: canvas.height / 2,
                    phase: i * 0.2
                });
            }
            return { particles, time: 0 };
        },
        animate: (ctx, canvas, config, state) => {
            ctx.fillStyle = config.trailColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            state.time += config.speed * 0.05 * config.speed;

            state.particles.forEach((p, i) => {
                const wave = Math.sin(state.time + p.phase) * config.amplitude * config.size;
                p.y = p.baseY + wave;

                // Draw connections
                if (i < state.particles.length - 1) {
                    const next = state.particles[i + 1];
                    const nextWave = Math.sin(state.time + next.phase) * config.amplitude * config.size;
                    next.y = next.baseY + nextWave;

                    const dist = Math.sqrt((next.x - p.x) ** 2 + (next.y - p.y) ** 2);
                    if (dist < config.connectionDistance * config.size) {
                        ctx.strokeStyle = `hsla(${(config.baseHue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%, ${1 - dist / (config.connectionDistance * config.size)})`;
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(next.x, next.y);
                        ctx.stroke();
                    }
                }

                // Draw particle
                ctx.fillStyle = `hsl(${(config.baseHue + i * 3 + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
                ctx.shadowBlur = 10;
                ctx.shadowColor = ctx.fillStyle;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 4 * config.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            });
        }
    },
    {
        id: 43,
        name: '🎪 Spinning Tops',
        audio: "/sounds/ambient.mp3",
        config: {
            topCount: 9,
            spinSpeed: 0.15,
            wobbleAmount: 0.1,
            baseSize: 20,
            baseHue: 0,
            trailColor: 'rgba(20, 20, 30, 0.1)',
            saturation: 75,
            lightness: 65
        },
        init: (canvas, config) => {
            const tops = [];
            const cols = 3;
            const rows = 3;

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    tops.push({
                        x: (canvas.width / cols) * i + canvas.width / (cols * 2),
                        y: (canvas.height / rows) * j + canvas.height / (rows * 2),
                        rotation: 0,
                        wobble: 0,
                        hue: (360 / config.topCount) * (i * cols + j)
                    });
                }
            }
            return { tops };
        },
        animate: (ctx, canvas, config, state) => {
            ctx.fillStyle = config.trailColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            state.tops.forEach(top => {
                top.rotation += config.spinSpeed * config.speed;
                top.wobble = Math.sin(top.rotation * 2) * config.wobbleAmount;

                ctx.save();
                ctx.translate(top.x, top.y);
                ctx.rotate(top.rotation);
                ctx.scale(1 + top.wobble, 1 - top.wobble);

                // Top body
                const gradient = ctx.createLinearGradient(0, -config.baseSize * config.size, 0, config.baseSize * config.size);
                gradient.addColorStop(0, `hsl(${(top.hue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness + 15}%)`);
                gradient.addColorStop(1, `hsl(${(top.hue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness - 15}%)`);

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.moveTo(0, -config.baseSize * config.size);
                ctx.lineTo(config.baseSize * 0.7 * config.size, config.baseSize * config.size);
                ctx.lineTo(-config.baseSize * 0.7 * config.size, config.baseSize * config.size);
                ctx.closePath();
                ctx.fill();

                // Stripes
                for (let i = 0; i < 3; i++) {
                    ctx.strokeStyle = `hsl(${(top.hue + 180 + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
                    ctx.lineWidth = 2;
                    const y = -config.baseSize * config.size + (i + 1) * (config.baseSize * 2 * config.size / 4);
                    const width = config.baseSize * (1 - (i + 1) * 0.2) * config.size;
                    ctx.beginPath();
                    ctx.moveTo(-width, y);
                    ctx.lineTo(width, y);
                    ctx.stroke();
                }

                ctx.restore();
            });
        }
    },
    {
        id: 44,
        name: '🌟 Supernova',
        audio: "/sounds/ambient.mp3",
        config: {
            particleCount: 200,
            expansionSpeed: 3,
            maxRadius: 250,
            baseHue: 40,
            trailColor: 'rgba(0, 0, 5, 0.15)',
            saturation: 85,
            lightness: 70
        },
        init: (canvas, config) => {
            return {
                centerX: canvas.width / 2,
                centerY: canvas.height / 2,
                particles: [],
                expanding: false,
                timer: 0
            };
        },
        animate: (ctx, canvas, config, state) => {
            ctx.fillStyle = config.trailColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            state.timer++;

            if (state.timer % 180 === 0) {
                state.expanding = true;
                state.particles = [];
                for (let i = 0; i < config.particleCount; i++) {
                    const angle = (Math.PI * 2 / config.particleCount) * i;
                    state.particles.push({
                        angle,
                        speed: config.expansionSpeed * (0.5 + Math.random() * 0.5),
                        radius: 0,
                        hue: config.baseHue + Math.random() * 60,
                        size: 2 + Math.random() * 4
                    });
                }
            }

            if (state.expanding) {
                let allGone = true;

                state.particles.forEach(p => {
                    p.radius += p.speed * config.speed;

                    if (p.radius < config.maxRadius * config.size) {
                        allGone = false;
                        const x = state.centerX + Math.cos(p.angle) * p.radius;
                        const y = state.centerY + Math.sin(p.angle) * p.radius;
                        const alpha = 1 - p.radius / (config.maxRadius * config.size);

                        ctx.fillStyle = `hsla(${(p.hue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%, ${alpha})`;
                        ctx.shadowBlur = 15;
                        ctx.shadowColor = ctx.fillStyle;
                        ctx.beginPath();
                        ctx.arc(x, y, p.size * config.size * alpha, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.shadowBlur = 0;
                    }
                });

                if (allGone) state.expanding = false;
            }

            // Core
            const coreSize = state.expanding ? 30 : 15 + Math.sin(state.timer * 0.1) * 5;
            ctx.fillStyle = `hsl(${(config.baseHue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
            ctx.shadowBlur = 40;
            ctx.shadowColor = ctx.fillStyle;
            ctx.beginPath();
            ctx.arc(state.centerX, state.centerY, coreSize * config.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    },
    {
        id: 45,
        name: '🎨 Ink Drop',
        audio: "/sounds/ambient.mp3",
        config: {
            dropChance: 0.02,
            maxRadius: 200,
            expansionSpeed: 2,
            particleCount: 40,
            baseHue: 260,
            trailColor: 'rgba(245, 245, 250, 0.05)',
            saturation: 70,
            lightness: 65
        },
        init: (canvas, config) => {
            return { drops: [] };
        },
        animate: (ctx, canvas, config, state) => {
            ctx.fillStyle = config.trailColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (Math.random() < config.dropChance * config.speed) {
                const drop = {
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: 0,
                    hue: Math.random() * 360,
                    particles: []
                };

                for (let i = 0; i < config.particleCount; i++) {
                    const angle = (Math.PI * 2 / config.particleCount) * i;
                    drop.particles.push({
                        angle,
                        distance: 0,
                        speed: config.expansionSpeed * (0.8 + Math.random() * 0.4)
                    });
                }

                state.drops.push(drop);
            }

            state.drops = state.drops.filter(drop => {
                drop.radius += config.expansionSpeed * config.speed;

                drop.particles.forEach(p => {
                    p.distance += p.speed * config.speed;

                    const x = drop.x + Math.cos(p.angle) * p.distance;
                    const y = drop.y + Math.sin(p.angle) * p.distance;
                    const alpha = 1 - p.distance / (config.maxRadius * config.size);

                    if (alpha > 0) {
                        ctx.fillStyle = `hsla(${(drop.hue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%, ${alpha})`;
                        ctx.beginPath();
                        ctx.arc(x, y, 3 * config.size, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });

                const alpha = 1 - drop.radius / (config.maxRadius * config.size);
                if (alpha > 0) {
                    ctx.globalAlpha = alpha * 0.3;
                    ctx.fillStyle = `hsl(${(drop.hue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
                    ctx.beginPath();
                    ctx.arc(drop.x, drop.y, drop.radius, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.globalAlpha = 1;
                }

                return drop.radius < config.maxRadius * config.size;
            });
        }
    },
    {
        id: 46,
        name: '🌈 Rainbow Tunnel',
        audio: "/sounds/ambient.mp3",
        config: {
            rings: 30,
            rotationSpeed: 0.02,
            pulseSpeed: 0.05,
            baseHue: 0,
            trailColor: 'rgba(0, 0, 0, 0.1)',
            saturation: 80,
            lightness: 65
        },
        init: (canvas, config) => {
            return {
                centerX: canvas.width / 2,
                centerY: canvas.height / 2,
                rotation: 0,
                pulse: 0
            };
        },
        animate: (ctx, canvas, config, state) => {
            ctx.fillStyle = config.trailColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            state.rotation += config.rotationSpeed * config.speed;
            state.pulse += config.pulseSpeed * config.speed;

            for (let i = config.rings; i > 0; i--) {
                const scale = i / config.rings;
                const radius = 200 * scale * config.size;
                const pulseOffset = Math.sin(state.pulse + i * 0.2) * 20;

                ctx.save();
                ctx.translate(state.centerX, state.centerY);
                ctx.rotate(state.rotation * scale);

                const hue = ((360 / config.rings) * i + state.rotation * 100 + config.hueShift) % 360;
                ctx.strokeStyle = `hsl(${hue}, ${config.saturation}%, ${config.lightness}%)`;
                ctx.lineWidth = 15 * config.size;
                ctx.shadowBlur = 20;
                ctx.shadowColor = ctx.strokeStyle;
                ctx.beginPath();
                ctx.arc(0, 0, radius + pulseOffset, 0, Math.PI * 2);
                ctx.stroke();
                ctx.shadowBlur = 0;

                ctx.restore();
            }
        }
    },
    {
        id: 47,
        name: '🦋 Morphing Butterfly',
        audio: "/sounds/ambient.mp3",
        config: {
            wingSegments: 20,
            flapSpeed: 0.1,
            morphSpeed: 0.02,
            baseSize: 60,
            baseHue: 290,
            trailColor: 'rgba(240, 230, 255, 0.08)',
            saturation: 75,
            lightness: 70
        },
        init: (canvas, config) => {
            return {
                centerX: canvas.width / 2,
                centerY: canvas.height / 2,
                flap: 0,
                morph: 0
            };
        },
        animate: (ctx, canvas, config, state) => {
            ctx.fillStyle = config.trailColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            state.flap += config.flapSpeed * config.speed;
            state.morph += config.morphSpeed * config.speed;

            const flapAmount = Math.sin(state.flap) * 0.5 + 0.5;
            const morphAmount = Math.sin(state.morph) * 0.3 + 1;

            // Left wing
            ctx.beginPath();
            ctx.moveTo(state.centerX, state.centerY);
            for (let i = 0; i <= config.wingSegments; i++) {
                const angle = -Math.PI / 2 + (Math.PI / config.wingSegments) * i;
                const distance = config.baseSize * config.size * flapAmount * morphAmount;
                const x = state.centerX + Math.cos(angle) * distance * (1 + Math.sin(i * 0.5) * 0.3);
                const y = state.centerY + Math.sin(angle) * distance;
                ctx.lineTo(x, y);
            }
            ctx.closePath();

            const gradient1 = ctx.createRadialGradient(state.centerX, state.centerY, 0, state.centerX, state.centerY, config.baseSize * config.size);
            gradient1.addColorStop(0, `hsl(${(config.baseHue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`);
            gradient1.addColorStop(1, `hsl(${(config.baseHue + 60 + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness - 20}%)`);
            ctx.fillStyle = gradient1;
            ctx.fill();

            // Right wing
            ctx.beginPath();
            ctx.moveTo(state.centerX, state.centerY);
            for (let i = 0; i <= config.wingSegments; i++) {
                const angle = -Math.PI / 2 - (Math.PI / config.wingSegments) * i;
                const distance = config.baseSize * config.size * flapAmount * morphAmount;
                const x = state.centerX + Math.cos(angle) * distance * (1 + Math.sin(i * 0.5) * 0.3);
                const y = state.centerY + Math.sin(angle) * distance;
                ctx.lineTo(x, y);
            }
            ctx.closePath();

            const gradient2 = ctx.createRadialGradient(state.centerX, state.centerY, 0, state.centerX, state.centerY, config.baseSize * config.size);
            gradient2.addColorStop(0, `hsl(${(config.baseHue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`);
            gradient2.addColorStop(1, `hsl(${(config.baseHue + 60 + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness - 20}%)`);
            ctx.fillStyle = gradient2;
            ctx.fill();

            // Body
            ctx.fillStyle = `hsl(${(config.baseHue + 120 + config.hueShift) % 360}, 50%, 40%)`;
            ctx.beginPath();
            ctx.ellipse(state.centerX, state.centerY, 5 * config.size, 20 * config.size, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    },
    {
        id: 48,
        name: '⚡ Electric Field',
        audio: "/sounds/ambient.mp3",
        config: {
            particleCount: 100,
            chargePoints: 3,
            attractionForce: 0.5,
            maxSpeed: 3,
            baseHue: 190,
            trailColor: 'rgba(0, 5, 15, 0.1)',
            saturation: 80,
            lightness: 70
        },
        init: (canvas, config) => {
            const particles = [];
            const charges = [];

            for (let i = 0; i < config.chargePoints; i++) {
                charges.push({
                    x: (canvas.width / (config.chargePoints + 1)) * (i + 1),
                    y: canvas.height / 2,
                    polarity: i % 2 === 0 ? 1 : -1
                });
            }

            for (let i = 0; i < config.particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: 0,
                    vy: 0,
                    charge: Math.random() > 0.5 ? 1 : -1
                });
            }

            return { particles, charges };
        },
        animate: (ctx, canvas, config, state) => {
            ctx.fillStyle = config.trailColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw charges
            state.charges.forEach(charge => {
                ctx.fillStyle = charge.polarity > 0 ? 
                    `hsl(${(config.baseHue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)` :
                    `hsl(${(config.baseHue + 180 + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
                ctx.shadowBlur = 30;
                ctx.shadowColor = ctx.fillStyle;
                ctx.beginPath();
                ctx.arc(charge.x, charge.y, 15 * config.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            });

            // Update particles
            state.particles.forEach(p => {
                p.vx *= 0.95;
                p.vy *= 0.95;

                state.charges.forEach(charge => {
                    const dx = charge.x - p.x;
                    const dy = charge.y - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist > 1) {
                        const force = (charge.polarity * p.charge * config.attractionForce) / (dist * dist);
                        p.vx += (dx / dist) * force * config.speed;
                        p.vy += (dy / dist) * force * config.speed;
                    }
                });

                const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                if (speed > config.maxSpeed) {
                    p.vx = (p.vx / speed) * config.maxSpeed;
                    p.vy = (p.vy / speed) * config.maxSpeed;
                }

                p.x += p.vx * config.speed;
                p.y += p.vy * config.speed;

                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                const hue = p.charge > 0 ? config.baseHue : config.baseHue + 180;
                ctx.fillStyle = `hsl(${(hue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 3 * config.size, 0, Math.PI * 2);
                ctx.fill();
            });
        }
    },
    {
        id: 49,
        name: '🌸 Lotus Bloom',
        audio: "/sounds/ambient.mp3",
        config: {
            petals: 12,
            layers: 4,
            bloomSpeed: 0.01,
            rotationSpeed: 0.005,
            baseSize: 15,
            baseHue: 320,
            trailColor: 'rgba(255, 240, 250, 0.05)',
            saturation: 70,
            lightness: 75
        },
        init: (canvas, config) => {
            return {
                centerX: canvas.width / 2,
                centerY: canvas.height / 2,
                bloom: 0,
                rotation: 0
            };
        },
        animate: (ctx, canvas, config, state) => {
            ctx.fillStyle = config.trailColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            state.bloom += config.bloomSpeed * config.speed;
            state.rotation += config.rotationSpeed * config.speed;
            const bloomScale = Math.sin(state.bloom * Math.PI) * 0.5 + 0.5;

            for (let layer = config.layers - 1; layer >= 0; layer--) {
                const layerProgress = (layer + 1) / config.layers;
                const layerRotation = state.rotation + layer * 0.1;

                for (let i = 0; i < config.petals; i++) {
                    const angle = (Math.PI * 2 / config.petals) * i + layerRotation;
                    const distance = (40 + layer * 20) * config.size * bloomScale;
                    const x = state.centerX + Math.cos(angle) * distance;
                    const y = state.centerY + Math.sin(angle) * distance;

                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(angle);
                    ctx.scale(bloomScale, bloomScale);

                    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, config.baseSize * config.size);
                    gradient.addColorStop(0, `hsl(${(config.baseHue + layer * 10 + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`);
                    gradient.addColorStop(1, `hsla(${(config.baseHue + layer * 10 + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness - 20}%, 0.5)`);

                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.ellipse(0, 0, config.baseSize * config.size * layerProgress, config.baseSize * 0.6 * config.size * layerProgress, 0, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.restore();
                }
            }

            // Center
            const gradient = ctx.createRadialGradient(state.centerX, state.centerY, 0, state.centerX, state.centerY, 20 * config.size * bloomScale);
            gradient.addColorStop(0, `hsl(${(config.baseHue + 180 + config.hueShift) % 360}, 80%, 60%)`);
            gradient.addColorStop(1, `hsl(${(config.baseHue + 180 + config.hueShift) % 360}, 80%, 40%)`);
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(state.centerX, state.centerY, 15 * config.size * bloomScale, 0, Math.PI * 2);
            ctx.fill();
        }
    },
    {
        id: 50,
        name: '🎆 Particle Fountain',
        audio: "/sounds/ambient.mp3",
        config: {
            emissionRate: 5,
            gravity: 0.2,
            initialVelocity: 12,
            spread: 1.5,
            lifetime: 100,
            baseHue: 50,
            trailColor: 'rgba(0, 0, 10, 0.15)',
            saturation: 80,
            lightness: 65
        },
        init: (canvas, config) => {
            return {
                particles: [],
                emitterX: canvas.width / 2,
                emitterY: canvas.height - 50
            };
        },
        animate: (ctx, canvas, config, state) => {
            ctx.fillStyle = config.trailColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Emit particles
            for (let i = 0; i < config.emissionRate * config.speed; i++) {
                const angle = -Math.PI / 2 + (Math.random() - 0.5) * config.spread;
                const speed = config.initialVelocity * (0.8 + Math.random() * 0.4);
                
                state.particles.push({
                    x: state.emitterX,
                    y: state.emitterY,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    life: config.lifetime,
                    hue: config.baseHue + Math.random() * 60,
                    size: 2 + Math.random() * 3
                });
            }

            // Update particles
            state.particles = state.particles.filter(p => {
                p.vy += config.gravity * config.speed;
                p.x += p.vx * config.speed;
                p.y += p.vy * config.speed;
                p.life -= config.speed;

                const alpha = p.life / config.lifetime;

                ctx.fillStyle = `hsla(${(p.hue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%, ${alpha})`;
                ctx.shadowBlur = 10;
                ctx.shadowColor = ctx.fillStyle;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * config.size * alpha, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;

                return p.life > 0 && p.y < canvas.height;
            });
        }
    },
    {
        id: 51,
        name: '🌀 Double Helix',
        audio: "/sounds/ambient.mp3",
        config: {
            points: 100,
            amplitude: 60,
            frequency: 0.08,
            scrollSpeed: 2,
            connectionInterval: 8,
            baseHue: 200,
            trailColor: 'rgba(0, 15, 25, 0.1)',
            saturation: 75,
            lightness: 65
        },
        init: (canvas, config) => {
            return { offset: 0 };
        },
        animate: (ctx, canvas, config, state) => {
            ctx.fillStyle = config.trailColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            state.offset += config.scrollSpeed * config.speed;

            const points1 = [];
            const points2 = [];

            for (let i = 0; i < config.points; i++) {
                const x = (canvas.width / config.points) * i;
                const wave1 = Math.sin(i * config.frequency + state.offset * 0.02) * config.amplitude * config.size;
                const wave2 = Math.sin(i * config.frequency + state.offset * 0.02 + Math.PI) * config.amplitude * config.size;
                const y1 = canvas.height / 2 + wave1;
                const y2 = canvas.height / 2 + wave2;

                points1.push({ x, y: y1 });
                points2.push({ x, y: y2 });

                // Draw spheres
                ctx.fillStyle = `hsl(${(config.baseHue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
                ctx.shadowBlur = 10;
                ctx.shadowColor = ctx.fillStyle;
                ctx.beginPath();
                ctx.arc(x, y1, 5 * config.size, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = `hsl(${(config.baseHue + 120 + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
                ctx.shadowColor = ctx.fillStyle;
                ctx.beginPath();
                ctx.arc(x, y2, 5 * config.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;

                // Draw connections
                if (i % config.connectionInterval === 0) {
                    ctx.strokeStyle = `hsla(${(config.baseHue + 60 + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%, 0.5)`;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(x, y1);
                    ctx.lineTo(x, y2);
                    ctx.stroke();
                }
            }
        }
    },
    {
        id: 52,
        name: '🎪 Pendulum Wave',
        audio: "/sounds/ambient.mp3",
        config: {
            pendulumCount: 20,
            baseLength: 80,
            lengthIncrement: 5,
            baseSpeed: 0.02,
            speedIncrement: 0.001,
            ballSize: 8,
            baseHue: 200,
            trailColor: 'rgba(30, 30, 40, 0.08)',
            saturation: 75,
            lightness: 65
        },
        init: (canvas, config) => {
            const pendulums = [];
            for (let i = 0; i < config.pendulumCount; i++) {
                pendulums.push({
                    x: (canvas.width / (config.pendulumCount + 1)) * (i + 1),
                    length: (config.baseLength + i * config.lengthIncrement) * config.size,
                    angle: Math.PI / 4,
                    speed: config.baseSpeed + i * config.speedIncrement,
                    hue: (360 / config.pendulumCount) * i
                });
            }
            return { pendulums };
        },
        animate: (ctx, canvas, config, state) => {
            ctx.fillStyle = config.trailColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            state.pendulums.forEach(pendulum => {
                pendulum.angle = Math.sin(Date.now() * pendulum.speed * config.speed * 0.001) * Math.PI / 4;

                const pivotY = 50;
                const ballX = pendulum.x + Math.sin(pendulum.angle) * pendulum.length;
                const ballY = pivotY + Math.cos(pendulum.angle) * pendulum.length;

                // Draw string
                ctx.strokeStyle = `hsla(${(pendulum.hue + config.hueShift) % 360}, 40%, 60%, 0.5)`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(pendulum.x, pivotY);
                ctx.lineTo(ballX, ballY);
                ctx.stroke();

                // Draw pivot
                ctx.fillStyle = `hsl(${(pendulum.hue + config.hueShift) % 360}, 50%, 50%)`;
                ctx.beginPath();
                ctx.arc(pendulum.x, pivotY, 4 * config.size, 0, Math.PI * 2);
                ctx.fill();

                // Draw ball
                ctx.fillStyle = `hsl(${(pendulum.hue + config.hueShift) % 360}, ${config.saturation}%, ${config.lightness}%)`;
                ctx.shadowBlur = 15;
                ctx.shadowColor = ctx.fillStyle;
                ctx.beginPath();
                ctx.arc(ballX, ballY, config.ballSize * config.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            });
        }
    },
   
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
             
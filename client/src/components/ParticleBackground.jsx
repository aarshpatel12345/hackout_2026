import React, { useEffect, useRef } from "react";

export default function ParticleBackground() {
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		let animationFrameId;

		let width = (canvas.width = window.innerWidth);
		let height = (canvas.height = window.innerHeight);

		const handleResize = () => {
			if (!canvas) return;
			width = canvas.width = window.innerWidth;
			height = canvas.height = window.innerHeight;
		};

		window.addEventListener("resize", handleResize);

		// Particles configuration
		const particleCount = Math.floor((width * height) / 12000);
		const particles = [];

		for (let i = 0; i < particleCount; i++) {
			particles.push({
				x: Math.random() * width,
				y: Math.random() * height,
				vx: (Math.random() - 0.5) * 0.4,
				vy: (Math.random() - 0.5) * 0.4,
				radius: Math.random() * 1.8 + 0.8,
				baseAlpha: Math.random() * 0.6 + 0.2,
				pulseSpeed: Math.random() * 0.02 + 0.005,
				phase: Math.random() * Math.PI * 2,
			});
		}

		// Globe rotation angle
		let globeRotation = 0;

		const render = () => {
			ctx.clearRect(0, 0, width, height);

			// Dark background gradient
			const bgGradient = ctx.createRadialGradient(
				width * 0.5,
				height * 0.5,
				0,
				width * 0.5,
				height * 0.5,
				Math.max(width, height)
			);
			bgGradient.addColorStop(0, "#051310");
			bgGradient.addColorStop(0.6, "#030a08");
			bgGradient.addColorStop(1, "#020504");
			ctx.fillStyle = bgGradient;
			ctx.fillRect(0, 0, width, height);

			// Draw ambient glow on right side (globe area)
			const globeCenterX = width > 1024 ? width * 0.85 : width * 0.9;
			const globeCenterY = height * 0.65;
			const globeRadius = Math.min(width, height) * 0.42;

			const globeGlow = ctx.createRadialGradient(
				globeCenterX,
				globeCenterY,
				globeRadius * 0.1,
				globeCenterX,
				globeCenterY,
				globeRadius * 1.6
			);
			globeGlow.addColorStop(0, "rgba(32, 214, 138, 0.18)");
			globeGlow.addColorStop(0.5, "rgba(16, 185, 129, 0.06)");
			globeGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
			ctx.fillStyle = globeGlow;
			ctx.fillRect(0, 0, width, height);

			// Update and draw floating constellation particles
			for (let i = 0; i < particles.length; i++) {
				const p = particles[i];
				p.x += p.vx;
				p.y += p.vy;

				if (p.x < 0) p.x = width;
				if (p.x > width) p.x = 0;
				if (p.y < 0) p.y = height;
				if (p.y > height) p.y = 0;

				p.phase += p.pulseSpeed;
				const currentAlpha = p.baseAlpha + Math.sin(p.phase) * 0.2;

				ctx.beginPath();
				ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(32, 214, 138, ${Math.max(0.1, currentAlpha)})`;
				ctx.shadowBlur = 8;
				ctx.shadowColor = "rgba(32, 214, 138, 0.8)";
				ctx.fill();
				ctx.shadowBlur = 0;

				// Connect close particles with translucent green lines
				for (let j = i + 1; j < particles.length; j++) {
					const p2 = particles[j];
					const dx = p.x - p2.x;
					const dy = p.y - p2.y;
					const dist = Math.sqrt(dx * dx + dy * dy);

					if (dist < 110) {
						const lineAlpha = (1 - dist / 110) * 0.18;
						ctx.beginPath();
						ctx.moveTo(p.x, p.y);
						ctx.lineTo(p2.x, p2.y);
						ctx.strokeStyle = `rgba(32, 214, 138, ${lineAlpha})`;
						ctx.lineWidth = 0.7;
						ctx.stroke();
					}
				}
			}

			// Render 3D Dotted Wireframe Globe
			globeRotation += 0.003;
			const latLines = 18;
			const lonLines = 28;

			ctx.save();
			ctx.shadowBlur = 12;
			ctx.shadowColor = "rgba(32, 214, 138, 0.6)";

			// Atmosphere outer glowing ring
			ctx.beginPath();
			ctx.arc(globeCenterX, globeCenterY, globeRadius, 0, Math.PI * 2);
			ctx.strokeStyle = "rgba(32, 214, 138, 0.3)";
			ctx.lineWidth = 1.2;
			ctx.stroke();

			// Latitude rings & points
			for (let i = 1; i < latLines; i++) {
				const latAngle = (i / latLines) * Math.PI - Math.PI / 2;
				const rLat = globeRadius * Math.cos(latAngle);
				const yLat = globeCenterY + globeRadius * Math.sin(latAngle);

				// Draw latitude ellipse curve
				ctx.beginPath();
				ctx.ellipse(
					globeCenterX,
					yLat,
					rLat,
					rLat * 0.26,
					0,
					0,
					Math.PI * 2
				);
				ctx.strokeStyle = "rgba(32, 214, 138, 0.12)";
				ctx.lineWidth = 0.8;
				ctx.stroke();

				// Dotted glowing points along longitude
				for (let j = 0; j < lonLines; j++) {
					const lonAngle = (j / lonLines) * Math.PI * 2 + globeRotation;
					const x = globeCenterX + rLat * Math.cos(lonAngle);
					const z = rLat * Math.sin(lonAngle);

					// Only draw points on front side of globe
					if (z > -globeRadius * 0.15) {
						const pointAlpha = Math.max(
							0.15,
							((z + globeRadius * 0.15) / (globeRadius * 1.15)) * 0.85
						);
						ctx.beginPath();
						ctx.arc(x, yLat, 1.3, 0, Math.PI * 2);
						ctx.fillStyle = `rgba(56, 217, 232, ${pointAlpha})`;
						ctx.fill();
					}
				}
			}

			// Longitude meridian curves
			for (let j = 0; j < lonLines / 2; j++) {
				const lonAngle = (j / (lonLines / 2)) * Math.PI + globeRotation;
				const rx = globeRadius * Math.cos(lonAngle);

				ctx.beginPath();
				ctx.ellipse(
					globeCenterX,
					globeCenterY,
					Math.abs(rx),
					globeRadius,
					0,
					0,
					Math.PI * 2
				);
				ctx.strokeStyle = "rgba(32, 214, 138, 0.1)";
				ctx.lineWidth = 0.8;
				ctx.stroke();
			}

			ctx.restore();

			animationFrameId = requestAnimationFrame(render);
		};

		render();

		return () => {
			window.removeEventListener("resize", handleResize);
			cancelAnimationFrame(animationFrameId);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			className="fixed inset-0 pointer-events-none z-0 w-full h-full"
		/>
	);
}

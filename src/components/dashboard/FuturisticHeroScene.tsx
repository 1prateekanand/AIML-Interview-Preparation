import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

export const FuturisticHeroScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { currentTheme } = useTheme();
  const [webGlSupported, setWebGlSupported] = useState<boolean>(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Verify WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl =
        testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      return;
    }

    let width = container.clientWidth || 900;
    let height = container.clientHeight || 320;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const isMobile = width < 768;
    const baseCameraZ = isMobile ? 6.2 : 4.6;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.35, baseCameraZ);
    camera.lookAt(0, 0.1, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Dynamic Theme Accent Colors
    const themeAccent = currentTheme.tokens.accent || '#10B981';
    const cyanHex = '#00f0ff';
    const tealHex = '#00d2b4';
    const blueHex = '#3b82f6';

    const accentColor = new THREE.Color(themeAccent);
    const cyanColor = new THREE.Color(cyanHex);
    const tealColor = new THREE.Color(tealHex);
    const blueColor = new THREE.Color(blueHex);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const primaryLight = new THREE.PointLight(cyanHex, 2.5, 12);
    primaryLight.position.set(0, 1.8, 2.5);
    scene.add(primaryLight);

    const secondaryLight = new THREE.PointLight(themeAccent, 2.2, 10);
    secondaryLight.position.set(-2, 1, 2);
    scene.add(secondaryLight);

    const rightRimLight = new THREE.PointLight(blueHex, 2.0, 10);
    rightRimLight.position.set(2.2, 0.5, 2);
    scene.add(rightRimLight);

    // Track all disposable resources for clean teardown
    const disposables: { dispose: () => void }[] = [];
    const register = <T extends { dispose: () => void }>(resource: T): T => {
      disposables.push(resource);
      return resource;
    };

    // =========================================================================
    // Helper: Texture Generators (Canvas)
    // =========================================================================
    // A. Front Face: Glowing Code Symbol < / >
    const createCodeSymbolTexture = () => {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 512;
      const ctx = c.getContext('2d');
      if (ctx) {
        // Deep cyber dark background
        ctx.fillStyle = 'rgba(4, 18, 24, 0.92)';
        ctx.fillRect(0, 0, 512, 512);

        // Subtle matrix code grid lines
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
        ctx.lineWidth = 1;
        for (let i = 24; i < 512; i += 32) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(512, i);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, 512);
          ctx.stroke();
        }

        // Inner glowing frame
        ctx.strokeStyle = cyanHex;
        ctx.lineWidth = 6;
        ctx.shadowColor = cyanHex;
        ctx.shadowBlur = 18;
        ctx.strokeRect(20, 20, 472, 472);

        // High-contrast glowing < / >
        ctx.shadowColor = themeAccent;
        ctx.shadowBlur = 32;
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 160px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('< / >', 256, 256);

        // Core cyan stroke on symbol
        ctx.strokeStyle = cyanHex;
        ctx.lineWidth = 4;
        ctx.strokeText('< / >', 256, 256);
      }
      const tex = new THREE.CanvasTexture(c);
      tex.needsUpdate = true;
      return register(tex);
    };

    // B. Side Faces: Streaming Code Texture
    const createSideCodeTexture = () => {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 512;
      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'rgba(3, 14, 20, 0.9)';
        ctx.fillRect(0, 0, 512, 512);

        ctx.strokeStyle = 'rgba(0, 210, 180, 0.2)';
        ctx.lineWidth = 1;
        ctx.strokeRect(16, 16, 480, 480);

        ctx.font = '16px "JetBrains Mono", monospace';
        const lines = [
          'import torch',
          'import torch.nn as nn',
          'class SelfAttention(nn.Module):',
          '  def __init__(self, embed_dim):',
          '    super().__init__()',
          '    self.q = nn.Linear(embed_dim, ...)',
          '    self.k = nn.Linear(embed_dim, ...)',
          '    self.v = nn.Linear(embed_dim, ...)',
          '  def forward(self, x):',
          '    scores = q @ k.transpose(-2, -1)',
          '    attn = softmax(scores / sqrt(d))',
          '    return attn @ v',
          '# nexus-core v2.4 initialized',
          '# status: 99.8% optimal weights',
          'tensor.to(device="cuda:0")',
          'loss.backward()',
        ];
        lines.forEach((line, idx) => {
          ctx.fillStyle = idx % 3 === 0 ? cyanHex : idx % 2 === 0 ? themeAccent : '#94a3b8';
          ctx.fillText(line, 36, 48 + idx * 28);
        });
      }
      const tex = new THREE.CanvasTexture(c);
      tex.needsUpdate = true;
      return register(tex);
    };

    // C. Floating Programming Code Panel Texture (with Python badge & scanning line)
    const codePanelCanvas = document.createElement('canvas');
    codePanelCanvas.width = 512;
    codePanelCanvas.height = 360;
    const panelCtx = codePanelCanvas.getContext('2d');
    const codePanelTexture = register(new THREE.CanvasTexture(codePanelCanvas));

    const drawCodePanel = (scanY: number) => {
      if (!panelCtx) return;
      panelCtx.clearRect(0, 0, 512, 360);

      // Glass panel background
      panelCtx.fillStyle = 'rgba(5, 18, 28, 0.88)';
      panelCtx.beginPath();
      panelCtx.roundRect(8, 8, 496, 344, 16);
      panelCtx.fill();

      // Glowing border
      panelCtx.strokeStyle = cyanHex;
      panelCtx.lineWidth = 3;
      panelCtx.shadowColor = cyanHex;
      panelCtx.shadowBlur = 12;
      panelCtx.stroke();
      panelCtx.shadowBlur = 0;

      // Window header
      panelCtx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      panelCtx.fillRect(10, 10, 492, 36);

      // Window buttons
      panelCtx.fillStyle = '#ff5f56';
      panelCtx.beginPath();
      panelCtx.arc(32, 28, 5, 0, Math.PI * 2);
      panelCtx.fill();
      panelCtx.fillStyle = '#ffbd2e';
      panelCtx.beginPath();
      panelCtx.arc(48, 28, 5, 0, Math.PI * 2);
      panelCtx.fill();
      panelCtx.fillStyle = '#27c93f';
      panelCtx.beginPath();
      panelCtx.arc(64, 28, 5, 0, Math.PI * 2);
      panelCtx.fill();

      // Title & Python Badge
      panelCtx.fillStyle = '#cbd5e1';
      panelCtx.font = 'bold 13px "JetBrains Mono", monospace';
      panelCtx.fillText('transformer_pipeline.py', 86, 32);

      panelCtx.fillStyle = cyanHex;
      panelCtx.font = 'bold 12px "JetBrains Mono", monospace';
      panelCtx.fillText('[PY 3.12]', 430, 32);

      // Code lines
      panelCtx.font = '14px "JetBrains Mono", monospace';
      const codeSnippets = [
        { text: 'from nexus import Model, Agent', color: '#c084fc' },
        { text: 'pipeline = Agent.compile(', color: '#60a5fa' },
        { text: '  engine="gemini-flash",', color: '#34d399' },
        { text: '  rag_index=vector_db,', color: '#38bdf8' },
        { text: '  temperature=0.2,', color: '#fbbf24' },
        { text: ')', color: '#60a5fa' },
        { text: 'result = pipeline.execute(query)', color: '#38bdf8' },
        { text: 'print(f"Latency: {result.latency_ms}ms")', color: '#4ade80' },
      ];

      codeSnippets.forEach((snippet, idx) => {
        panelCtx.fillStyle = snippet.color;
        panelCtx.fillText(snippet.text, 32, 78 + idx * 28);
      });

      // Animated scanning laser line across the panel
      panelCtx.strokeStyle = 'rgba(0, 240, 255, 0.7)';
      panelCtx.lineWidth = 2;
      panelCtx.shadowColor = cyanHex;
      panelCtx.shadowBlur = 10;
      panelCtx.beginPath();
      panelCtx.moveTo(12, scanY);
      panelCtx.lineTo(500, scanY);
      panelCtx.stroke();
      panelCtx.shadowBlur = 0;

      codePanelTexture.needsUpdate = true;
    };

    // D. Neural Brain HUD Panel Texture
    const brainPanelCanvas = document.createElement('canvas');
    brainPanelCanvas.width = 380;
    brainPanelCanvas.height = 300;
    const brainCtx = brainPanelCanvas.getContext('2d');
    const brainPanelTexture = register(new THREE.CanvasTexture(brainPanelCanvas));

    const drawBrainPanel = (time: number) => {
      if (!brainCtx) return;
      brainCtx.clearRect(0, 0, 380, 300);

      // Translucent panel background
      brainCtx.fillStyle = 'rgba(4, 16, 24, 0.82)';
      brainCtx.beginPath();
      brainCtx.roundRect(6, 6, 368, 288, 14);
      brainCtx.fill();

      // Border with corner accents
      brainCtx.strokeStyle = cyanHex;
      brainCtx.lineWidth = 2;
      brainCtx.stroke();

      // Telemetry Header
      brainCtx.fillStyle = cyanHex;
      brainCtx.font = 'bold 12px "JetBrains Mono", monospace';
      brainCtx.fillText('NEURAL DYNAMICS • 175B', 24, 30);

      // Realtime telemetry waveform
      brainCtx.strokeStyle = themeAccent;
      brainCtx.lineWidth = 2;
      brainCtx.beginPath();
      for (let x = 24; x < 350; x += 4) {
        const y =
          240 +
          Math.sin((x + time * 120) * 0.05) * 16 +
          Math.cos((x + time * 60) * 0.03) * 8;
        if (x === 24) brainCtx.moveTo(x, y);
        else brainCtx.lineTo(x, y);
      }
      brainCtx.stroke();

      // Metric bars
      const metrics = ['SYNC: 99.4%', 'LATENCY: 14ms', 'ATTN: OPTIMAL'];
      metrics.forEach((m, i) => {
        brainCtx.fillStyle = i === 0 ? cyanHex : '#94a3b8';
        brainCtx.font = '11px "JetBrains Mono", monospace';
        brainCtx.fillText(m, 24 + i * 110, 275);
      });

      brainPanelTexture.needsUpdate = true;
    };

    // =========================================================================
    // 2. Centerpiece — Holographic Cube System (Focal Point)
    // =========================================================================
    const centerGroup = new THREE.Group();
    scene.add(centerGroup);

    // Platform Base: Cyberpunk layered pedestal
    const pedestalBaseGeo = register(new THREE.CylinderGeometry(1.3, 1.45, 0.16, 36));
    const pedestalMat = register(
      new THREE.MeshStandardMaterial({
        color: 0x09141c,
        metalness: 0.9,
        roughness: 0.25,
      })
    );
    const pedestalBase = new THREE.Mesh(pedestalBaseGeo, pedestalMat);
    pedestalBase.position.y = -1.0;
    centerGroup.add(pedestalBase);

    // Glowing Concentric Base Ring Emitter
    const baseRingGeo = register(new THREE.TorusGeometry(0.88, 0.035, 16, 64));
    const neonCyanMat = register(
      new THREE.MeshBasicMaterial({
        color: cyanHex,
        transparent: true,
        opacity: 0.9,
      })
    );
    const baseRing = new THREE.Mesh(baseRingGeo, neonCyanMat);
    baseRing.rotation.x = Math.PI / 2;
    baseRing.position.y = -0.91;
    centerGroup.add(baseRing);

    // Glowing Cylindrical Energy Column
    const energyBeamGeo = register(new THREE.CylinderGeometry(0.85, 0.85, 1.8, 32, 1, true));
    const energyBeamMat = register(
      new THREE.MeshBasicMaterial({
        color: cyanHex,
        transparent: true,
        opacity: 0.12,
        side: THREE.DoubleSide,
      })
    );
    const energyBeam = new THREE.Mesh(energyBeamGeo, energyBeamMat);
    energyBeam.position.y = 0.05;
    centerGroup.add(energyBeam);

    // Top Canopy Ring Emitter
    const canopyRingGeo = register(new THREE.TorusGeometry(0.88, 0.045, 16, 64));
    const canopyRing = new THREE.Mesh(canopyRingGeo, neonCyanMat);
    canopyRing.rotation.x = Math.PI / 2;
    canopyRing.position.y = 1.05;
    centerGroup.add(canopyRing);

    // The Floating Holographic Cube
    const cubeGroup = new THREE.Group();
    cubeGroup.position.set(0, 0.05, 0);
    centerGroup.add(cubeGroup);

    const cubeSize = 1.15;
    const cubeGeo = register(new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize));

    // Multi-face materials: front/back has < / >, sides have streaming code
    const frontTex = createCodeSymbolTexture();
    const sideTex = createSideCodeTexture();

    const cubeMaterials = [
      new THREE.MeshStandardMaterial({
        map: sideTex,
        transparent: true,
        opacity: 0.92,
        roughness: 0.1,
        metalness: 0.8,
      }), // +x
      new THREE.MeshStandardMaterial({
        map: sideTex,
        transparent: true,
        opacity: 0.92,
        roughness: 0.1,
        metalness: 0.8,
      }), // -x
      new THREE.MeshStandardMaterial({
        color: 0x051a24,
        roughness: 0.2,
        metalness: 0.9,
        transparent: true,
        opacity: 0.85,
      }), // +y
      new THREE.MeshStandardMaterial({
        color: 0x051a24,
        roughness: 0.2,
        metalness: 0.9,
        transparent: true,
        opacity: 0.85,
      }), // -y
      new THREE.MeshStandardMaterial({
        map: frontTex,
        transparent: true,
        opacity: 0.98,
        roughness: 0.1,
        metalness: 0.8,
      }), // +z (front)
      new THREE.MeshStandardMaterial({
        map: frontTex,
        transparent: true,
        opacity: 0.98,
        roughness: 0.1,
        metalness: 0.8,
      }), // -z (back)
    ];
    cubeMaterials.forEach(register);

    const holographicCube = new THREE.Mesh(cubeGeo, cubeMaterials);
    cubeGroup.add(holographicCube);

    // Glowing Edges on the Cube
    const cubeEdgesGeo = register(new THREE.EdgesGeometry(cubeGeo));
    const cubeEdgesMat = register(
      new THREE.LineBasicMaterial({
        color: cyanHex,
        linewidth: 2,
        transparent: true,
        opacity: 0.95,
      })
    );
    const cubeEdges = new THREE.LineSegments(cubeEdgesGeo, cubeEdgesMat);
    cubeGroup.add(cubeEdges);

    // Inner Glowing Octahedron Core
    const innerCoreGeo = register(new THREE.OctahedronGeometry(0.32, 0));
    const innerCoreMat = register(
      new THREE.MeshBasicMaterial({
        color: themeAccent,
        wireframe: true,
      })
    );
    const innerCore = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    cubeGroup.add(innerCore);

    // =========================================================================
    // 3. Left: Cylindrical Layered Database
    // =========================================================================
    const dbGroup = new THREE.Group();
    dbGroup.position.set(-1.85, -0.45, 0.45);
    scene.add(dbGroup);

    // DB Pedestal Plate
    const dbPedestalGeo = register(new THREE.CylinderGeometry(0.5, 0.55, 0.1, 32));
    const dbPedestal = new THREE.Mesh(dbPedestalGeo, pedestalMat);
    dbPedestal.position.y = -0.55;
    dbGroup.add(dbPedestal);

    // 4 Stacked Cylindrical Server Discs with glowing rings
    const dbDiscGeo = register(new THREE.CylinderGeometry(0.4, 0.4, 0.14, 32));
    const dbDiscMat = register(
      new THREE.MeshStandardMaterial({
        color: 0x081922,
        metalness: 0.95,
        roughness: 0.2,
      })
    );
    const dbRingGeo = register(new THREE.TorusGeometry(0.41, 0.02, 16, 32));

    const dbRings: THREE.Mesh[] = [];
    for (let i = 0; i < 4; i++) {
      const disc = new THREE.Mesh(dbDiscGeo, dbDiscMat);
      disc.position.y = -0.35 + i * 0.22;
      dbGroup.add(disc);

      const ring = new THREE.Mesh(
        dbRingGeo,
        register(
          new THREE.MeshBasicMaterial({
            color: cyanHex,
            transparent: true,
            opacity: 0.85,
          })
        )
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -0.35 + i * 0.22;
      dbGroup.add(ring);
      dbRings.push(ring);
    }

    // Top Glowing DB Cap
    const dbCapGeo = register(new THREE.TorusGeometry(0.24, 0.025, 16, 32));
    const dbCap = new THREE.Mesh(dbCapGeo, neonCyanMat);
    dbCap.rotation.x = Math.PI / 2;
    dbCap.position.y = 0.5;
    dbGroup.add(dbCap);

    // =========================================================================
    // 4. Left-Center: Luminous 3D Neural Brain & Holographic Display Panel
    // =========================================================================
    const brainGroup = new THREE.Group();
    brainGroup.position.set(-1.75, 0.65, -0.3);
    brainGroup.scale.set(0.9, 0.9, 0.9);
    scene.add(brainGroup);

    // Background Holographic HUD Plane
    const brainPlaneGeo = register(new THREE.PlaneGeometry(1.4, 1.1));
    const brainPlaneMat = register(
      new THREE.MeshBasicMaterial({
        map: brainPanelTexture,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide,
      })
    );
    const brainPlane = new THREE.Mesh(brainPlaneGeo, brainPlaneMat);
    brainGroup.add(brainPlane);

    // 3D Procedural Neural Brain (Two Hemispheres)
    const neuralBrainGroup = new THREE.Group();
    neuralBrainGroup.position.set(0, 0.05, 0.15);
    neuralBrainGroup.scale.set(0.65, 0.65, 0.65);
    brainGroup.add(neuralBrainGroup);

    // Generate brain hemisphere nodes
    const brainNodesCount = 120;
    const brainPositions: number[] = [];
    const brainColors: number[] = [];
    const nodeCoords: THREE.Vector3[] = [];

    for (let i = 0; i < brainNodesCount; i++) {
      const hemisphere = i % 2 === 0 ? 1 : -1;
      const u = Math.random();
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      // Hemisphere ellipsoid shape
      const rx = 0.55 * (0.6 + 0.4 * Math.sin(phi));
      const ry = 0.45 * Math.sin(phi);
      const rz = 0.55 * Math.cos(phi);

      const x = hemisphere * (0.2 + rx * Math.cos(theta) * 0.65);
      const y = ry + (Math.random() - 0.5) * 0.1;
      const z = rz * Math.sin(theta) * 0.7;

      const vec = new THREE.Vector3(x, y, z);
      nodeCoords.push(vec);
      brainPositions.push(x, y, z);

      // Gradient color (cyan to emerald)
      const c = hemisphere === 1 ? cyanColor : accentColor;
      brainColors.push(c.r, c.g, c.b);
    }

    const brainPointsGeo = register(new THREE.BufferGeometry());
    brainPointsGeo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(brainPositions, 3)
    );
    brainPointsGeo.setAttribute(
      'color',
      new THREE.Float32BufferAttribute(brainColors, 3)
    );
    const brainPointsMat = register(
      new THREE.PointsMaterial({
        size: 0.055,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
      })
    );
    const brainPoints = new THREE.Points(brainPointsGeo, brainPointsMat);
    neuralBrainGroup.add(brainPoints);

    // Connect close brain nodes with synaptic lines
    const synapsePositions: number[] = [];
    for (let i = 0; i < nodeCoords.length; i++) {
      for (let j = i + 1; j < nodeCoords.length; j++) {
        const d = nodeCoords[i].distanceTo(nodeCoords[j]);
        if (d < 0.28) {
          synapsePositions.push(
            nodeCoords[i].x,
            nodeCoords[i].y,
            nodeCoords[i].z,
            nodeCoords[j].x,
            nodeCoords[j].y,
            nodeCoords[j].z
          );
        }
      }
    }

    const synapseGeo = register(new THREE.BufferGeometry());
    synapseGeo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(synapsePositions, 3)
    );
    const synapseMat = register(
      new THREE.LineBasicMaterial({
        color: cyanHex,
        transparent: true,
        opacity: 0.35,
      })
    );
    const synapseLines = new THREE.LineSegments(synapseGeo, synapseMat);
    neuralBrainGroup.add(synapseLines);

    // Rotating Holographic Gear Node (near brain/database)
    const gearGroup = new THREE.Group();
    gearGroup.position.set(-0.95, 0.15, 0.25);
    gearGroup.scale.set(0.3, 0.3, 0.3);
    scene.add(gearGroup);

    const gearRingGeo = register(new THREE.TorusGeometry(0.5, 0.06, 16, 24));
    const gearRing = new THREE.Mesh(gearRingGeo, neonCyanMat);
    gearGroup.add(gearRing);

    for (let g = 0; g < 8; g++) {
      const toothGeo = register(new THREE.BoxGeometry(0.12, 0.25, 0.08));
      const tooth = new THREE.Mesh(toothGeo, neonCyanMat);
      const angle = (g * Math.PI * 2) / 8;
      tooth.position.set(Math.cos(angle) * 0.52, Math.sin(angle) * 0.52, 0);
      tooth.rotation.z = angle;
      gearGroup.add(tooth);
    }

    // =========================================================================
    // 5. Right-Center: Floating Programming Code Panel
    // =========================================================================
    const codePanelGroup = new THREE.Group();
    codePanelGroup.position.set(1.65, 0.72, -0.25);
    codePanelGroup.rotation.set(0.06, -0.22, 0);
    codePanelGroup.scale.set(0.85, 0.85, 0.85);
    scene.add(codePanelGroup);

    const codePlaneGeo = register(new THREE.PlaneGeometry(1.6, 1.15));
    const codePlaneMat = register(
      new THREE.MeshBasicMaterial({
        map: codePanelTexture,
        transparent: true,
        opacity: 0.94,
        side: THREE.DoubleSide,
      })
    );
    const codePlane = new THREE.Mesh(codePlaneGeo, codePlaneMat);
    codePanelGroup.add(codePlane);

    // =========================================================================
    // 6. Right: Connected Neural Network Constellation
    // =========================================================================
    const networkGroup = new THREE.Group();
    networkGroup.position.set(1.95, -0.15, 0.35);
    scene.add(networkGroup);

    const netNodeCoords: THREE.Vector3[] = [
      new THREE.Vector3(-0.5, 0.4, 0.1),
      new THREE.Vector3(-0.2, 0.6, -0.2),
      new THREE.Vector3(0.3, 0.5, 0.2),
      new THREE.Vector3(0.6, 0.2, -0.1),
      new THREE.Vector3(-0.4, -0.1, -0.2),
      new THREE.Vector3(0.0, 0.1, 0.3),
      new THREE.Vector3(0.4, -0.2, 0.1),
      new THREE.Vector3(-0.2, -0.5, 0.1),
      new THREE.Vector3(0.3, -0.5, -0.2),
      new THREE.Vector3(0.7, -0.4, 0.2),
      new THREE.Vector3(-0.6, 0.1, 0.3),
      new THREE.Vector3(0.1, 0.7, 0.0),
    ];

    const netSphereGeo = register(new THREE.SphereGeometry(0.045, 16, 16));
    const netSphereMat = register(
      new THREE.MeshBasicMaterial({
        color: cyanHex,
      })
    );
    const netSphereHighlightMat = register(
      new THREE.MeshBasicMaterial({
        color: themeAccent,
      })
    );

    const networkNodes: THREE.Mesh[] = [];
    netNodeCoords.forEach((coord, i) => {
      const mat = i % 3 === 0 ? netSphereHighlightMat : netSphereMat;
      const mesh = new THREE.Mesh(netSphereGeo, mat);
      mesh.position.copy(coord);
      networkGroup.add(mesh);
      networkNodes.push(mesh);
    });

    // Connections between constellation nodes
    const netLinesPositions: number[] = [];
    for (let i = 0; i < netNodeCoords.length; i++) {
      for (let j = i + 1; j < netNodeCoords.length; j++) {
        if (netNodeCoords[i].distanceTo(netNodeCoords[j]) < 0.65) {
          netLinesPositions.push(
            netNodeCoords[i].x,
            netNodeCoords[i].y,
            netNodeCoords[i].z,
            netNodeCoords[j].x,
            netNodeCoords[j].y,
            netNodeCoords[j].z
          );
        }
      }
    }

    const netLinesGeo = register(new THREE.BufferGeometry());
    netLinesGeo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(netLinesPositions, 3)
    );
    const netLinesMat = register(
      new THREE.LineBasicMaterial({
        color: cyanHex,
        transparent: true,
        opacity: 0.55,
      })
    );
    const netLines = new THREE.LineSegments(netLinesGeo, netLinesMat);
    networkGroup.add(netLines);

    // Moving Signal Packets along network
    const signalPacketGeo = register(new THREE.SphereGeometry(0.035, 12, 12));
    const signalPacketMat = register(
      new THREE.MeshBasicMaterial({
        color: '#ffffff',
      })
    );
    const signalPackets: THREE.Mesh[] = [];
    for (let p = 0; p < 4; p++) {
      const packet = new THREE.Mesh(signalPacketGeo, signalPacketMat);
      networkGroup.add(packet);
      signalPackets.push(packet);
    }

    // =========================================================================
    // 7. Right Foreground: 3D Stepped Analytics Bars
    // =========================================================================
    const barsGroup = new THREE.Group();
    barsGroup.position.set(1.4, -0.68, 0.7);
    scene.add(barsGroup);

    // Platform Base
    const barsBaseGeo = register(new THREE.BoxGeometry(1.1, 0.06, 0.35));
    const barsBase = new THREE.Mesh(barsBaseGeo, pedestalMat);
    barsBase.position.y = -0.03;
    barsGroup.add(barsBase);

    // 5 Ascending 3D Bars
    const barHeights = [0.24, 0.42, 0.62, 0.82, 1.05];
    const barMeshes: THREE.Mesh[] = [];
    const barWidth = 0.12;

    barHeights.forEach((targetH, idx) => {
      const geo = register(new THREE.BoxGeometry(barWidth, targetH, barWidth));
      // Gradient colors across bars: light blue -> cyan -> teal -> emerald
      const barColor =
        idx < 2 ? blueHex : idx === 2 ? cyanHex : idx === 3 ? tealHex : themeAccent;
      const mat = register(
        new THREE.MeshStandardMaterial({
          color: barColor,
          roughness: 0.2,
          metalness: 0.8,
          transparent: true,
          opacity: 0.9,
        })
      );
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(-0.36 + idx * 0.18, targetH / 2, 0);
      mesh.scale.y = 0.05; // Will animate up
      barsGroup.add(mesh);
      barMeshes.push(mesh);
    });

    // =========================================================================
    // 8. Floating Microservice Cloud Badges
    // =========================================================================
    const createCloudTexture = () => {
      const c = document.createElement('canvas');
      c.width = 128;
      c.height = 128;
      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = cyanHex;
        ctx.lineWidth = 4;
        ctx.fillStyle = 'rgba(6, 22, 30, 0.85)';
        ctx.beginPath();
        ctx.roundRect(12, 12, 104, 104, 20);
        ctx.fill();
        ctx.stroke();

        // Cloud icon
        ctx.fillStyle = cyanHex;
        ctx.beginPath();
        ctx.arc(52, 60, 18, 0, Math.PI * 2);
        ctx.arc(76, 60, 14, 0, Math.PI * 2);
        ctx.arc(44, 72, 12, 0, Math.PI * 2);
        ctx.arc(84, 72, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(44, 68, 40, 16);
      }
      const tex = new THREE.CanvasTexture(c);
      tex.needsUpdate = true;
      return register(tex);
    };

    const cloudTex = createCloudTexture();
    const cloudMat = register(
      new THREE.SpriteMaterial({
        map: cloudTex,
        transparent: true,
        opacity: 0.88,
      })
    );
    const cloudSprite1 = new THREE.Sprite(cloudMat);
    cloudSprite1.position.set(1.05, -0.25, 0.2);
    cloudSprite1.scale.set(0.35, 0.35, 0.35);
    scene.add(cloudSprite1);

    const cloudSprite2 = new THREE.Sprite(cloudMat);
    cloudSprite2.position.set(2.35, -0.42, 0.1);
    cloudSprite2.scale.set(0.32, 0.32, 0.32);
    scene.add(cloudSprite2);

    // =========================================================================
    // 9. Environment: Floating Cyan & Accent Particles & Cyber Floor Grid
    // =========================================================================
    const particlesCount = 140;
    const particlePositions = new Float32Array(particlesCount * 3);
    const particleColors = new Float32Array(particlesCount * 3);

    for (let p = 0; p < particlesCount; p++) {
      particlePositions[p * 3] = (Math.random() - 0.5) * 8.0;
      particlePositions[p * 3 + 1] = (Math.random() - 0.5) * 3.5;
      particlePositions[p * 3 + 2] = (Math.random() - 0.5) * 4.0;

      const clr = p % 2 === 0 ? cyanColor : accentColor;
      particleColors[p * 3] = clr.r;
      particleColors[p * 3 + 1] = clr.g;
      particleColors[p * 3 + 2] = clr.b;
    }

    const particlesGeo = register(new THREE.BufferGeometry());
    particlesGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(particlePositions, 3)
    );
    particlesGeo.setAttribute(
      'color',
      new THREE.BufferAttribute(particleColors, 3)
    );
    const particlesMat = register(
      new THREE.PointsMaterial({
        size: 0.045,
        vertexColors: true,
        transparent: true,
        opacity: 0.75,
      })
    );
    const particles = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particles);

    // Floor Cyber Grid
    const gridHelper = register(new THREE.GridHelper(9, 20, cyanHex, '#0b232c'));
    gridHelper.position.y = -1.1;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.35;
    scene.add(gridHelper);

    // =========================================================================
    // 10. Interactive Parallax & Animation Loop
    // =========================================================================
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetMouseX = x * 0.45;
      targetMouseY = y * 0.25;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 900;
      height = container.clientHeight || 320;

      const isMob = width < 768;
      camera.aspect = width / height;
      camera.position.z = isMob ? 6.2 : 4.6;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    let animationFrameId: number;
    let clock = new THREE.Clock();
    let scanY = 40;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Skip intensive operations if document hidden
      if (document.hidden) return;

      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime();

      // Smooth camera parallax
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      const isMob = width < 768;
      const targetCamZ = isMob ? 6.2 : 4.6;
      camera.position.x = currentMouseX;
      camera.position.y = 0.35 + currentMouseY;
      camera.position.z = targetCamZ;
      camera.lookAt(0, 0.1, 0);

      // 1. Center Holographic Cube Animations
      if (!prefersReducedMotion) {
        cubeGroup.rotation.y = time * 0.38;
        cubeGroup.position.y = 0.05 + Math.sin(time * 1.6) * 0.07;
        innerCore.rotation.x = time * 0.8;
        innerCore.rotation.z = time * 0.6;
        baseRing.rotation.z = time * 0.5;
        canopyRing.rotation.z = -time * 0.5;
      }

      // 2. Database Discs Pulse & Float
      if (!prefersReducedMotion) {
        dbGroup.position.y = -0.45 + Math.sin(time * 1.8 + 1.2) * 0.04;
        dbRings.forEach((r, idx) => {
          const intensity = 0.4 + 0.6 * Math.sin(time * 3.5 + idx * 1.1);
          (r.material as THREE.MeshBasicMaterial).opacity = Math.max(0.2, intensity);
        });
      }

      // 3. Neural Brain Pulse & Waveform
      if (!prefersReducedMotion) {
        brainGroup.position.y = 0.65 + Math.sin(time * 1.5 + 2) * 0.05;
        neuralBrainGroup.rotation.y = Math.sin(time * 0.8) * 0.15;
        gearGroup.rotation.z = time * 0.7;
      }
      drawBrainPanel(time);

      // 4. Code Panel Scanning Laser Line
      scanY += delta * 140;
      if (scanY > 320) scanY = 50;
      drawCodePanel(scanY);
      if (!prefersReducedMotion) {
        codePanelGroup.position.y = 0.72 + Math.sin(time * 1.3 + 3) * 0.05;
      }

      // 5. Neural Network Constellation Data Packets
      if (!prefersReducedMotion) {
        networkGroup.rotation.y = Math.sin(time * 0.5) * 0.08;

        signalPackets.forEach((p, idx) => {
          const fromIdx = (idx * 3) % netNodeCoords.length;
          const toIdx = (fromIdx + 2) % netNodeCoords.length;
          const alpha = (time * 1.2 + idx * 0.25) % 1.0;
          p.position.lerpVectors(netNodeCoords[fromIdx], netNodeCoords[toIdx], alpha);
        });

        // Nodes pulsing
        networkNodes.forEach((node, i) => {
          const pulse = 0.9 + 0.3 * Math.sin(time * 4 + i);
          node.scale.setScalar(pulse);
        });
      }

      // 6. Analytics Bars Rise / Breathing Animation
      barMeshes.forEach((bar, idx) => {
        const targetH = barHeights[idx];
        const entranceSpeed = 2.5;
        const progress = Math.min(1, time * entranceSpeed);
        const breath = prefersReducedMotion ? 0 : Math.sin(time * 2 + idx * 0.8) * 0.03;
        bar.scale.y = progress + breath;
      });

      // 7. Ambient Drifting Particles
      if (!prefersReducedMotion) {
        const positions = particlesGeo.attributes.position.array as Float32Array;
        for (let i = 1; i < positions.length; i += 3) {
          positions[i] += delta * 0.15;
          if (positions[i] > 2.0) {
            positions[i] = -1.5;
          }
        }
        particlesGeo.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // =========================================================================
    // Cleanup & Disposal
    // =========================================================================
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();

      disposables.forEach((item) => {
        try {
          item.dispose();
        } catch {
          // Ignore
        }
      });

      try {
        renderer.dispose();
        renderer.forceContextLoss();
      } catch {
        // Ignore
      }

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [currentTheme]);

  if (!webGlSupported) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs font-mono">
        3D Hardware Acceleration Unavailable
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-auto"
      style={{
        zIndex: 10,
      }}
    />
  );
};

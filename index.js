//#region imports
import * as THREE from 'three';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import { EffectComposer } from 'jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'jsm/postprocessing/ShaderPass.js';
//#endregion

//#region HTML staff
const startButton = document.getElementById('startButton');
const loadingScreen = document.getElementById('loadingScreen');
const loadingProgress = document.getElementById('loadingProgress');
const loadingBar = document.getElementById('loadingBar');
const solarSystemContainer = document.getElementById('solarSystem');
const planetMenu = document.getElementById('planetMenu');
const infoBox = document.getElementById('infoBox');
const spacebutton = document.getElementById('spacebutton');
const list = document.getElementById('list');

document.addEventListener('DOMContentLoaded', () => {
  createStars();
  startButton.addEventListener('click', () => {
    startButton.style.display = 'none';
    loadingBar.style.display = 'block';
    loadingBar.style.opacity = '1';
    animateProgress();
    setTimeout(() => {
      initScene();
    }, 1500);
  });
});

function createStars() {
  const numStars = 200;
  for (let i = 0; i < numStars; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.width = `${Math.random() * 3}px`;
    star.style.height = star.style.width;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 2}s`;
    loadingScreen.appendChild(star);
  }
}

function animateProgress() {
  let progress = 0;
  const intervalId = setInterval(() => {
    if (progress < 100) {
      progress += 0.9;
      loadingProgress.style.width = `${progress}%`;
    } else {
      clearInterval(intervalId);
      loadingScreen.style.opacity = '0';
      setTimeout(() => {
        loadingScreen.style.display = 'none';
        solarSystemContainer.style.opacity = '1';
        planetMenu.style.opacity = '1';
        spacebutton.style.opacity='1';
        // infoBox.style.opacity = '1';
        list.style.opacity = '1';
      }, 1500);
    }
  }, 20);
}
function createTextSprite(text) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  context.font = 'Bold 64px Arial';
  context.fillStyle = 'white';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, 128, 64);

  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({ 
    map: texture,
    transparent: true,
    depthWrite: false
  });
  const sprite = new THREE.Sprite(spriteMaterial);
  
  return sprite;
}
//#endregion

//#region scene && camera && renderer && background
function initScene() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(w, h);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  if (solarSystemContainer) {
    solarSystemContainer.appendChild(renderer.domElement);
  } else {
    console.error('Solar system container not found');
    return;
  }

  const fov = 75;
  const aspect = w / h;
  const near = 0.1;
  const far = 10000000; // Increased from 2000 to 100000
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 5000, 15000); // Adjusted initial camera position
  const scene = new THREE.Scene();
  const loader = new THREE.TextureLoader();

  const starTexture = loader.load('./textures/Planets/Background@3x.jpg');
  const starGeo = new THREE.SphereGeometry(1000000, 100, 100 ); // Increased from 3000 to 50000
  const starMat = new THREE.MeshBasicMaterial({
    map: starTexture,
    side: THREE.BackSide,
  });
  const starSphere = new THREE.Mesh(starGeo, starMat);
  scene.add(starSphere);

  // Layers for selective bloom
  const BLOOM_LAYER = 1;
  const ENTIRE_SCENE = 0;

  // Post-processing setup
  const renderScene = new RenderPass(scene, camera);

  const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 1.5, 0.4, 0.85);
  bloomPass.threshold = 0.09;
  bloomPass.strength = 1;
  bloomPass.radius = 0.09;

  const bloomComposer = new EffectComposer(renderer);
  // bloomComposer.renderToScreen = false;
  // bloomComposer.addPass(renderScene);
  // bloomComposer.addPass(bloomPass);

  const finalPass = new ShaderPass(
    new THREE.ShaderMaterial({
      uniforms: {
        baseTexture: { value: null },
        bloomTexture: { value: bloomComposer.renderTarget2.texture }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
      `,
      fragmentShader: `
        uniform sampler2D baseTexture;
        uniform sampler2D bloomTexture;
        varying vec2 vUv;
        void main() {
          gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
        }
      `,
      defines: {}
    }), "baseTexture"
  );
  finalPass.needsSwap = true;

  const finalComposer = new EffectComposer(renderer);
  finalComposer.addPass(renderScene);
  finalComposer.addPass(finalPass);

  //#endregion

  //#region size and distance 
  let unitSize = 1;
  let Earth_size = 3959;
  let sun_size = unitSize * (864950 / Earth_size);
  let Mercury_size = unitSize * (1516 / Earth_size);
  let Venus_size = unitSize * (3760 / Earth_size);
  let Mars_size = unitSize * (2106 / Earth_size);
  let Jupiter_size = unitSize * (43441 / Earth_size);
  let Saturn_size = unitSize * (36184 / Earth_size);
  let Uranus_size = unitSize * (15759 / Earth_size);
  let Neptune_size = unitSize * (15299 / Earth_size);

  let Au = 100;
  let Mercury_distance = 0.38 * Au;
  let Venus_distance = 0.72 * Au;
  let Earth_distance = 1 * Au;
  let Mars_distance = 1.52 * Au;
  let Jupiter_distance = 5.20 * Au;
  let Saturn_distance = 9.58 * Au;
  let Uranus_distance = 19.14 * Au;
  let Neptune_distance = 30.20 * Au;
  //#endregion

  //#region  sun && light && planets
  const sunGeo = new THREE.SphereGeometry(sun_size, 64, 64);
  const sunMat = new THREE.MeshBasicMaterial({
    map: loader.load('./textures/Planets/8k_sun.jpg'),
    emissive: 0xFFFF00,
    emissiveIntensity: 1,
  });
  const sunMesh = new THREE.Mesh(sunGeo, sunMat);
  sunMesh.layers.set(ENTIRE_SCENE);
  sunMesh.layers.enable(BLOOM_LAYER);
  scene.add(sunMesh);

  const sunlight = new THREE.PointLight(0xffffff, 10, 1000);
  sunlight.position.set(0, 0, 0);
  sunlight.castShadow = true;
  sunlight.shadow.mapSize.width = 2048;
  sunlight.shadow.mapSize.height = 2048;
  scene.add(sunlight);

  const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
  scene.add(ambientLight);

  const hemiLight = new THREE.HemisphereLight(0x0099ff, 0xaa5500);
  scene.add(hemiLight);

  let dis = 3000; // Increased from 300
const distanceScale = 10;
  const planetData = [
    { name: 'Mercury', radius: Mercury_size, distance: dis + 200 * distanceScale, orbitalPeriod: 88, rotationPeriod: 58.65, texture: './textures/Planets/8k_mercury.jpg', color: 0xaaaaaa, beat: './audio/Mercury.mp3', inclination: 7.0, initialAngle: 0, orbitColor: 0xfffffff },
    { name: 'Venus', radius: Venus_size, distance: dis + 1500 * distanceScale, orbitalPeriod: 224.7, rotationPeriod: -243, texture: './textures/Planets/8k_venus_surface.jpg', color: 0xffd700, beat: './audio/Venus.mp3', inclination: 3.4, initialAngle: 0, orbitColor: 0xfffffff },
    { name: 'Earth', radius: unitSize,distance: dis + 2500 * distanceScale, orbitalPeriod: 365.25, rotationPeriod: 1, texture: './textures/Earth/8k_earth_daymap.jpg', color: 0x00ff00, beat: './audio/Earth.mp3', inclination: 0.0, initialAngle: 0, orbitColor: 0xfffffff },
    { name: 'Mars', radius: Mars_size, distance: dis + 3500 , orbitalPeriod: 687, rotationPeriod: 1.03, texture: './textures/Planets/8k_mars.jpg', color: 0xff4500, beat: './audio/Mars.mp3', inclination: 1.9, initialAngle: 0, orbitColor: 0xfffffff },
    { name: 'Jupiter', radius: Jupiter_size, distance: dis + 5500 * distanceScale, orbitalPeriod: 4333, rotationPeriod: 0.41, texture: './textures/Planets/8k_jupiter.jpg', color: 0xffa500, beat: './audio/Jupiter.mp3', inclination: 1.3, initialAngle: 0, orbitColor: 0xfffffff },
    { name: 'Saturn', radius: Saturn_size, distance: dis + 6500 * distanceScale, orbitalPeriod: 10759, rotationPeriod: 0.44, texture: './textures/Planets/8k_saturn.jpg', color: 0xffd700, hasRing: true, beat: './audio/Saturn.mp3', inclination: 2.5, initialAngle: 0, orbitColor: 0xfffffff },
    { name: 'Uranus', radius: Uranus_size, distance: dis + 7000 * distanceScale, orbitalPeriod: 30687, rotationPeriod: -0.72, texture: './textures/Planets/2k_uranus.jpg', color: 0x00ffff, beat: './audio/Uranus.mp3', inclination: 0.8, initialAngle: 0, orbitColor: 0xfffffff },
    { name: 'Neptune', radius: Neptune_size, distance: dis + 8500 * distanceScale, orbitalPeriod: 60190, rotationPeriod: 0.67, texture: './textures/Planets/2k_neptune.jpg', color: 0x0000ff, beat: './audio/Neptune.mp3', inclination: 1.8, initialAngle: 0, orbitColor: 0xfffffff }
  ];
  const planets = [];
  const orbitMeshes = [];

  const outlineRadiusFactor = 130; // Control the outline radius here

  planetData.forEach(data => {
    const planetGeo = new THREE.SphereGeometry(data.radius, 64, 64);
    const planetMat = new THREE.MeshBasicMaterial({
      map: loader.load(data.texture),
      shininess: 0,
    });

    const planetMesh = new THREE.Mesh(planetGeo, planetMat);
    planetMesh.castShadow = true;
    planetMesh.receiveShadow = true;
    planetMesh.layers.set(ENTIRE_SCENE);

    // Outline creation
    const outlineGeometry = new THREE.BufferGeometry();
    const outlinePoints = [];
    const segments = 64;
    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        outlinePoints.push(new THREE.Vector3(Math.cos(theta) * (outlineRadiusFactor), 0, Math.sin(theta) * (outlineRadiusFactor))); // Use outlineRadiusFactor
    }
    outlineGeometry.setFromPoints(outlinePoints);
    const outlineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
    const outlineMesh = new THREE.Line(outlineGeometry, outlineMaterial);
    
    // Position the outline at the planet's height
    outlineMesh.position.y = data.radius; // Position the outline at the planet's height
    outlineMesh.rotation.x = Math.PI / 2; // Rotate to be perpendicular to the planet's surface

    outlineMesh.visible = true; 
    planetMesh.add(outlineMesh);

    const orbitObject = new THREE.Object3D();
    scene.add(orbitObject);

    const pivotObject = new THREE.Object3D();
    orbitObject.add(pivotObject);

    pivotObject.rotation.x = data.inclination * (Math.PI / 180);

    planetMesh.userData = {
      name: data.name,
      distance: data.distance,
      orbitalPeriod: data.orbitalPeriod,
      rotationPeriod: data.rotationPeriod,
      angle: Math.random() * Math.PI * 2,
      viewDistance: data.radius * 5,
      inclination: data.inclination,
      beat: data.beat
    };
    planetMesh.position.x = data.distance;
    pivotObject.add(planetMesh);
    const orbitGeometry = new THREE.BufferGeometry();
    const orbitPoints = [];
    const orbitSegments = 600;

    for (let i = 0; i <= orbitSegments; i++) {
      const angle = (i / orbitSegments) * Math.PI * 2;
      const x = data.distance * Math.cos(angle);
      const z = data.distance * Math.sin(angle);
      orbitPoints.push(new THREE.Vector3(x, 0, z));
    }
    orbitGeometry.setFromPoints(orbitPoints);

    const orbitMaterial = new THREE.LineBasicMaterial({ 
      color: data.orbitColor,
      transparent: true,
      opacity: 0.3 
    });
    const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
    pivotObject.add(orbitLine);

    if (data.name === 'Saturn') {
      const innerRadius = data.radius * 1.5;
      const outerRadius = data.radius * 2.3;
      const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 128);
      const ringTexture = loader.load('./textures/Planets/8k_saturn_ring_alpha.png');
      const ringMaterial = new THREE.MeshBasicMaterial({
        map: ringTexture,
        transparent: true,
        opacity: 0.9,
        roughness: 0.5,
        metalness: 0.2,
        side: THREE.DoubleSide
      });
      const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
      ringMesh.rotation.x = Math.PI / 2;
      const ringThickness = data.radius * 0.01;
      ringMesh.scale.set(1, 1, ringThickness);
      planetMesh.add(ringMesh);
    }
    const planetName = createTextSprite(data.name);
    planetName.position.y = data.radius + data.radius * 0.5; // Adjust position based on planet size
    planetName.scale.set(data.radius * 2, data.radius, 1); // Scale based on planet size
    planetMesh.add(planetName);

    planets.push(planetMesh);
    orbitMeshes.push(orbitObject);
  });

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.09;
  controls.screenSpacePanning = false;
  controls.minDistance = 100;
  controls.maxDistance = 1000000;
  let selectedPlanet = null;
  let isFocused = false;

  let cameraStartPos = new THREE.Vector3();
  let cameraTargetPos = new THREE.Vector3();
  let cameraLookAtPos = new THREE.Vector3();
  
  //#endregion

  //#region  plant info && focus on planet && resetView 
  function showPlanetInfo(planet) {
    infoBox.innerHTML = `
      <h3>${planet.userData.name}</h3>
      <p>Distance from Sun: ${planet.userData.distance} million km</p>
      <p>Orbital Period: ${planet.userData.orbitalPeriod} days</p>
      <p>Rotation Period: ${planet.userData.rotationPeriod} days</p>
    `;
  }

  let animationInProgress = false;

function focusOnPlanet(planet) {
  planet.userData.isStopped = true;

  if (selectedPlanet === planet) return;

  if (selectedPlanet) {
    selectedPlanet.userData.isStopped = false;
    selectedPlanet.children[0].visible = false; // Hide previous planet outline
  }

  selectedPlanet = planet;
  isFocused = true;
  showPlanetInfo(selectedPlanet);

  planet.children[0].visible = true; // Show current planet outline

  cameraStartPos.copy(camera.position);
  const distance = selectedPlanet.userData.viewDistance;
  const planetWorldPosition = new THREE.Vector3();
  selectedPlanet.getWorldPosition(planetWorldPosition);
  
  const sunToPlanet = new THREE.Vector3().subVectors(planetWorldPosition, sunMesh.position);
  const angle = Math.PI / 6;
  const offsetY = Math.sin(angle) * distance;
  const offsetXZ = Math.cos(angle) * distance * 2;

  cameraTargetPos.copy(planetWorldPosition).add(
    sunToPlanet.normalize().multiplyScalar(offsetXZ)
  );
  cameraTargetPos.y += offsetY;

  cameraLookAtPos.copy(planetWorldPosition);

  // Disable controls during animation
  controls.enabled = false;
  animationInProgress = true;

  // Start the animation
  const startTime = performance.now();
  const duration = 5000; // 2 seconds

  function animateCamera(time) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);

    camera.position.lerpVectors(cameraStartPos, cameraTargetPos, progress);
    camera.lookAt(cameraLookAtPos);

    if (progress < 1) {
      requestAnimationFrame(animateCamera);
    } else {
      // Animation complete, enable controls and zooming
      controls.enabled = true;
      controls.enableZoom = true;
      controls.minDistance = selectedPlanet.geometry.parameters.radius * 1.5;
      controls.maxDistance = selectedPlanet.userData.viewDistance * 2;
      controls.target.copy(planetWorldPosition);
      animationInProgress = false;
    }
  }

  requestAnimationFrame(animateCamera);
}

function updateCameraPosition(deltaTime) {
  if (isFocused && selectedPlanet && !animationInProgress) {
    const planetWorldPosition = new THREE.Vector3();
    selectedPlanet.getWorldPosition(planetWorldPosition);
    
    // Update the controls target to follow the planet
    controls.target.copy(planetWorldPosition);
    
    // Let OrbitControls handle the camera position
    controls.update();

    // Hide outline when camera is close to the planet
    const distanceToPlanet = camera.position.distanceTo(planetWorldPosition);
    if (distanceToPlanet < selectedPlanet.geometry.parameters.radius * 2) {
      selectedPlanet.children[0].visible = false; // Hide outline
    } else {
      selectedPlanet.children[0].visible = false; // Show outline if not close
    }
  }
}
function resetView() {
  if (selectedPlanet) {
    selectedPlanet.userData.isStopped = false;
    selectedPlanet.children[0].visible = false; // Hide outline of previously selected planet
  }

  selectedPlanet = null;
  isFocused = false;

  const cameraStartPos = camera.position.clone();
  const cameraEndPos = new THREE.Vector3(0, 5000, 15000);
  const cameraStartTarget = controls.target.clone();
  const cameraEndTarget = new THREE.Vector3(0, 0, 0);

  const duration = 2000; // 2 seconds
  const startTime = performance.now();

  // Disable controls during reset
  controls.enabled = false;
  controls.enableZoom = false;
  animationInProgress = true;

  function animateCamera(time) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);

    camera.position.lerpVectors(cameraStartPos, cameraEndPos, progress);
    
    // Smoothly move the camera's look-at point
    const currentTarget = new THREE.Vector3();
    currentTarget.lerpVectors(cameraStartTarget, cameraEndTarget, progress);
    camera.lookAt(currentTarget);
    
    // Update controls target
    controls.target.copy(currentTarget);

    if (progress < 1) {
      requestAnimationFrame(animateCamera);
    } else {
      // Animation complete, reset controls
      controls.enabled = true;
      controls.enableZoom = true;
      controls.minDistance = 100;
      controls.maxDistance = 1000000;
      animationInProgress = false;
      
      // Ensure camera is looking at the center
      camera.lookAt(new THREE.Vector3(0, 0, 0));
      controls.target.set(0, 0, 0);
    }
  }

  requestAnimationFrame(animateCamera);

  // Update info box
  infoBox.innerHTML = `
    <h3>The Solar System</h3>
    <p>Our solar system consists of the Sun and everything bound to it by gravity – the planets Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune; dwarf planets such as Pluto; dozens of moons; and millions of asteroids, comets, and meteoroids.</p>
    <p>The Sun, the heart of our solar system, contains 99.8% of the system's known mass and influences everything around it with its immense gravitational pull.</p>
    <p>Click on a planet to learn more about it!</p>
  `;
}
  //#endregion

  //#region  highlight orbit && planetButtons click && sound
  window.addEventListener('resize', () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    bloomComposer.setSize(w, h);
    finalComposer.setSize(w, h);
  });

  let sound = null;
  const planetButtons = document.querySelectorAll('.planet-button');

  planetButtons.forEach(button => {
    button.addEventListener('click', () => {
      const planetName = button.getAttribute('data-planet');
      if (planetName === 'SolarSystem') {
        resetView();
        if (sound) sound.pause();
      }
      else {
        const planet = planets.find(p => p.userData.name === planetName);
        if (planet) {
          if (sound) {
            sound.pause();
            sound.currentTime = 0;
          }
          sound = new Audio(planet.userData.beat);
          sound.play().catch((error) => {
            console.error('Error playing sound:', error);
          });
          focusOnPlanet(planet);
        }
      }
    });
  });

  const clock = new THREE.Clock();
  //#endregion

  //#region animate
  function animate() {
    const deltaTime = clock.getDelta();
  
    planets.forEach(planet => {
      if (!planet.userData.isStopped) {
        planet.userData.angle += (deltaTime / planet.userData.orbitalPeriod) * Math.PI * 2;
        planet.position.x = planet.userData.distance * Math.cos(planet.userData.angle);
        planet.position.z = planet.userData.distance * Math.sin(planet.userData.angle);
      }
      planet.rotation.y += (deltaTime / planet.userData.rotationPeriod) * Math.PI * 2 * 0.01;
    });
  
    if (isFocused && selectedPlanet && !animationInProgress) {
      updateCameraPosition(deltaTime);
    } else if (!animationInProgress) {
      controls.update();
    }
  
    renderScenes();
    requestAnimationFrame(animate);

  }

  function renderScenes() {
    // Render bloom effect
    camera.layers.set(BLOOM_LAYER);
    bloomComposer.render();

    // Render final scene with bloom
    camera.layers.set(ENTIRE_SCENE);
    finalComposer.render();
  }

  animate();
}
//#endregion

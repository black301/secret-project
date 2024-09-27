import * as THREE from 'three';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';

const startButton = document.getElementById('startButton');
const loadingScreen = document.getElementById('loadingScreen');
const loadingProgress = document.getElementById('loadingProgress');
const loadingBar = document.getElementById('loadingBar');
const solarSystemContainer = document.getElementById('solarSystem');
const planetMenu = document.getElementById('planetMenu');
const infoBox = document.getElementById('infoBox');

document.addEventListener('DOMContentLoaded', () => {
  createStars();
  startButton.addEventListener('click', () => {
    startButton.style.display = 'none';
    loadingBar.style.display = 'block';
    loadingBar.style.opacity = '1';
    animateProgress();
    setTimeout(() => {
      initScene();
    }, 1500); // wait for 2 seconds to simulate loading
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

function initScene() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(w, h);

  if (solarSystemContainer) {
    solarSystemContainer.appendChild(renderer.domElement);
  } else {
    console.error('Solar system container not found');
    return;
  }

  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const fov = 75;
  const aspect = w / h;
  const near = 0.1;
  const far = 2000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 100, 700);
  const scene = new THREE.Scene();
  const loader = new THREE.TextureLoader();

  const starTexture = loader.load('./textures/MOON/8k_stars_milky_way.jpg');
  const starGeo = new THREE.SphereGeometry(1000, 64, 64);
  const starMat = new THREE.MeshBasicMaterial({
    map: starTexture,
    side: THREE.BackSide,
  });
  const starSphere = new THREE.Mesh(starGeo, starMat);
  scene.add(starSphere);

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

  const sunGeo = new THREE.SphereGeometry(sun_size, 64, 64);
  const sunMat = new THREE.MeshBasicMaterial({
    map: loader.load('./textures/Planets/8k_sun.jpg'),
    emissive: 0xFFFF00,
    emissiveIntensity: 1,
  });
  const sunMesh = new THREE.Mesh(sunGeo, sunMat);
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

  let dis = 300;
  const planetData = [
    { name: 'Mercury', radius: Mercury_size, distance: dis + 20, orbitalPeriod: 88, rotationPeriod: 58.65, texture: './textures/Planets/8k_mercury.jpg', color: 0xaaaaaa, beat: './audio/Mercury.mp3' },
    { name: 'Venus', radius: Venus_size, distance: dis + 30, orbitalPeriod: 224.7, rotationPeriod: -243, texture: './textures/Planets/8k_venus_surface.jpg', color: 0xffd700, beat: './audio/Venus.mp3' },
    { name: 'Earth', radius: unitSize, distance: dis + 40, orbitalPeriod: 365.25, rotationPeriod: 1, texture: './textures/Earth/8k_earth_daymap.jpg', color: 0x00ff00, beat: './audio/Earth.mp3' },
    { name: 'Mars', radius: Mars_size, distance: dis + 55, orbitalPeriod: 687, rotationPeriod: 1.03, texture: './textures/Planets/8k_mars.jpg', color: 0xff4500, beat: './audio/Mars.mp3' },
    { name: 'Jupiter', radius: Jupiter_size, distance: dis + 100, orbitalPeriod: 4333, rotationPeriod: 0.41, texture: './textures/Planets/8k_jupiter.jpg', color: 0xffa500, beat: './audio/Jupiter.mp3' },
    { name: 'Saturn', radius: Saturn_size, distance: dis + 138, orbitalPeriod: 10759, rotationPeriod: 0.44, texture: './textures/Planets/8k_saturn.jpg', color: 0xffd700, hasRing: true, beat: './audio/Saturn.mp3' },
    { name: 'Uranus', radius: Uranus_size, distance: dis + 176, orbitalPeriod: 30687, rotationPeriod: -0.72, texture: './textures/Planets/2k_uranus.jpg', color: 0x00ffff, beat: './audio/Uranus.mp3' },
    { name: 'Neptune', radius: Neptune_size, distance: dis + 200, orbitalPeriod: 60190, rotationPeriod: 0.67, texture: './textures/Planets/2k_neptune.jpg', color: 0x0000ff, beat: './audio/Neptune.mp3' },
  ];

  const planets = [];
  const orbitMeshes = [];

  planetData.forEach(data => {
    const planetGeo = new THREE.SphereGeometry(data.radius, 64, 64);
    const planetMat = new THREE.MeshStandardMaterial({
      map: loader.load(data.texture),
    });

    const planetMesh = new THREE.Mesh(planetGeo, planetMat);
    planetMesh.position.x = data.distance;
    planetMesh.castShadow = true;
    planetMesh.receiveShadow = true;

    const orbitGeometry = new THREE.RingGeometry(data.distance - 0.05, data.distance + 0.05, 64);
    const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
    const orbitMesh = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbitMesh.rotation.x = Math.PI / 2;
    scene.add(orbitMesh);
    orbitMeshes.push(orbitMesh);

    const planetLight = new THREE.HemisphereLight(data.color, 0x000000, 0.9);
    planetLight.position.set(0, data.radius, 0);
    planetMesh.add(planetLight);

    if (data.hasRing) {
      const saturnRingTexture = loader.load('./textures/Planets/8k_saturn_ring_alpha.png');
      const ringGeometry = new THREE.RingGeometry(data.radius * 1.4, data.radius * 2, 64);
      const ringMaterial = new THREE.MeshBasicMaterial({
        map: saturnRingTexture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
      ringMesh.rotation.x = Math.PI / 2;
      planetMesh.add(ringMesh);
    }

    planetMesh.userData = {
      name: data.name,
      distance: data.distance,
      orbitalPeriod: data.orbitalPeriod,
      rotationPeriod: data.rotationPeriod,
      originalPosition: new THREE.Vector3(data.distance, 0, 0),
      originalAngle: Math.random() * Math.PI * 2,
      angle: Math.random() * Math.PI * 2,
      viewDistance: data.radius * 3,
      beat: data.beat  // Add this line to include the audio file
    };

    planets.push(planetMesh);
    scene.add(planetMesh);
  });

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 10;
  controls.maxDistance = 1000;

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  let selectedPlanet = null;
  let isFocused = false;

  let cameraStartPos = new THREE.Vector3();
  let cameraTargetPos = new THREE.Vector3();
  let cameraLookAtPos = new THREE.Vector3();

  function onMouseClick(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(planets);
    if (intersects.length > 0) {
      const clickedPlanet = intersects[0].object;
      focusOnPlanet(clickedPlanet);
    }
  }

  function showPlanetInfo(planet) {
    infoBox.innerHTML = `
      <h3>${planet.userData.name}</h3>
      <p>Distance from Sun: ${planet.userData.distance} million km</p>
      <p>Orbital Period: ${planet.userData.orbitalPeriod} days</p>
      <p>Rotation Period: ${planet.userData.rotationPeriod} days</p>
    `;
  }

  function focusOnPlanet(planet) {
    if (selectedPlanet === planet) return;

    if (selectedPlanet) {
      selectedPlanet.userData.isStopped = false;
    }

    selectedPlanet = planet;
    isFocused = true;
    showPlanetInfo(selectedPlanet);
    highlightOrbit(selectedPlanet.userData.name);

    // console.log(beat); 
    cameraStartPos.copy(camera.position);
    const distance = selectedPlanet.userData.viewDistance;
    cameraTargetPos.set(
      selectedPlanet.position.x + distance,
      selectedPlanet.position.y + distance * 0.3,
      selectedPlanet.position.z + distance
    );
    cameraLookAtPos.copy(selectedPlanet.position);

    controls.enabled = false;
  }

  function updateCameraPosition(deltaTime) {
    if (isFocused && selectedPlanet) {
      cameraTargetPos.set(
        selectedPlanet.position.x + selectedPlanet.userData.viewDistance,
        selectedPlanet.position.y + selectedPlanet.userData.viewDistance * 0.3,
        selectedPlanet.position.z + selectedPlanet.userData.viewDistance
      );
      cameraLookAtPos.copy(selectedPlanet.position);

      camera.position.lerp(cameraTargetPos, deltaTime * 2);
      camera.lookAt(cameraLookAtPos);
    }
  }

  function resetView() {
    if (selectedPlanet) {
      selectedPlanet.userData.isStopped = false;
    }

    selectedPlanet = null;
    isFocused = false;

    cameraStartPos.set(0, 100, 700);
    cameraTargetPos.copy(cameraStartPos);
    cameraLookAtPos.set(0, 0, 0);

    camera.position.copy(cameraStartPos);
    camera.lookAt(cameraLookAtPos);

    controls.enabled = true;

    infoBox.innerHTML = `
      <h3>The Solar System</h3>
      <p>Our solar system consists of the Sun and everything bound to it by gravity – the planets Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune; dwarf planets such as Pluto; dozens of moons; and millions of asteroids, comets, and meteoroids.</p>
      <p>The Sun, the heart of our solar system, contains 99.8% of the system's known mass and influences everything around it with its immense gravitational pull.</p>
      <p>Click on a planet to learn more about it!</p>
    `;

    orbitMeshes.forEach((orbitMesh) => {
      orbitMesh.material.opacity = 0.5;
      orbitMesh.material.color.setHex(0xffffff);
    });
  }

  function highlightOrbit(planetName) {
    orbitMeshes.forEach((orbitMesh, index) => {
      if (planetData[index].name === planetName) {
        orbitMesh.material.opacity = 1;
        orbitMesh.material.color.setHex(0x1E90FF);
      } else {
        orbitMesh.material.opacity = 0.5;
        orbitMesh.material.color.setHex(0xffffff);
      }
    });
  }

  window.addEventListener('resize', () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });

  window.addEventListener('click', onMouseClick);

  const planetButtons = document.querySelectorAll('.planet-button');
  planetButtons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      const planetName = button.getAttribute('data-planet');
      if (planetName !== 'SolarSystem') {
        highlightOrbit(planetName);
      }
    });

    button.addEventListener('mouseleave', () => {
      if (!selectedPlanet) {
        highlightOrbit('');
      } else {
        highlightOrbit(selectedPlanet.userData.name);
      }
    });
    
    button.addEventListener('click', () => {
      const planetName = button.getAttribute('data-planet');
      if (planetName === 'SolarSystem') {
        resetView();
        sound.pause();
      } else {
        const planet = planets.find(p => p.userData.name === planetName);
        if (planet) {
          sound.pause();
          sound = new Audio(planet.userData.beat);  // Fix here
          console.log(planet.userData.beat);  // Logging the correct beat
          sound.play();  // Play sound
          focusOnPlanet(planet);
        }
      }
    });
  });
  var sound=new Audio('');
  const clock = new THREE.Clock();

  function animate() {
    const deltaTime = clock.getDelta();

    planets.forEach(planet => {
      if (!planet.userData.isStopped) {
        planet.userData.angle += deltaTime / planet.userData.orbitalPeriod * Math.PI * 2;
        planet.position.x = planet.userData.distance * Math.cos(planet.userData.angle);
        planet.position.z = planet.userData.distance * Math.sin(planet.userData.angle);
      }

      planet.rotation.y += (deltaTime / planet.userData.rotationPeriod) * Math.PI * 2 * 0.01;
    });

    updateCameraPosition(deltaTime);

    if (!isFocused) {
      controls.update();
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
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
        infoBox.style.opacity = '1';
      }, 1500);
    }
  }, 20);
}
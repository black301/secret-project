//#region imports
import * as THREE from 'three';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
//#endregion







//#region HTML staff
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
        infoBox.style.opacity = '1';
      }, 1500);
    }
  }, 20);
}

//#endregion






//#region scene && camera && renderer && background
function initScene() {


  const w = window.innerWidth;
  const h = window.innerHeight;
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(w, h);
  document.body.appendChild(renderer.domElement);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const fov = 75;
  const aspect = w / h;
  const near = 0.1;
  const far = 40000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 50, 1500);
  const scene = new THREE.Scene();
  const loader = new THREE.TextureLoader();
    
  const starTexture = loader.load('./textures/Planets/Background@3x.jpg');
  const starGeo = new THREE.SphereGeometry(30000, 64, 64);
  const starMat = new THREE.MeshBasicMaterial({
    map: starTexture,
    side: THREE.BackSide,
  });
  const starSphere = new THREE.Mesh(starGeo, starMat);
  scene.add(starSphere);
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
  scene.add(sunMesh);

const sunlight = new THREE.DirectionalLight(0xffffff, 3);
sunlight.position.set(0, 0, 0);
scene.add(sunlight);
const ambientLight = new THREE.AmbientLight(0x404040, 10);
scene.add(ambientLight);

const hemiLight = new THREE.HemisphereLight(0x0099ff, 0xaa5500);
scene.add(hemiLight);
//#endregion

let dis = 300;
const planetData = [
  { name: 'Mercury', radius: 1, distance: dis + 20, orbitalPeriod: 150, rotationPeriod: 58.65, texture: './textures/Planets/8k_mercury.jpg', color: 0xaaaaaa, orbitColor: 0xff0bbaa, inclination: 7.0, initialAngle: 0 },
  { name: 'Venus', radius: 3, distance: dis + 150, orbitalPeriod: 224.7, rotationPeriod: -243, texture: './textures/Planets/8k_venus_surface.jpg', color: 0xffd700, orbitColor: 0xff0bbaa, inclination: 3.4, initialAngle: 0 },
  { name: 'Earth', radius: 5, distance: dis + 250, orbitalPeriod: 365.25, rotationPeriod: 1, texture: './textures/Earth/8k_earth_daymap.jpg', color: 0x00ff00, orbitColor: 0xff0bbaa, inclination: 0.0, initialAngle: 0 },
  { name: 'Mars', radius: 4, distance: dis +350, orbitalPeriod: 687, rotationPeriod: 1.03, texture: './textures/Planets/8k_mars.jpg', color: 0xff4500, orbitColor: 0xff0bbaa, inclination: 1.9, initialAngle: 0 },
  { name: 'Jupiter', radius: 11, distance: dis+ 450, orbitalPeriod: 4333, rotationPeriod: 0.41, texture: './textures/Planets/8k_jupiter.jpg', color: 0xffa500, orbitColor: 0xff0bbaa, inclination: 1.3, initialAngle: 0 },
  { name: 'Saturn', radius: 9, distance: dis +650, orbitalPeriod: 10759, rotationPeriod: 0.44, texture: './textures/Planets/8k_saturn.jpg', color: 0xffd700, orbitColor: 0xff0bbaa, hasRing: true, inclination: 2.5, initialAngle: 0 },
  { name: 'Uranus', radius: 4, distance: dis + 700, orbitalPeriod: 30687, rotationPeriod: -0.72, texture: './textures/Planets/2k_uranus.jpg', color: 0x00ffff, orbitColor: 0xff0bbaa, inclination: 0.8, initialAngle: 0 },
  { name: 'Neptune', radius: 3, distance: dis + 850, orbitalPeriod: 60190, rotationPeriod: 0.67, texture: './textures/Planets/2k_neptune.jpg', color: 0x0000ff, orbitColor: 0xff0bbaa, inclination: 1.8, initialAngle: 0 },
];
  const planets = [];
const orbitMeshes = [];

planetData.forEach(data => {
  const planetGeo = new THREE.SphereGeometry(data.radius, 64, 64);
  const planetMat = new THREE.MeshStandardMaterial({
    map: loader.load(data.texture),
    shininess: 0,
  });

  const planetMesh = new THREE.Mesh(planetGeo, planetMat);
  planetMesh.castShadow = true;
  planetMesh.receiveShadow = true;


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
    viewDistance: data.radius * 3,
    inclination: data.inclination
  };  
  planetMesh.position.x = data.distance;
  pivotObject.add(planetMesh);
  const orbitGeometry = new THREE.BufferGeometry();
  const orbitPoints = [];
  const orbitSegments = 600; // Number of points to make a smooth circle

  for (let i = 0; i <= orbitSegments; i++) {
    const angle = (i / orbitSegments) * Math.PI * 2;
    const x = data.distance * Math.cos(angle);
    const z = data.distance * Math.sin(angle);
    orbitPoints.push(new THREE.Vector3(x, 0, z));
  }
  orbitGeometry.setFromPoints(orbitPoints);

  
  const orbitMaterial = new THREE.LineBasicMaterial({ color: data.orbitColor });
  const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
  pivotObject.add(orbitLine);

  // Add ring for Saturn
  if (data.name === 'Saturn') {
    const innerRadius = data.radius * 1.5;
    const outerRadius = data.radius * 2.3;
    const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 128);
    const ringTexture = loader.load('./textures/Planets/8k_saturn_ring_alpha.png');
    const ringMaterial = new THREE.MeshStandardMaterial({
      map: ringTexture,
      transparent: true,
      opacity: 0.9,
      roughness: 0.5,
      metalness: 0.2,
      side: THREE.DoubleSide
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.rotation.x = Math.PI / 2 ; 
    const ringThickness = data.radius * 0.01;
    ringMesh.scale.set(1, 1, ringThickness);
    planetMesh.add(ringMesh);
  }

  planets.push(planetMesh);
  orbitMeshes.push(orbitObject); 
});


  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 10;
  controls.maxDistance = 1000;
  let selectedPlanet = null;
  let isFocused = false;

  let cameraStartPos = new THREE.Vector3();
  let cameraTargetPos = new THREE.Vector3();
  let cameraLookAtPos = new THREE.Vector3();
  let cameraLookAtPos2 = new THREE.Vector3();
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

  function focusOnPlanet(planet) {
  if (selectedPlanet === planet) return;

  if (selectedPlanet) {
    selectedPlanet.userData.isStopped = false;
  }

  selectedPlanet = planet;
  isFocused = true;
  showPlanetInfo(selectedPlanet);
  highlightOrbit(selectedPlanet.userData.name);

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
    if (isFocused && selectedPlanet && sunMesh) {
        // Calculate vector from sun to planet
        const direction = new THREE.Vector3();
        direction.subVectors(selectedPlanet.position, sunMesh.position).normalize();

        // Set the camera position behind the planet by extending the vector in the opposite direction
        const cameraDistance = selectedPlanet.userData.viewDistance; // Adjust distance if needed
        const cameraPosition = new THREE.Vector3();
        cameraPosition.copy(selectedPlanet.position).addScaledVector(direction, cameraDistance);

        // Adjust the camera's target to be at the planet
        cameraTargetPos.set(cameraPosition.x, cameraPosition.y + selectedPlanet.userData.viewDistance * 0.3, cameraPosition.z);
        cameraLookAtPos.copy(selectedPlanet.position);

        // Smoothly move the camera to the new position
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
  
    // Set the camera start position closer to the Sun (assuming the Sun is at (0, 0, 0))
    const cameraStartPos = new THREE.Vector3(0, 0, 300); // Adjust starting point near the Sun
    const cameraEndPos = new THREE.Vector3(0, 200, 800); // Final position further away to zoom out
    const cameraLookAtPos = new THREE.Vector3(0, 0, 0); // Look at the Sun's position (center)
  
    const initialCameraPos = camera.position.clone();
  
    // Animation parameters
    const duration = 1000; // 3 seconds for zooming out and moving to the final position
    const startTime = performance.now();
  
    function animateCamera() {
      const currentTime = performance.now();
      const elapsed = currentTime - startTime;
      const t = Math.min(elapsed / duration, 1); // Normalized time (0 to 1)
  
      // Interpolating the camera position from the Sun's vicinity to the zoomed-out position
      camera.position.lerpVectors(cameraStartPos, cameraEndPos, t);
      camera.lookAt(cameraLookAtPos);
  
      if (t < 1) {
        requestAnimationFrame(animateCamera);
      } else {
        controls.enabled = true; // Enable controls after animation completes
      }
    }
  
    // Start the animation
    controls.enabled = false; // Disable controls during the animation
    animateCamera();
  
    infoBox.innerHTML = `
      <h3>The Solar System</h3>
      <p>Our solar system consists of the Sun and everything bound to it by gravity – the planets Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune; dwarf planets such as Pluto; dozens of moons; and millions of asteroids, comets, and meteoroids.</p>
      <p>The Sun, the heart of our solar system, contains 99.8% of the system's known mass and influences everything around it with its immense gravitational pull.</p>
      <p>Click on a planet to learn more about it!</p>
    `;
  
    orbitLines.forEach((orbitLine) => {
      orbitLine.material.color.setHex(0xffffff);
    });
  }
  
  //#endregion
  
  








//#region  highlight orbit && planetButtons click && sound
  function highlightOrbit(planetName) {
    orbitLines.forEach((orbitLine, index) => {
      if (planetData[index].name === planetName) {
        orbitLine.material.color.setHex(0x1E90FF);
      } else {
        orbitLine.material.color.setHex(0xffffff);
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

  // window.addEventListener('click', onMouseClick);

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
          sound = new Audio(planet.userData.beat);
          console.log(planet.userData.beat);
          sound.play();
          focusOnPlanet(planet);
        }
      }
    });
  });
  var sound = new Audio('');
  const clock = new THREE.Clock();
  //#endregion
  
  












  
//#region animate
  
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
//#endregion
// === Creazione scena, camera, renderer ===
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75, 
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controlli orbitali
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Luci
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0x555555);
scene.add(ambientLight);

// Caricamento texture (assumendo di avere i file in /static/textures)
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('/static/textures/8081_earthmap10k.jpg');
const bumpTexture = textureLoader.load('/static/textures/bump.jpg');
const cloudTexture = textureLoader.load('/static/textures/earthcloudmap.jpg');

// Terra
const earthGeometry = new THREE.SphereGeometry(5, 32, 32);
const earthMaterial = new THREE.MeshPhongMaterial({
  map: earthTexture,
  bumpMap: bumpTexture,
  bumpScale: 0.05,
  specular: new THREE.Color(0x333333)
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// Nuvole
const cloudsGeometry = new THREE.SphereGeometry(5.03, 32, 32);
const cloudsMaterial = new THREE.MeshLambertMaterial({
  map: cloudTexture,
  transparent: true,
  opacity: 0.3
});
const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
scene.add(clouds);

// Stelle (campo di particelle)
const starsGeometry = new THREE.BufferGeometry();
const vertices = [];
for (let i = 0; i < 1000; i++) {
  const x = (Math.random() - 0.5) * 1000;
  const y = (Math.random() - 0.5) * 1000;
  const z = (Math.random() - 0.5) * 1000;
  vertices.push(x, y, z);
}
starsGeometry.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(vertices, 3)
);
const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1 });
const starField = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starField);

// Posizione iniziale camera
camera.position.z = 15;

// Raycaster e vettore mouse
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Aggiungi event listener per il click
window.addEventListener('click', onClickGlobe, false);

function onClickGlobe(event) {
  event.preventDefault();
  
  // Coordinate normalizzate
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Imposta raycaster
  raycaster.setFromCamera(mouse, camera);

  // Intersezione con la Terra (earth)
  const intersects = raycaster.intersectObject(earth);
  if (intersects.length > 0) {
    const point = intersects[0].point;
    
    // Converte il punto 3D in lat/lon
    const { lat, lon } = cartesianToLatLon(point);
    console.log(`Cliccato su lat=${lat}, lon=${lon}`);

    // Reindirizza alla pagina di upload passando lat, lon come query string
    window.location.href = `/upload?lat=${lat}&lon=${lon}`;
  }
}

// Funzione di conversione cartesian -> lat/lon
function cartesianToLatLon(pos) {
  // pos è un THREE.Vector3
  const radius = pos.length();
  const phi = Math.acos(pos.y / radius);      // 0 .. PI
  const theta = Math.atan2(pos.x, pos.z);     // -PI .. PI

  // lat = 90 - phi in gradi
  // lon = 180 + theta in gradi (o un offset simile)
  const lat = 90 - (phi * 180 / Math.PI);
  let lon = (theta * 180 / Math.PI);

  lon = (lon + 360) % 360;

  return { lat, lon };
}

// Animazione
function animate() {
  requestAnimationFrame(animate);

  earth.rotation.y += 0.0005;
  clouds.rotation.y += 0.0006;

  controls.update();
  renderer.render(scene, camera);
}

animate();

// Resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

initMarkers();

function initMarkers() {
  let points = JSON.parse(localStorage.getItem('earthPoints')) || [];
  points.forEach(({ lat, lon, img }) => {
    addMarker(lat, lon);
  });
}

function addMarker(lat, lon) {
  const pos = latLonToCartesian(lat, lon);

  // Sfera rossa come marker
  const geometry = new THREE.SphereGeometry(0.1, 8, 8);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const marker = new THREE.Mesh(geometry, material);

  marker.position.copy(pos);
  scene.add(marker);
}

// latLonToCartesian (raggio 5 come la Terra)
function latLonToCartesian(lat, lon, radius = 5) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
}

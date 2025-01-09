// Creazione della scena, della camera e del renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Aggiunta di una luce
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 3, 5);
scene.add(light);

// Caricamento della texture della Terra
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('/static/textures/earth_texture.jpg');

// Creazione della geometria della sfera e del materiale
const geometry = new THREE.SphereGeometry(1, 64, 64);
const material = new THREE.MeshPhongMaterial({ map: earthTexture });
const earth = new THREE.Mesh(geometry, material);
scene.add(earth);

// Posizionamento della camera
camera.position.z = 3;

// Aggiunta dei controlli orbitali
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Funzione di animazione
function animate() {
    requestAnimationFrame(animate);
    earth.rotation.y += 0.001; // Rotazione lenta della Terra
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Gestione del ridimensionamento della finestra
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

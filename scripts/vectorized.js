let vectors = JSON.parse(localStorage.getItem('vectors'));
if (!vectors || vectors.length === 0) {
    vectors = [
        [0, 25, -80],
        [50, -30, 40],
        [-60, 80, -20]
    ];
}

function computeAggregatedVector(vecs) {
    if (vecs.length === 0) return [0, 0, 0];
    const sum = vecs.reduce((acc, curr) => [acc[0] + curr[0], acc[1] + curr[1], acc[2] + curr[2]], [0, 0, 0]);
    return [
        sum[0] / vecs.length,
        sum[1] / vecs.length,
        sum[2] / vecs.length
    ];
}

const vectorized = computeAggregatedVector(vectors);
document.getElementById('aggregated-vector').textContent = 
    `[${vectorized.map(n => n.toFixed(2)).join(', ')}]`;

const container = document.getElementById('webgl-container');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(150, 150, 200);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1.2);
pointLight.position.set(200, 300, 200);
scene.add(pointLight);

const gridHelper = new THREE.GridHelper(200, 20, 0x555555, 0x333333);
scene.add(gridHelper);

const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);


function createTextSprite(text, textColor = '#ffffff', backgroundColor = 'rgba(0,0,0,0.8)') {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = backgroundColor;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(10, 10, canvas.width - 20, canvas.height - 20, 15);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'Bold 42px Monospace';
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, depthTest: false });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(40, 10, 1);
    return sprite;
}

const labelX = createTextSprite('X: Economy', '#ff4444');
labelX.position.set(115, 0, 0);
scene.add(labelX);

const labelY = createTextSprite('Y: Politics', '#44ff44');
labelY.position.set(0, 115, 0);
scene.add(labelY);

const labelZ = createTextSprite('Z: Social', '#4444ff');
labelZ.position.set(0, 0, 115);
scene.add(labelZ);

// Axis Extremity Labels
const labelMarket = createTextSprite('+X (Market)', '#ff8888');
labelMarket.position.set(100, -10, 0);
scene.add(labelMarket);

const labelEquality = createTextSprite('-X (Equality)', '#ff8888');
labelEquality.position.set(-100, -10, 0);
scene.add(labelEquality);

const labelAuth = createTextSprite('+Y (Authoritarian)', '#88ff88');
labelAuth.position.set(0, 100, 15);
scene.add(labelAuth);

const labelLib = createTextSprite('-Y (Libertarian)', '#88ff88');
labelLib.position.set(0, -100, 15);
scene.add(labelLib);

const labelNat = createTextSprite('+Z (Internationalism)', '#8888ff');
labelNat.position.set(0, -10, 100);
scene.add(labelNat);

const labelInt = createTextSprite('-Z (Nationalism)', '#8888ff');
labelInt.position.set(0, -10, -100);
scene.add(labelInt);


function createThickArrow(targetVec, colorHex, radius = 1.8) {
    const group = new THREE.Group();
    const vectorObj = new THREE.Vector3(...targetVec);
    const length = vectorObj.length();
    if (length === 0) return group;

    const headLength = Math.min(length * 0.25, 12);
    const shaftLength = Math.max(length - headLength, 0.1);
    const shaftGeo = new THREE.CylinderGeometry(radius, radius, shaftLength, 16);
    shaftGeo.translate(0, shaftLength / 2, 0);
    const material = new THREE.MeshStandardMaterial({ 
        color: colorHex, 
        roughness: 0.2, 
        metalness: 0.1 
    });
    const shaft = new THREE.Mesh(shaftGeo, material);

    const headGeo = new THREE.ConeGeometry(radius * 2.5, headLength, 16);
    headGeo.translate(0, headLength / 2, 0);
    const head = new THREE.Mesh(headGeo, material);
    head.position.y = shaftLength;

    group.add(shaft);
    group.add(head);

    const direction = vectorObj.clone().normalize();
    group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

    return group;
}

function createPointMarker(targetVec, colorHex, radius = 3.5) {
    const sphereGeo = new THREE.SphereGeometry(radius, 16, 16);
    const sphereMat = new THREE.MeshStandardMaterial({ 
        color: colorHex, 
        roughness: 0.2, 
        metalness: 0.2 
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.position.set(...targetVec);
    return sphere;
}

vectors.forEach((v) => {
    const pointMarker = createPointMarker(v, 0xef4444, 3.5);
    scene.add(pointMarker);
});

const summaryGroup = createThickArrow(vectorized, 0x00f0ff, 2.0);
scene.add(summaryGroup);


window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();


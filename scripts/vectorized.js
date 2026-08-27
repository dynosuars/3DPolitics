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
            // Thick blue arrow from origin
            const arrowGroup = createThickArrow(v, 0x1b48fa, 1.5);
            scene.add(arrowGroup);

            // Red point sphere at terminal coordinate (x, y, z)
            const pointMarker = createPointMarker(v, 0xef4444, 3.5);
            scene.add(pointMarker);
        });


        const summaryGroup = createThickArrow(vectorized, 0x00f0ff, 2.0);
        scene.add(summaryGroup);

        const summaryPoint = createPointMarker(vectorized, 0xff0000, 1.5);
        scene.add(summaryPoint);

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
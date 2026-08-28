async function findvectorized(vec3) {
    const response = await fetch('assets/people/people.json');
    let fileName = 'EAI.json'; // Default file name
    await response.json().then(data => {
        const bitX = (vec3[0] <= 0)? 1 : 0;
        const bitY = (vec3[1] <= 0)? 1 : 0;
        const bitZ = (vec3[2] <= 0)? 1 : 0;
        const bitIndex = (bitX << 2) | (bitY << 1) | bitZ;
        fileName = data.file[bitIndex];
    });
    return fileName;
}

async function fetchVectorsFromFile(fileName) {
    const base = 'assets/people';
    const response = await fetch(`${base}/${fileName}`);
    const data = await response.json();
    return data;
}

async function closest(vec3) {
    const fileName = await findvectorized(vec3);
    const data = await fetchVectorsFromFile(fileName);
    var similar = [];
    let p = null;
    let closestIdeology = data.ideology || "Centralist"; // Default ideology if not found
    let closestDistance = Infinity;

    if( distance([0, 0, 0], vec3) < 10 ) {
        closestIdeology = "Centralist";
    } 

    for( let i = 0; i < data.vectors.length; i++) {
        const vector = data.vectors[i];
        const dist = distance(vec3, vector.vectors);
        if (dist < closestDistance) {
            p = data.vectors[i];
            closestDistance = dist;
            similar.push(p);
        }
    }
    
    similar.sort((a, b) => distance(vec3, a.vectors) - distance(vec3, b.vectors));
    similar.shift(); // Remove the closest one since it's already stored in p

    return {
        similar: similar,
        closest: p,
        closestIdeology: closestIdeology
    };
}



function distance(vecA, vecB) {
    if (vecA.length !== vecB.length) {
        throw new Error('Vectors must be of the same length');
    }

    let sum = 0;
    for (let i = 0; i < vecA.length; i++) {
        sum += Math.pow(vecA[i] - vecB[i], 2);
    }
    return Math.sqrt(sum);
}
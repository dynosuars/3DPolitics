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
    return data.vectors;
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
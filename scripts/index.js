function configureGame(questionCount, randomed) {
    localStorage.setItem('configure', JSON.stringify({
        questionCount: questionCount,
        randomed: randomed
    }));
}


function configureNOW() {
    let modal = document.createElement('dialog');
    modal.classList.add('modal');
    modal.innerHTML = `
        <h2>Configure Game</h2>
        <label for="questionCount">Number of Questions: (1-60, the more questions = more accurate results)</label>
        <input type="number" id="questionCount" name="questionCount" min="1" max="60" value="30">
        <label for="randomed">Randomize Questions:</label>
        <input type="checkbox" id="randomed" name="randomed" checked>
        <button id="saveConfig">Start</button>
    `;
    document.body.appendChild(modal);
    modal.showModal();

    document.getElementById('saveConfig').addEventListener('click', () => {
        const questionCount = parseInt(document.getElementById('questionCount').value, 10);
        const randomed = document.getElementById('randomed').checked;
        configureGame(questionCount, randomed);
        closeModal();
        window.location.href = "game.html";
    });
}

var current = 0;
var questions = [];
var currentQuestion = {};

async function init() {
    try {
        const responses = await Promise.all([
        fetch('assets/questions/economics.json').then(res => res.json()),
        fetch('assets/questions/politics.json').then(res => res.json()),
        fetch('assets/questions/social.json').then(res => res.json())
        ]);

        questions = responses.map(f => f.questions).flat();
        
        current = 0; 
        console.log("Number of questions loaded:", questions.length);
    } catch (error) {
        console.error('Error loading questions:', error);
    }
}


function get() {
    if (questions.length === 0) {
        init().then(() => {
            if (questions.length > 0) {
                currentQuestion = questions[current];
                current++;
            } else {
                console.error('No questions available after fetching.');
            }
        });
    } else if(current < questions.length) {
        currentQuestion = questions[current];
        current++;
        console.log(currentQuestion);
    } else {
        console.error('No more questions available.');
    }
}
const input = document.getElementById("wordInput");
const searchBtn = document.getElementById("searchBtn");
const result = document.getElementById("result");

searchBtn.addEventListener("click", searchWord);

// Trigger search on Enter key
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        searchWord();
    }
});

function searchWord() {
    const word = input.value.trim();

    if (word === "") {
        alert("Please enter a word");
        return;
    }

    result.innerHTML = "Loading...";

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Word not found");
            }
            return response.json();
        })
        .then(data => displayResult(data))
        .catch(() => {
            result.innerHTML = `<p>❌ Word not found. Please try another word.</p>`;
        });
}

function displayResult(data) {
    const meaning = data[0].meanings[0];
    const definition = meaning.definitions[0];

    const phonetic = data[0].phonetic || "Not available";
    const example = definition.example || "Example not available";

    let audio = "";
    if (data[0].phonetics[0] && data[0].phonetics[0].audio) {
        audio = `
            <button class="audio-btn" onclick="playAudio('${data[0].phonetics[0].audio}')">
                🔊 Play Pronunciation
            </button>
        `;
    }

    result.innerHTML = `
        <h3>${data[0].word}</h3>
        <p><strong>Part of Speech:</strong> ${meaning.partOfSpeech}</p>
        <p><strong>Meaning:</strong> ${definition.definition}</p>
        <p><strong>Example:</strong> ${example}</p>
        <p><strong>Phonetic:</strong> ${phonetic}</p>
        ${audio}
    `;
}

function playAudio(url) {
    const audio = new Audio(url);
    audio.play();
}

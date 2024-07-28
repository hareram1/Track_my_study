document.addEventListener('DOMContentLoaded', (event) => {
    const addTopicButton = document.querySelector('.add-new-topic');
    const topicsContainer = document.querySelector('.left-section');
    const noteTitleInput = document.getElementById('note-title');
    const noteContentInput = document.getElementById('note-content');
    const saveNoteButton = document.getElementById('save-note');
    const notesContainer = document.getElementById('notes');
    const stopwatchTime = document.getElementById('time');
    const startStopButton = document.getElementById('startStop');
    const resetButton = document.getElementById('reset');

    let topics = JSON.parse(localStorage.getItem('topics')) || [];
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    let isStopwatchRunning = false;
    let stopwatchInterval;
    let stopwatchTimeElapsed = 0;

    renderTopics();
    renderNotes();

    addTopicButton.addEventListener('click', addNewTopic);
    saveNoteButton.addEventListener('click', saveNote);
    startStopButton.addEventListener('click', toggleStopwatch);
    resetButton.addEventListener('click', resetStopwatch);

    function addNewTopic() {
        const topicTitle = prompt('Enter the topic title:');
        if (topicTitle) {
            const days = parseInt(prompt('Enter the number of days to complete this topic:'), 10);
            if (isNaN(days)) {
                alert('Please enter a valid number of days.');
                return;
            }
            const newTopic = {
                id: Date.now(),
                title: topicTitle,
                days: days,
                streak: 0,
                completed: false,
            };
            topics.push(newTopic);
            localStorage.setItem('topics', JSON.stringify(topics));
            renderTopics();
        }
    }

    function deleteTopic(id) {
        topics = topics.filter(topic => topic.id !== id);
        localStorage.setItem('topics', JSON.stringify(topics));
        renderTopics();
    }

    function incrementStreak(id) {
        const topic = topics.find(topic => topic.id === id);
        if (topic && topic.streak < topic.days) {
            topic.streak += 1;
            if (topic.streak === topic.days) {
                topic.completed = true;
            }
            localStorage.setItem('topics', JSON.stringify(topics));
            renderTopics();
        }
    }

    function markTopicAsDone(id) {
        const topic = topics.find(topic => topic.id === id);
        if (topic) {
            topic.completed = true;
            localStorage.setItem('topics', JSON.stringify(topics));
            renderTopics();
        }
    }

    function renderTopics() {
        topicsContainer.innerHTML = '';
        topics.forEach(topic => {
            const topicCard = document.createElement('div');
            topicCard.className = 'topic';
            topicCard.innerHTML = `
                <div class="topic-header">
                    <h3>${topic.title}</h3>
                    <span class="delete-button" onclick="deleteTopic(${topic.id})">✖</span>
                </div>
                <div class="topic-body">
                    <p>Days: ${topic.days}</p>
                    <p>Streak: ${topic.streak}</p>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${(topic.streak / topic.days) * 100}%"></div>
                    </div>
                </div>
                <div class="topic-footer">
                    <button onclick="incrementStreak(${topic.id})" ${topic.streak >= topic.days ? 'disabled' : ''}>Add Streak</button>
                    <button onclick="markTopicAsDone(${topic.id})">${topic.completed ? 'Completed' : 'Mark as Done'}</button>
                </div>
            `;
            topicsContainer.appendChild(topicCard);
        });
    }

    function saveNote() {
        const noteTitle = noteTitleInput.value;
        const noteContent = noteContentInput.value;
        if (noteTitle && noteContent) {
            const newNote = {
                id: Date.now(),
                title: noteTitle,
                content: noteContent,
            };
            notes.push(newNote);
            localStorage.setItem('notes', JSON.stringify(notes));
            renderNotes();
            noteTitleInput.value = '';
            noteContentInput.value = '';
        }
    }

    function deleteNote(id) {
        notes = notes.filter(note => note.id !== id);
        localStorage.setItem('notes', JSON.stringify(notes));
        renderNotes();
    }

    function renderNotes() {
        notesContainer.innerHTML = '';
        notes.forEach(note => {
            const noteCard = document.createElement('div');
            noteCard.className = 'note';
            noteCard.innerHTML = `
                <h3>${note.title}</h3>
                <p>${note.content}</p>
                <span class="delete-note" onclick="deleteNote(${note.id})">✖</span>
            `;
            notesContainer.appendChild(noteCard);
        });
    }

    function toggleStopwatch() {
        if (isStopwatchRunning) {
            clearInterval(stopwatchInterval);
            startStopButton.textContent = 'Start';
        } else {
            stopwatchInterval = setInterval(() => {
                stopwatchTimeElapsed += 1;
                updateStopwatchDisplay();
            }, 1000);
            startStopButton.textContent = 'Stop';
        }
        isStopwatchRunning = !isStopwatchRunning;
    }

    function resetStopwatch() {
        clearInterval(stopwatchInterval);
        isStopwatchRunning = false;
        stopwatchTimeElapsed = 0;
        updateStopwatchDisplay();
        startStopButton.textContent = 'Start';
    }

    function updateStopwatchDisplay() {
        const hours = String(Math.floor(stopwatchTimeElapsed / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((stopwatchTimeElapsed % 3600) / 60)).padStart(2, '0');
        const seconds = String(stopwatchTimeElapsed % 60).padStart(2, '0');
        stopwatchTime.textContent = `${hours}:${minutes}:${seconds}`;
    }

    window.deleteTopic = deleteTopic;
    window.incrementStreak = incrementStreak;
    window.markTopicAsDone = markTopicAsDone;
    window.deleteNote = deleteNote;
});

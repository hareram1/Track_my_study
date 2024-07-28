const topics = JSON.parse(localStorage.getItem('topics')) || [];

function saveTopics() {
    localStorage.setItem('topics', JSON.stringify(topics));
}

function addNewTopic() {
    const name = prompt('Enter the topic name:');
    const days = prompt('Enter the number of days to complete:');

    if (name && days) {
        topics.push({ name, days: parseInt(days), streak: 0 });
        saveTopics();
        renderTopics();
    }
}

function incrementStreak(index) {
    if (topics[index].streak < topics[index].days) {
        topics[index].streak++;
        saveTopics();
        renderTopics();
    } else {
        alert('You have already completed this topic!');
    }
}

function deleteTopic(index) {
    topics.splice(index, 1);
    saveTopics();
    renderTopics();
}

function renderTopics() {
    const topicsContainer = document.getElementById('topics');
    topicsContainer.innerHTML = '';

    topics.forEach((topic, index) => {
        const topicElement = document.createElement('div');
        topicElement.className = 'topic';

        const topicHeader = document.createElement('div');
        topicHeader.className = 'topic-header';
        topicHeader.innerHTML = `<h3>${topic.name}</h3>`;

        const topicBody = document.createElement('div');
        topicBody.className = 'topic-body';
        topicBody.innerHTML = `
            <p><strong>Days:</strong> ${topic.days}</p>
            <p><strong>Streak:</strong> ${topic.streak}</p>
        `;

        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        const progress = document.createElement('div');
        progress.className = 'progress';
        progress.style.width = `${(topic.streak / topic.days) * 100}%`;
        progressBar.appendChild(progress);

        const topicFooter = document.createElement('div');
        topicFooter.className = 'topic-footer';
        topicFooter.innerHTML = `
            <span class="progress-label">${topic.streak}/${topic.days} days</span>
            <button onclick="incrementStreak(${index})"><i class="fas fa-check"></i> Mark as Done</button>
            <button class="delete-button" onclick="deleteTopic(${index})"><i class="fas fa-trash"></i> Delete</button>
        `;
        topicFooter.appendChild(progressBar);

        topicElement.appendChild(topicHeader);
        topicElement.appendChild(topicBody);
        topicElement.appendChild(topicFooter);

        topicsContainer.appendChild(topicElement);
    });
}

document.addEventListener('DOMContentLoaded', renderTopics);

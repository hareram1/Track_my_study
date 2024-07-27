let topics = JSON.parse(localStorage.getItem('topics')) || [];

function displayTopics() {
    const topicsDiv = document.getElementById('topics');
    topicsDiv.innerHTML = '';
    topics.forEach((topic, index) => {
        topicsDiv.innerHTML += `
            <div class="topic">
                <h3>${topic.topic}</h3>
                <p>Days: ${topic.days}</p>
                <p>Streak: ${topic.streak}</p>
                <p>Status: ${topic.completed ? "Completed" : "In Progress"}</p>
                <button onclick="markStudyDay('${topic.topic}')">Mark Study Day</button>
                <button class="delete-button" onclick="deleteTopic(${index})">Delete</button>
            </div>
        `;
    });
}

function saveTopics() {
    localStorage.setItem('topics', JSON.stringify(topics));
}

function addNewTopic() {
    const topicName = prompt("Enter topic name:");
    const days = parseInt(prompt("Enter number of days:"));
    topics.push({ topic: topicName, days: days, completed: false, streak: 0 });
    saveTopics();
    displayTopics();
}

function markStudyDay(topicName) {
    topics.forEach(topic => {
        if (topic.topic === topicName) {
            topic.streak += 1;
        }
    });
    checkDeadlines();
    saveTopics();
    displayTopics();
}

function deleteTopic(index) {
    topics.splice(index, 1);
    saveTopics();
    displayTopics();
}

function checkDeadlines() {
    topics.forEach(topic => {
        if (topic.streak >= topic.days) {
            topic.completed = true;
            alert(`Congratulations! You completed ${topic.topic} on time.`);
        } else if (topic.streak < topic.days && new Date().getTime() > new Date().getTime() + (topic.days * 24 * 60 * 60 * 1000)) {
            alert(`You missed the deadline for ${topic.topic}. Time for a punishment!`);
        }
    });
    saveTopics();
}

document.addEventListener('DOMContentLoaded', displayTopics);

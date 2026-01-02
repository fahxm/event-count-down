const form = document.getElementById("eventForm");
const eventList = document.getElementById("eventList");

let events = JSON.parse(localStorage.getItem("events")) || [];

form.addEventListener("submit", e => {
  e.preventDefault();

  const name = eventName.value;
  const date = new Date(eventDate.value).getTime();

  events.push({
    id: Date.now(),
    name,
    date,
    created: Date.now()
  });

  saveEvents();
  renderEvents();
  form.reset();
});

function saveEvents() {
  localStorage.setItem("events", JSON.stringify(events));
}

function renderEvents() {
  eventList.innerHTML = "";

  events.forEach(event => {
    const div = document.createElement("div");
    div.className = "event";

    div.innerHTML = `
      <h3>${event.name}</h3>
      <div class="time" id="time-${event.id}"></div>
      <div class="progress">
        <div class="progress-bar" id="bar-${event.id}"></div>
      </div>
      <button class="delete" onclick="deleteEvent(${event.id})">Delete</button>
    `;

    eventList.appendChild(div);
  });
}

function deleteEvent(id) {
  events = events.filter(event => event.id !== id);
  saveEvents();
  renderEvents();
}

function updateCountdowns() {
  const now = Date.now();

  events.forEach(event => {
    const diff = event.date - now;
    const timeEl = document.getElementById(`time-${event.id}`);
    const barEl = document.getElementById(`bar-${event.id}`);

    if (!timeEl) return;

    if (diff <= 0) {
      timeEl.textContent = "🎉 Event Started!";
      barEl.style.width = "100%";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    timeEl.textContent = `${days}d ${hours}h ${mins}m ${secs}s`;

    const total = event.date - event.created;
    const passed = now - event.created;
    const progress = Math.min((passed / total) * 100, 100);

    barEl.style.width = progress + "%";
  });
}

renderEvents();
setInterval(updateCountdowns, 1000);

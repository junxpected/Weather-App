const apiKey = "75c13a7b3104723bec569bb799333455";
const searchInput = document.querySelector("#searchInput");
const suggestionsList = document.querySelector("#city-suggestions");

let map;
let marker;

const iconMap = {
    "Clear": "clear.svg",
    "Clouds": "clouds.svg",
    "Rain": "rain.svg",
    "Drizzle": "drizzle.svg",
    "Thunderstorm": "thunderstorm.svg",
    "Snow": "snow.svg",
    "Mist": "atmosphere.svg",
    "Fog": "atmosphere.svg"
};

const videoMap = {
    "Clear": "assets/video/Clear.mp4",
    "Clouds": "assets/video/Clouds.mp4",
    "Rain": "assets/video/Rain.mp4",
    "Drizzle": "assets/video/Drizzle.mp4",
    "Thunderstorm": "assets/video/Thunderstorm.mp4",
    "Snow": "assets/video/Snow.mp4",
    "Mist": "assets/video/Mist.mp4",
    "Fog": "assets/video/Fog.mp4"
};

async function checkWeather(city) {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=uk`);
    if(res.status == 404) return alert("Місто не знайдено");
    const data = await res.json();

    document.querySelector("#city").innerHTML = data.name;
    document.querySelector("#temp").innerHTML = Math.round(data.main.temp) + "°";
    document.querySelector("#humidity").innerHTML = data.main.humidity;
    document.querySelector("#wind").innerHTML = data.wind.speed;
    document.querySelector("#feels").innerHTML = Math.round(data.main.feels_like);

    const weatherMain = data.weather[0].main;
    document.querySelector("#weatherIcon").src = `assets/weather/${iconMap[weatherMain] || "clear.svg"}`;

    const videoElement = document.querySelector("#bgVideo");
    const newVideo = videoMap[weatherMain] || videoMap["Clear"];
    
    videoElement.src = newVideo;
    videoElement.load(); 
    let playPromise = videoElement.play();
    if (playPromise !== undefined) {
        playPromise.catch(() => {});
    }

    const lat = data.coord.lat;
    const lon = data.coord.lon;

    if (!map) {
        map = L.map('map').setView([lat, lon], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        marker = L.marker([lat, lon]).addTo(map);
    } else {
        map.setView([lat, lon], 10);
        marker.setLatLng([lat, lon]);
    }

    getForecast(city);
    saveHistory(data.name);
}

async function getForecast(city) {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=uk`);
    const data = await res.json();
    const forecastDiv = document.querySelector("#forecast");
    forecastDiv.innerHTML = "";

    for (let i = 0; i < data.list.length; i += 8) {
        const day = data.list[i];
        const date = new Date(day.dt * 1000).toLocaleDateString('uk-UA', {weekday: 'short'});
        forecastDiv.innerHTML += `
            <div style="display:flex; flex-direction:column; align-items:center; font-size:14px;">
                <span>${date}</span>
                <img src="assets/weather/${iconMap[day.weather[0].main] || 'clear.svg'}" width="30">
                <span>${Math.round(day.main.temp)}°</span>
            </div>`;
    }
}

function saveHistory(city) {
    let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
    if (!history.includes(city)) {
        history.push(city);
        if (history.length > 5) history.shift();
        localStorage.setItem("weatherHistory", JSON.stringify(history));
    }
    renderHistory();
}

function renderHistory() {
    const history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
    document.querySelector("#history").innerHTML = history.map(city => 
        `<button class="history-btn" onclick="checkWeather('${city}')">${city}</button>`
    ).join("");
}

function handleSearch() {
    const cityName = searchInput.value.split(',')[0].trim();
    if(cityName) checkWeather(cityName);
    searchInput.value = "";
}

searchInput.addEventListener("input", async () => {
    const query = searchInput.value.trim();
    if (query.length < 3) return;
    const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`);
    const cities = await res.json();
    suggestionsList.innerHTML = cities.map(c => `<option value="${c.name}, ${c.country}">`).join("");
});

searchInput.addEventListener("keypress", (e) => { if(e.key === "Enter") handleSearch(); });

renderHistory();
checkWeather("Zhytomyr");
// Retrieve search history from localStorage (if any)
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

// Display search history on the page
function displaySearchHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    searchHistory.forEach(item => {
        const listItem = document.createElement('li');
        listItem.classList.add('history-item');
        listItem.textContent = item;
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => {
            removeHistoryItem(item);
        });
        listItem.appendChild(removeButton);
        historyList.appendChild(listItem);
    });
}

// Add a city to the search history
function addToHistory(city) {
    searchHistory.push(city);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    displaySearchHistory();
}

// Remove a city from the search history
function removeHistoryItem(city) {
    searchHistory = searchHistory.filter(item => item !== city);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    displaySearchHistory();
}

// Fetch weather data by city
function fetchWeatherByCity() {
    const apiKey = '1355a4282b27534eac5ffb04b9c9d37a'; // Replace with your own API key
    const city = document.getElementById('cityInput').value;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const weatherElement = document.getElementById('weather');
            const cityDisplayElement = document.getElementById('cityDisplay');
            if (data.cod === '404') {
                weatherElement.innerHTML = 'City not found';
                cityDisplayElement.innerHTML = '';
                return;
            }
            const temperature = Math.round(data.main.temp - 273.15); // Convert temperature from Kelvin to Celsius
            const description = data.weather[0].description;
            const iconCode = data.weather[0].icon;
            const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

            weatherElement.innerHTML = `
                <p>Current temperature in ${data.name}: ${temperature}°C</p>
                <p>Weather: ${description}</p>
                <img src="${iconUrl}" alt="Weather Icon">
            `;
            cityDisplayElement.innerHTML = `Showing weather for: ${data.name}`;
            addToHistory(data.name);
        })
        .catch(error => {
            console.log('Error fetching weather data:', error);
        });
}

// Clear search history
function clearHistory() {
    searchHistory = [];
    localStorage.removeItem('searchHistory');
    displaySearchHistory();
}

// Initialize the search history on page load
window.onload = function() {
    displaySearchHistory();
};

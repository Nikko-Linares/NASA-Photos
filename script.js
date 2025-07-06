// Get the date input element and set its value to today's date
const dateInput = document.getElementById('dateInput');
dateInput.valueAsDate = new Date();

// NASA API key
const API_KEY = 'EsuMbIgcshj3qPsHc7MUmUCX9jbyypLpaIGmiezi';

// OMDb API key and base URL
const OMDB_API_KEY = 'e967ab0f';
const OMDB_BASE_URL = 'https://www.omdbapi.com/';

// Fetch and display the APOD for a specific date
async function fetchPhoto(date) {
    const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayPhoto(data); // Show the single photo
    } catch (error) {
        console.error('Error fetching photo:', error);
    }
}

// Display a single photo (used for the date picker)
function displayPhoto(data) {
    let photoContainer = document.getElementById('photo-container');
    if (!photoContainer) {
        // Create the container if it doesn't exist
        photoContainer = document.createElement('div');
        photoContainer.id = 'photo-container';
        document.body.appendChild(photoContainer);
    }
    // Show the photo details with modal trigger
    photoContainer.innerHTML = `
        <div class="photo-card">
            <h3>${data.title}</h3>
            <img src="${data.url}" alt="${data.title}" class="modal-trigger">
            <p>${data.explanation.substring(0, 100)}...</p>
        </div>
    `;

    // Add click event to open modal for this image
    document.querySelector('.modal-trigger').addEventListener('click', function() {
        openModal(data);
    });
}

// Fetch and display multiple random APODs (for the gallery grid)
async function fetchPhotos(count = 4) {
    const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&count=${count}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayPhotos(data); // Show the grid of photos
    } catch (error) {
        console.error('Error fetching photos:', error);
    }
}

// Display multiple photos in a grid layout
function displayPhotos(dataArray) {
    const photoContainer = document.getElementById('photo-container');
    photoContainer.innerHTML = dataArray.map((data, idx) => `
        <div class="photo-card">
            <h3>${data.title}</h3>
            <img src="${data.url}" alt="${data.title}" data-idx="${idx}" class="modal-trigger">
            <p>${data.explanation.substring(0, 100)}...</p>
        </div>
    `).join('');

    // Add click event listeners to images for modal
    document.querySelectorAll('.modal-trigger').forEach(img => {
        img.addEventListener('click', function() {
            const idx = this.getAttribute('data-idx');
            const photo = dataArray[idx];
            openModal(photo);
        });
    });
}

// Modal logic
function openModal(photo) {
    document.getElementById('modal-title').textContent = photo.title;
    document.getElementById('modal-img').src = photo.url;
    document.getElementById('modal-img').alt = photo.title;
    document.getElementById('modal-desc').textContent = photo.explanation;
    document.getElementById('modal').style.display = 'block';
}
document.getElementById('modal-close').onclick = function() {
    document.getElementById('modal').style.display = 'none';
};
window.onclick = function(event) {
    if (event.target == document.getElementById('modal')) {
        document.getElementById('modal').style.display = 'none';
    }
};

// --- OMDb API Integration ---

// Fetch and display movie data from OMDb API
async function fetchMovie(imdbID = 'tt3896198') {
    // Build the OMDb API URL
    const url = `${OMDB_BASE_URL}?i=${imdbID}&apikey=${OMDB_API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayMovie(data); // Show the movie info
    } catch (error) {
        console.error('Error fetching movie:', error);
    }
}

// Display movie data in the photo container (or you can use a separate container)
function displayMovie(data) {
    const photoContainer = document.getElementById('photo-container');
    // Append movie info below the NASA photos
    photoContainer.innerHTML += `
        <div class="photo-card">
            <h3>${data.Title} (${data.Year})</h3>
            <img src="${data.Poster}" alt="${data.Title}">
            <p>${data.Plot}</p>
        </div>
    `;
}

// --- Initial Fetches ---

// Fetch today's NASA photo on page load
fetchPhoto(dateInput.value);

// Fetch 4 random NASA photos on page load
fetchPhotos(4);

// Fetch a movie from OMDb on page load (you can change the IMDb ID)
fetchMovie('tt3896198');

// When the date changes, fetch and display the NASA photo for that date
dateInput.addEventListener('change', () => {
    fetchPhoto(dateInput.value);
});

// Fetch APOD images for a date range
async function fetchPhotosByDateRange(startDate, endDate) {
    const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayPhotos(data); // Show the grid of photos
    } catch (error) {
        console.error('Error fetching photos by date range:', error);
    }
}

// Example usage: fetchPhotosByDateRange('2024-07-01', '2024-07-04');

// Listen for range button click to fetch photos by date range
document.getElementById('rangeBtn').addEventListener('click', () => {
    const start = document.getElementById('startDate').value;
    const end = document.getElementById('endDate').value;
    if (start && end) {
        fetchPhotosByDateRange(start, end);
    }
});

// Angir variabelen "Attribution" verdien av linken til openstreetmap
const attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';    

// plasserer kartet
var map = L.map('map1', {
    center: [37.7749, -95.4194],
    zoom: 4,
    minZoom: 3,
    worldCopyJump: true,
});
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution }).addTo(map);

// Kjører en async funksjon som viser bryggerier etter stat som er et input på nettsiden
async function showBreweries(state = "") {
    const api_url = 'https://api.openbrewerydb.org/breweries?by_country=United%20States'; //Api linken lagres som "api_url"

    let response = await fetch(api_url); //Fetcher informasjon fra Api lenken og putter responsen som variabelen respons
    let data = await response.json(); //Henter informasjon som json og putter det i variabelen data 

    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    data.forEach(brewery => {
        if (brewery.state.toLowerCase() === state.toLowerCase()) {
            if (brewery.longitude < -50.69757) {
                if (brewery.latitude && brewery.longitude) { // Ensure brewery has location data
                    let website = brewery.website_url ? `<a href="${brewery.website_url}" target="_blank">${brewery.website_url}</a>` : 'No website';
                    let marker = L.marker([brewery.latitude, brewery.longitude]).addTo(map);
                    marker.bindPopup(`<b>${brewery.name}</b><br>Address: ${brewery.street}, ${brewery.city}, ${brewery.state}<br>Website: ${website}`);
                    marker.on('click', () => openInfo(brewery)); // Add click event to marker
                }
            }
        }
    });
}

async function showAll() {
    const api_url = 'https://api.openbrewerydb.org/breweries?by_country=United%20States';

    let response = await fetch(api_url);
    let data = await response.json();

    // Clear existing markers
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });
    
    data.forEach(brewery => {
            if (brewery.longitude < -50.69757) {
                if (brewery.latitude && brewery.longitude) { // Ensure brewery has location data
                    let website = brewery.website_url ? `<a href="${brewery.website_url}" target="_blank">${brewery.website_url}</a>` : 'No website';
                    let marker = L.marker([brewery.latitude, brewery.longitude]).addTo(map);
                    marker.bindPopup(`<b>${brewery.name}</b><br>Address: ${brewery.street}, ${brewery.city}, ${brewery.state}<br>Website: ${website}`);
                    marker.on('click', () => openInfo(brewery)); // Add click event to marker
                }
            }
        }
    )   
    };

    

// Function to handle search
function search() {
    let state = document.getElementById("searchbar").value;
    showBreweries(state);
}

// Event listener for the search button
document.getElementById('searchBtn').addEventListener('click', search);

// Optional: Add enter key functionality for the search input
document.getElementById('searchbar').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        search();
    }
});

// Show breweries on initial load
showBreweries();

function openInfo(brewery) {
    let infoBox = document.getElementById("infoboks");
    let website = brewery.website_url ? `<a href="${brewery.website_url}" target="_blank">${brewery.website_url}</a>` : 'No website';
    infoBox.innerHTML = `
        <h3>${brewery.name}</h3>
        <p><b>Address:</b> ${brewery.street}, ${brewery.city}, ${brewery.state}</p>
        <p><b>Website:</b> ${website}</p>`;
        openImage(brewery);
}

function openImage(brewery) {
    // Ensure the state is provided and valid
    if (brewery.state) {
        // Convert the state to lowercase and remove spaces for matching with image filenames
        let state = brewery.state.toLowerCase()
        
        // Generate the image filename based on the state
        let imageUrl = `Img-api/${state}.jpg`;
        
        // Get the image element (assuming you have an img element with id "card1")
        let imagedisp = document.getElementById("card1");
        
        // Set the src attribute of the image element to the generated image URL
        imagedisp.src = imageUrl;
    }
}


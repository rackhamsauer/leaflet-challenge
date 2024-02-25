// Function to fetch earthquake data and create map
async function createMap() {
    const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

    try {
        // Fetch earthquake data
        const response = await fetch(url);
        const data = await response.json();

        // Create map instance
        const map = L.map('map').setView([31.332177, -124.733253], 4);

        // Add tile layer
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles © Esri'
        }).addTo(map);

        // Define legend dictionary
        const legendDict = {
            'Depth < 10': 'yellow',
            'Depth < 30': 'blue',
            'Depth < 50': 'orange',
            'Depth < 70': 'green',
            'Depth < 90': 'red',
            'Depth >= 90': 'purple',
        };

        // Iterate through earthquake data
        data.features.forEach(earthquake => {
            const latitude = earthquake.geometry.coordinates[1];
            const longitude = earthquake.geometry.coordinates[0];
            const magnitude = earthquake.properties.mag;
            const depth = earthquake.geometry.coordinates[2];

            const radius = magnitude * 2;

            // Determine marker size based on magnitude
            let size;
            if (magnitude < 2) {
                size = 5;
            } else if (magnitude < 4) {
                size = 8;
            } else if (magnitude < 6) {
                size = 10;
            } else {
                size = 20;
            }

            // Determine marker color based on depth
            let color;
            if (depth < 10) {
                color = 'yellow';
            } else if (depth < 30) {
                color = 'blue';
            } else if (depth < 50) {
                color = 'orange';
            } else if (depth < 70) {
                color = 'green';
            } else if (depth < 90) {
                color = 'red';
            } else {
                color = 'purple';
            }

            // Create circle marker
            const marker = L.circleMarker([latitude, longitude], {
                radius: radius,
                color: color,
                fillColor: color,
                fillOpacity: 0.8
            }).addTo(map);

          // Create popup with earthquake information
const popupContent = `<b>Location:</b> ${latitude}, ${longitude}<br><b>Magnitude:</b> ${magnitude}<br><b>Depth:</b> ${depth} km`;
marker.bindPopup(popupContent);
        });

// Create legend control
const legendControl = L.control({ position: 'bottomright' });
legendControl.onAdd = function () {
    const div = L.DomUtil.create('div', 'info legend');
    let legendHTML = '';
    for (const key in legendDict) {
        // Add a colored square and text for each legend item
        legendHTML += `<div><span class="legend-color" style="background:${legendDict[key]}"></span>${key}</div>`;
    }
    div.innerHTML = legendHTML;
    return div;
};
legendControl.addTo(map);


    } catch (error) {
        console.error('Error fetching earthquake data:', error);
    }
}

// Call createMap function when the page loads
window.onload = createMap;

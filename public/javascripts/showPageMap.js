// Parse the campground data embedded in EJS
const campground = JSON.parse(document.getElementById("campground-data").textContent);


// Validate coordinates
if (!campground.coordinates || campground.coordinates.length !== 2) {
    console.error("Invalid campground coordinates:", campground.coordinates);
    // Fallback to default coordinates if missing (example: New Delhi)
    campground.coordinates = [77.2090, 28.6139];
}

// Initialize MapTiler SDK
maptilersdk.config.apiKey = maptilerApiKey;

const map = new maptilersdk.Map({
    container: "map",
    style: maptilersdk.MapStyle.HYBRID,
    center: campground.coordinates, // [lng, lat]
    zoom: 10
});


// Add marker at the campground location
new maptilersdk.Marker()
    .setLngLat(campground.coordinates)
    .setPopup(
        new maptilersdk.Popup({ offset: 25 })
            .setHTML(`<h3>${campground.title}</h3><p>${campground.location}</p>`)
    )
    .addTo(map);

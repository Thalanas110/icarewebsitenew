console.log("Leaflet integration module loaded.");

// Example function to initialize a Leaflet map
function initializeLeafletMap(containerId, options) {
    const map = L.map(containerId, options);
    return map;
}
export { initializeLeafletMap };




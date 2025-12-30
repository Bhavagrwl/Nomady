// mapboxgl.accessToken = mapToken;
// const map = new mapboxgl.Map({
//     container: 'map',
//     // style: "mapbox://styles/mapbox/streets-v12",
//     center: [-74.5, 40],
//     zoom: 9
// });
const map = new maplibregl.Map({
    container: 'map',
    style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
    center: listing.geometry.coordinates,
    zoom: 9
});

const marker=new maplibregl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates)   // [lng, lat]
    .setPopup(
        new maplibregl.Popup({ offset: 25 })
        .setHTML(`<h4>${listing.title}</h4><p>Exact Location provided after booking</p>`)
    )
    .addTo(map);
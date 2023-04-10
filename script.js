//map script | default ip 8.8.8.8
let map = L.map('map', {zoomControl: false}).setView([37.40599, -122.078514], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    zoomControl: false,
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//UI field script
const inputIp = document.querySelector('[data-search-ip]');
const submitBtn = document.querySelector('[data-submit]');
const ipPattern = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;

inputIp.addEventListener('input', () => {
    const err = document.querySelector('.err-msg');
    if(!ipPattern.test(inputIp.value) && inputIp.value.length) {
        err.classList.add('show-error');
        inputIp.classList.add('invalid');
    } else {
        err.classList.remove('show-error');
        inputIp.classList.remove('invalid');
    }
});

function setMapView(lat, lng) {
    map.setView([lat, lng]);
    L.marker([lat, lng], {icon: L.icon({iconUrl: "./images/icon-location.svg"})}).addTo(map);
};

function setAddressField(address, location, timezone, isp) {
    document.querySelector('[data-address]').innerText = address
    document.querySelector('[data-location]').innerText = location
    document.querySelector('[data-timezone]').innerText = timezone
    document.querySelector('[data-isp]').innerText = isp
}

async function processRequest() {
    const requestedIp = inputIp.value
    const requestLink = `https://geo.ipify.org/api/v2/country,city?apiKey=at_MRAb3x4KqNXy37KVHYnMOz1EV6tU5&ipAddress=${requestedIp}`;
    const response = await fetch(requestLink);
    const jsonResponse = await response.json();
    
    const address = jsonResponse.ip
    const location = `${jsonResponse.location.region}, ${jsonResponse.location.city} ${jsonResponse.location.postalCode}`
    const timezone = `UTC ${jsonResponse.location.timezone}`
    const isp = jsonResponse.isp
    setAddressField(address, location, timezone, isp)
    
    const lat = jsonResponse.location.lat
    const lng = jsonResponse.location.lng
    setMapView(lat, lng)
}

submitBtn.addEventListener('click', (e) => {
    e.preventDefault()
    if(ipPattern.test(inputIp.value) && inputIp.value.length) { 
        processRequest()
        inputIp.value = ""
    }
})
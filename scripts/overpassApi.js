
const serverUrl = "https://overpass-api.de/api/interpreter?data=";

function getCounties(countryCode,admin_level) {
  const query = `[out:json];area["ISO3166-1"="${countryCode.toUpperCase()}"][admin_level=2];rel(area)["admin_level"="${admin_level}"][boundary=administrative];out geom;`;
  return fetch(serverUrl + query).then((response) => response.json());
}

function getCountry(countryCode){
    const query = `[out:json];rel["ISO3166-1"="${countryCode.toUpperCase()}"][admin_level=2];out geom;`;
    return fetch(serverUrl + query).then((response) => response.json());
}

function getCitiesOfCountry(countryId) {
    const query = `[out:json];area["ISO3166-1"="${countryId.toUpperCase()}"][admin_level=2];rel(area)["admin_level"="8"][boundary=administrative];out geom;`;
    return fetch(serverUrl + query).then((response) => response.json());
}

function getCitiesOfCounty(countyName,admin_level) {
    const query = `[out:json];area["name"="${countyName}"][admin_level="${admin_level}"];rel(area)["admin_level"="8"][boundary=administrative];out geom;`;
    return fetch(serverUrl + query).then((response) => response.json());
}
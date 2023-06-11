let game = {
  type: "",
  country: "",
  county: "",
  geojson: {},
  state: {
  },
  teams: [
    { color: "#AA4A44", name: "FirstTeam" },
    { color: "#228B22", name: "SecondTeam" },
  ],
};

let geojson = null;
let leafletMap = null;
let gameInfoBox = null;
let mapInfoBox = null;
let popup = null


async function launchGame() {
  main.hidden = false;
  header.hidden = true;
  options.hidden = true;

  await prepareGeoJson();

  leafletMap = initMap();
  gameInfoBox = getGameInfoBox();
  mapInfoBox = getMapInfoBox();
  popup = L.popup({
    closeOnClick: false,
    autoClose: false
  });


  mapInfoBox.addTo(leafletMap);
  gameInfoBox.addTo(leafletMap);

  draw();
}

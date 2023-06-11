function initMap() {
  const map = L.map("map").setView(
    game.geojson.features[0].geometry.coordinates[0][0].slice().reverse(),
    10
  );

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  return map;
}

async function prepareGeoJson() {
  if (game.type == "country-cities") {
    game.geojson = osmtogeojson(await getCitiesOfCountry(game.country));
  }
  if (game.type == "country-counties") {
    game.geojson = osmtogeojson(await getCounties(game.country));
  }
  if (game.type == "county-cities") {
    game.geojson = osmtogeojson(await getCitiesOfCounty(game.county));
  }

  game.geojson.features = game.geojson.features.filter(
    (a) => a.geometry.type == "Polygon" || a.geometry.type == "MultiPolygon"
  );

  game.geojson.features.map((feature) => {
    feature.properties.area = area(feature);
  });
}

function getMapInfoBox() {
  const info = L.control();

  info.onAdd = function (map) {
    this._div = L.DomUtil.create("div", "info");
    this.update();
    return this._div;
  };

  info.update = function (props) {
    if (props) {
      this._div.innerHTML = "<b>" + props.name + "</b>";
      this._div.innerHTML += "<h4>Size: </h4>";
      this._div.innerHTML += props.size.toFixed(2) + " km<sup>2</sup>";

      this._div.innerHTML += "<h4>Occupied by: </h4>" + props.occupiedBy;

      if (props.locked) {
        this._div.innerHTML += "<br/><b>Locked</b>";
      }
    } else {
      this._div.innerHTML = "Hover over a settlement";
    }
  };

  return info;
}

function getGameInfoBox() {
  const test = L.control({ position: "bottomright" });

  test.onAdd = function (map) {
    this._div = L.DomUtil.create("div", "info");
    this.update();
    return this._div;
  };

  test.update = function (props) {
    this._div.innerHTML = "<h4>Game State</h4>";

    for (let i in game.teams) {
      const team = game.teams[i];

      let total = 0;

      for (let j in game.state) {
        if (game.state[j].team == i) {
          total += game.geojson.features.find((a) => a.id == j).properties.area;
        }
      }

      this._div.innerHTML += `<b>${team.name}</b>: ${total.toFixed(
        2
      )} km<sup>2</sup><br/>`;
    }
  };

  return test;
}

function style(feature) {
  const teamId = game.state[feature.id]?.team;
  const team = game.teams[teamId];

  return {
    fillColor: team?.color || "#FFFFFF",
    fillOpacity: 0.6,
    weight: 2,
    opacity: 1,
    color: team?.color || "#808080",
  };
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: (e) => {
      const layer = e.target;

      layer.setStyle({
        weight: 5,
        color: "#666",
        dashArray: "",
        fillOpacity: 0.7,
      });

      layer.bringToFront();
      mapInfoBox.update({
        name: layer.feature.properties.name,
        size: layer.feature.properties.area,
        occupiedBy:
          game.teams[game.state[layer.feature.id]?.team]?.name || "Nobody",
        locked: game.state[layer.feature.id]?.locked,
      });
    },
    mouseout: (e) => {
      geojson.resetStyle(e.target);
      mapInfoBox.update();
    },
    click: (e) => {
      const targetId = e.target.feature.id;

      popup.setLatLng(e.latlng)
      openControls(targetId);
      popup.openOn(leafletMap);

      leafletMap.fitBounds(e.target.getBounds());
    },
  });
}

function draw() {
  if (geojson) geojson.remove();
  geojson = L.geoJson(game.geojson, { style, onEachFeature }).addTo(leafletMap);
}

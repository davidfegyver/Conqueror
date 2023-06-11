welcomeStart.onclick = function () {
  welcome.hidden = true;
  options.hidden = false;
};

welcomeInvite.onclick = function () {
  welcome.hidden = true;
  invite.hidden = false;
};

gameTypeSelect.onchange = function () {
  gameType.hidden = true;
  game.type = gameTypeSelect.value;

  country.hidden = false;
  setupCountrySelect();
};

countrySelect.onchange = function () {
  country.hidden = true;
  game.country = countrySelect.value;

  if (game.type.startsWith("country")) {
    launchGameButton.hidden = false;
  } else {
    county.hidden = false;
    setupCountySelect(game.country,game.type.split("-")[1]);
  }
};

countySelect.onchange = function () {
  game.county = countySelect.value;
  launchGameButton.hidden = false;
  county.hidden = true;
};

function setupCountrySelect() {
  for (let i of countries) {
    const country = document.createElement("option");
    country.value = i.i;
    country.innerText = i.n;
    countrySelect.appendChild(country);
  }
}
async function setupCountySelect(countryCode, admin_level) {
  const counties = await getCounties(countryCode,admin_level);
  for (let i of counties.elements) {
    const county = document.createElement("option");
    county.value = i.tags.name;
    county.innerText = i.tags.name;
    countySelect.appendChild(county);
  }
}

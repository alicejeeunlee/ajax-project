var $header = document.querySelector('#header');
var $pokedex = document.querySelector('.pokedex');
var $navHeartIcon = document.querySelector('.nav-heart-icon');
var $searchInput = document.querySelector('#search');
var $allView = document.querySelectorAll('.view');
var $homepage = document.querySelector('#homepage');
var $favorites = document.querySelector('#favorites');
var $favoritePokemon = document.querySelector('.favorite-pokemon');
var $noPokemon = document.querySelector('.no-pokemon');

function getPokemonEntry() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://pokeapi.co/api/v2/pokedex/2');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    var APIdata = xhr.response;
    var allPokemon = APIdata.pokemon_entries;
    var $row = document.querySelector('.all-pokemon');
    for (var i = 0; i < allPokemon.length; i++) {
      var pokemon = {};
      pokemon.entry_number = allPokemon[i].entry_number;
      pokemon.id = pokeID(pokemon.entry_number);
      pokemon.name = allPokemon[i].pokemon_species.name;
      $row.appendChild(renderPokemonEntries(pokemon));
    }
  });
  xhr.send();
}
getPokemonEntry();

function renderPokemonEntries(pokemon) {
  var $outerDiv = document.createElement('button');
  $outerDiv.setAttribute('data-pokeNum', pokemon.entry_number);
  $outerDiv.setAttribute('class', 'entries col-half col-third col-fifth justify-center');
  var $entryWrapDiv = document.createElement('div');
  $entryWrapDiv.setAttribute('class', 'entry-wrapper');
  $outerDiv.appendChild($entryWrapDiv);
  var $img = document.createElement('img');
  $img.setAttribute('class', 'entry-img');
  $img.setAttribute('src', 'images/pokemon/' + pokemon.entry_number + '.png');
  $img.setAttribute('alt', pokemon.name);
  $entryWrapDiv.appendChild($img);
  var $name = document.createElement('p');
  $name.setAttribute('class', 'entry-name');
  $name.textContent = capitalize(pokemon.name);
  $entryWrapDiv.appendChild($name);
  var $id = document.createElement('p');
  $id.setAttribute('class', 'entry-id');
  $id.textContent = pokemon.id;
  $entryWrapDiv.appendChild($id);
  return $outerDiv;
}

function getPokemonDetail(id) {
  var xhr2 = new XMLHttpRequest();
  xhr2.open('GET', 'https://pokeapi.co/api/v2/pokemon/' + id);
  xhr2.responseType = 'json';
  xhr2.addEventListener('load', function () {
    var APIdata = xhr2.response;
    var pokemon = {
      entry_number: APIdata.id,
      id: pokeID(id),
      name: APIdata.name,
      height: APIdata.height,
      weight: APIdata.weight,
      abilities: [],
      types: [],
      stats: []
    };
    for (var i = 0; i < APIdata.abilities.length; i++) {
      pokemon.abilities.push(APIdata.abilities[i].ability.name);
    }
    for (var k = 0; k < APIdata.types.length; k++) {
      pokemon.types.push(APIdata.types[k].type.name);
    }
    for (var j = 0; j < APIdata.stats.length; j++) {
      var stat = {};
      stat.name = APIdata.stats[j].stat.name;
      stat.base_stat = APIdata.stats[j].base_stat;
      pokemon.stats.push(stat);
    }
    data.currentPokemon = pokemon;
    getPokemonDescription(id);
  });
  xhr2.send();
}

function getPokemonDescription(id) {
  var xhr3 = new XMLHttpRequest();
  xhr3.open('GET', 'https://pokeapi.co/api/v2/pokemon-species/' + id);
  xhr3.responseType = 'json';
  xhr3.addEventListener('load', function () {
    var APIdata = xhr3.response;
    var allTextEntries = APIdata.flavor_text_entries;
    var englishText = [];
    for (var i = 0; i < allTextEntries.length; i++) {
      if (allTextEntries[i].language.name === 'en') {
        englishText.push(allTextEntries[i]);
      }
    }
    var description = englishText[0].flavor_text;
    data.currentPokemon.description = editDescription(description);
    var $card = renderPokemonCard(data.currentPokemon);
    var $main = document.querySelector('main');
    $main.appendChild($card);
  });
  xhr3.send();
}

function renderPokemonCard(pokemon) {
  var $cardWrapper = document.createElement('div');
  $cardWrapper.setAttribute('data-pokenum', pokemon.entry_number);
  $cardWrapper.className = 'card-wrapper ' + data.currentPokemon.types[0];
  var $cardContainer = document.createElement('div');
  $cardContainer.className = 'container';
  $cardWrapper.appendChild($cardContainer);
  var $cardNav = document.createElement('div');
  $cardNav.className = 'row card-nav';
  $cardContainer.appendChild($cardNav);
  var $backDiv = document.createElement('div');
  $backDiv.className = 'col-half flex align-center';
  $cardNav.appendChild($backDiv);
  var $backIcon = document.createElement('i');
  $backIcon.className = 'fa-solid fa-chevron-down fa-2xl';
  var $backButton = document.createElement('button');
  $backButton.appendChild($backIcon);
  $backDiv.appendChild($backButton);
  $backButton.addEventListener('click', function handleBackClick(event) {
    if (event.target.tagName === 'I' && data.view === 'all') {
      $cardWrapper.remove();
      showHomepage();
    } else if (event.target.tagName === 'I' && data.view === 'favorites') {
      if (data.favorites.length === 0) {
        var lastFavorite = $favorites.querySelector('[data-pokenum]');
        lastFavorite.remove();
      }
      $cardWrapper.remove();
      renderFavoriteEntries();
      showFavorites();
    }
  });
  var $viewDiv = document.createElement('div');
  $viewDiv.className = 'col-half flex flex-end align-center';
  $cardNav.appendChild($viewDiv);
  var $infoIcon = document.createElement('img');
  $infoIcon.className = 'info-icon';
  $infoIcon.setAttribute('src', 'images/info-icon.png');
  $infoIcon.setAttribute('alt', 'info-icon');
  var $infoButton = document.createElement('button');
  $infoButton.appendChild($infoIcon);
  $viewDiv.appendChild($infoButton);
  $infoButton.addEventListener('click', function handleInfoClick(event) {
    if (event.target.tagName === 'IMG') {
      showInfo();
    }
  });
  var $statsIcon = document.createElement('i');
  $statsIcon.className = 'fa-solid fa-align-left fa-2xl';
  var $statsButton = document.createElement('button');
  $statsButton.appendChild($statsIcon);
  $viewDiv.appendChild($statsButton);
  $statsButton.addEventListener('click', function handleStatsClick(event) {
    if (event.target.tagName === 'I') {
      showStats();
    }
  });
  var $heartIcon = document.createElement('i');
  $heartIcon.className = 'heart-icon fa-solid fa-heart fa-2xl';
  var $heartButton = document.createElement('button');
  $heartButton.appendChild($heartIcon);
  for (var i = 0; i < data.favorites.length; i++) {
    if (data.currentPokemon.entry_number === data.favorites[i].entry_number) {
      $heartIcon.className = 'heart-icon fa-solid fa-heart fa-2xl favorite';
      break;
    }
  }
  $viewDiv.appendChild($heartButton);
  $heartIcon.addEventListener('click', function addToFavorite(event) {
    var $heartIcon = document.querySelector('.heart-icon');
    var liked = data.currentPokemon;
    if (event.target.tagName === 'I' && event.target.classList.contains('favorite')) {
      $heartIcon.classList.remove('favorite');
      for (var i = 0; i < data.favorites.length; i++) {
        if (data.favorites[i].entry_number === data.currentPokemon.entry_number) {
          data.favorites.splice(i, 1);
        }
      }
    } else {
      $heartIcon.classList.add('favorite');
      if (data.favorites.length === 0) {
        data.favorites.unshift(liked);
      } else {
        for (var k = 0; k < data.favorites.length; k++) {
          if (liked.entry_number === data.favorites[k].entry_number) {
            return;
          }
        }
        data.favorites.unshift(liked);
      }
    }
  });
  var $cardImg = renderPokemonImg(pokemon);
  $cardContainer.appendChild($cardImg);
  var $cardDetails = renderPokemonDetails(pokemon);
  $cardContainer.appendChild($cardDetails);
  return $cardWrapper;
}

function renderPokemonImg(pokemon) {
  var $row = document.createElement('div');
  $row.className = 'row';
  var $cardImgWrapper = document.createElement('div');
  $cardImgWrapper.className = 'col-full card-img-wrapper';
  $row.appendChild($cardImgWrapper);
  var $cardImg = document.createElement('img');
  $cardImg.className = 'card-img';
  $cardImg.setAttribute('src', 'images/pokemon/' + pokemon.entry_number + '.png');
  $cardImg.setAttribute('alt', pokemon.name);
  $cardImgWrapper.appendChild($cardImg);
  return $row;
}

function renderPokemonDetails(pokemon) {
  var $row = document.createElement('div');
  $row.className = 'row justify-center text-boundary';
  var $nameDiv = document.createElement('div');
  $nameDiv.className = 'col-full col-desktop-two-third col-desktop-half card-text-padding';
  $row.appendChild($nameDiv);
  var $id = document.createElement('p');
  $id.className = 'card-id';
  $id.textContent = pokemon.id;
  $nameDiv.appendChild($id);
  var $name = document.createElement('p');
  $name.className = 'card-name';
  $name.textContent = capitalize(pokemon.name);
  $nameDiv.appendChild($name);
  $nameDiv.appendChild(renderTypeBox(data.currentPokemon.types));
  var $infoDiv = document.createElement('div');
  $infoDiv.setAttribute('id', 'info');
  $infoDiv.className = 'row info-box';
  $nameDiv.appendChild($infoDiv);
  var $infoCol = document.createElement('div');
  $infoCol.className = 'col-full';
  $infoDiv.appendChild($infoCol);
  var $abilities = document.createElement('p');
  if (pokemon.abilities.length === 1) {
    $abilities.textContent = 'Abilities: ' + capitalize(pokemon.abilities[0]);
  } else {
    $abilities.textContent = 'Abilities: ' + capitalize(pokemon.abilities[0]) + ', ' + capitalize(pokemon.abilities[1]);
  }
  var $height = document.createElement('p');
  $height.textContent = 'Height: ' + heightConversion(pokemon.height);
  var $weight = document.createElement('p');
  $weight.textContent = 'Weight: ' + weightConversion(pokemon.weight);
  var $description = document.createElement('p');
  $description.textContent = pokemon.description;
  $infoCol.appendChild($abilities);
  $infoCol.appendChild($height);
  $infoCol.appendChild($weight);
  $infoCol.appendChild($description);
  var $statsDiv = document.createElement('div');
  $statsDiv.setAttribute('id', 'stats');
  $statsDiv.className = 'row stats-box hidden';
  $nameDiv.appendChild($statsDiv);
  $statsDiv.appendChild(renderStatsName(data.currentPokemon.stats));
  $statsDiv.appendChild(renderStatsNum(data.currentPokemon.stats));
  $statsDiv.appendChild(renderStatsBar(data.currentPokemon.stats, data.currentPokemon.types));
  return $row;
}

function renderTypeBox(types) {
  var $typeDiv = document.createElement('div');
  $typeDiv.className = 'type-box';
  var $allTypes = [];
  var $div = document.createElement('div');
  $div.className = 'type-1 ' + types[0];
  if (types.length === 1) {
    $div.textContent = capitalize(types[0]);
    $allTypes.push($div);
  } else {
    $div.textContent = capitalize(types[0]);
    $allTypes.push($div);
    var $div2 = document.createElement('div');
    $div2.className = 'type-2 ' + types[1];
    $div2.textContent = capitalize(types[1]);
    $allTypes.push($div2);
  }
  for (var i = 0; i < $allTypes.length; i++) {
    $typeDiv.appendChild($allTypes[i]);
  }
  return $typeDiv;
}

function renderStatsName(stats) {
  var $statsName = document.createElement('div');
  $statsName.className = 'col-two-eighth col-desktop-eighth stats-text';
  var $allP = [];
  for (var i = 0; i < stats.length; i++) {
    var $p = document.createElement('p');
    if (stats[i].name === 'hp') {
      $p.textContent = 'HP';
      $allP.push($p);
    } else if (stats[i].name === 'special-attack') {
      $p.textContent = 'Sp. Atk';
      $allP.push($p);
    } else if (stats[i].name === 'special-defense') {
      $p.textContent = 'Sp. Def';
      $allP.push($p);
    } else {
      $p.textContent = capitalize(stats[i].name);
      $allP.push($p);
    }
  }
  for (var k = 0; k < $allP.length; k++) {
    $statsName.appendChild($allP[k]);
  }
  return $statsName;
}

function renderStatsNum(stats) {
  var $statsNum = document.createElement('div');
  $statsNum.className = 'col-eighth stats-num';
  var $allP = [];
  for (var i = 0; i < stats.length; i++) {
    var $p = document.createElement('p');
    $p.setAttribute('id', stats[i].name);
    $p.textContent = stats[i].base_stat;
    $allP.push($p);
  }
  for (var k = 0; k < $allP.length; k++) {
    $statsNum.appendChild($allP[k]);
  }
  return $statsNum;
}

function renderStatsBar(stats, types) {
  var $statsBar = document.createElement('div');
  $statsBar.className = 'col-five-eighth col-desktop-six-eighth';
  var $allDiv = [];
  for (var i = 0; i < stats.length; i++) {
    var $div = document.createElement('div');
    $div.setAttribute('id', stats[i].name + '-bar');
    $div.className = 'bar';
    if (types.length === 1) {
      $div.style.background = statsBarLinearGradient(data.typeColors[types[0]], statsCap255(stats[i].base_stat));
    } else {
      $div.style.background = statsBarLinearGradient(data.typeColors[types[1]], statsCap255(stats[i].base_stat));
    }
    $allDiv.push($div);
  }
  for (var k = 0; k < $allDiv.length; k++) {
    $statsBar.appendChild($allDiv[k]);
  }
  return $statsBar;
}

function showInfo() {
  var $info = document.querySelector('#info');
  var $stats = document.querySelector('#stats');
  $info.className = 'row info-box';
  $stats.className = 'row stats-box hidden';
}

function showStats() {
  var $info = document.querySelector('#info');
  var $stats = document.querySelector('#stats');
  $info.className = 'row info-box hidden';
  $stats.className = 'row stats-box';
}

function capitalize(name) {
  return name[0].toUpperCase() + name.slice(1).toLowerCase();
}

function pokeID(num) {
  return num.toString().padStart(3, '0');
}

function heightConversion(decimeter) {
  var feet = decimeter * 0.328084;
  var ft = Math.floor(feet);
  var inches = Math.round((feet - ft) * 12);
  return ft.toString() + "' " + inches.toString() + '"';
}

function weightConversion(hectogram) {
  var pounds = hectogram * 0.220462;
  var lbs = Math.round(pounds * 10) / 10;
  return lbs.toString() + ' lbs';
}

function editDescription(string) {
  var edit = string.replaceAll('\n', ' ');
  edit = edit.replaceAll('\f', ' ');
  edit = edit.replaceAll('POKéMON', 'Pokémon');
  return edit;
}

function statsCap255(num) {
  var percent = (num / 255) * 100;
  percent = percent.toString() + '%';
  return percent;
}

function statsBarLinearGradient(type, percent) {
  return 'linear-gradient(90deg, ' + type + ' ' + percent + ', rgba(230, 230, 230, 1) ' + percent + ')';
}

function renderFavoriteEntries() {
  var $favoritePokemon = document.querySelector('.favoritePokemon');
  if (data.favorites.length === 0) {
    showNoFavePokemonMsg();
  } else {
    hideNoFavePokemonMsg();
    while ($favoritePokemon.firstChild) {
      $favoritePokemon.removeChild($favoritePokemon.firstChild);
    }
    for (var i = 0; i < data.favorites.length; i++) {
      $favoritePokemon.appendChild(renderPokemonEntries(data.favorites[i]));
    }
  }
}

function viewSwap(view) {
  for (var j = 0; j < $allView.length; j++) {
    if ($allView[j].getAttribute('data-view') === view) {
      $allView[j].className = 'container view';
    } else {
      $allView[j].className = 'container view hidden';
    }
  }
}

function hideHomepage() {
  $header.className = 'container nav hidden';
  $homepage.className = 'container hidden';
}

function showHomepage() {
  $header.className = 'container nav';
  $homepage.className = 'container';
}

function hideFavorites() {
  $header.classList.add('hidden');
  $favoritePokemon.classList.add('hidden');
}

function showFavorites() {
  $header.classList.remove('hidden');
  $favoritePokemon.classList.remove('hidden');
}

function hideNoFavePokemonMsg() {
  $noPokemon.classList.add('hidden');
}

function showNoFavePokemonMsg() {
  $noPokemon.classList.remove('hidden');
}

$pokedex.addEventListener('click', function handlePokedexClick(event) {
  $navHeartIcon.classList.remove('favorite');
  data.view = 'all';
  viewSwap(data.view);
});

$homepage.addEventListener('click', function handlePokemonClick(event) {
  if (event.target.tagName === 'IMG' || event.target.tagName === 'P') {
    data.currentPokemon = {};
    var closestEntryDiv = event.target.closest('.entries');
    var id = Number.parseInt(closestEntryDiv.dataset.pokenum);
    hideHomepage();
    getPokemonDetail(id);
  }
});

$navHeartIcon.addEventListener('click', function showFavorite(event) {
  if (data.view === 'all') {
    $navHeartIcon.classList.add('favorite');
    data.view = 'favorites';
    viewSwap(data.view);
    renderFavoriteEntries();
  } else {
    $navHeartIcon.classList.remove('favorite');
    data.view = 'all';
    viewSwap(data.view);
  }
}
);

$searchInput.addEventListener('input', function search() {
  var $searchIcon = document.querySelector('.fa-magnifying-glass');
  $searchIcon.classList.add('hidden');
  var $allEntries = document.querySelectorAll('.entries');
  var $searchInput = document.querySelector('#search').value;
  for (var i = 0; i < $allEntries.length; i++) {
    if ($allEntries[i].innerText.toLowerCase()
      .includes($searchInput.toLowerCase())) {
      $allEntries[i].classList.remove('hidden');
    } else {
      $allEntries[i].classList.add('hidden');
    }
  }
});

$favorites.addEventListener('click', function handleFavoritePokemonClick(event) {
  if (event.target.tagName === 'IMG' || event.target.tagName === 'P') {
    data.currentPokemon = {};
    var closestEntryDiv = event.target.closest('.entries');
    var id = Number.parseInt(closestEntryDiv.dataset.pokenum);
    hideFavorites();
    getPokemonDetail(id);
  }
});

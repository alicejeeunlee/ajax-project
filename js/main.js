function getPokemonEntry() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://pokeapi.co/api/v2/pokedex/2');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    var APIdata = xhr.response;
    var allPokemon = APIdata.pokemon_entries;
    var $row = document.querySelector('.allPokemon');
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

getPokemonDetail(1);

function getPokemonDetail(id) {
  var xhr2 = new XMLHttpRequest();
  xhr2.open('GET', 'https://pokeapi.co/api/v2/pokemon/' + id);
  xhr2.responseType = 'json';
  xhr2.addEventListener('load', function () {
    var APIdata = xhr2.response;
    // console.log(APIdata);
    data.currentPokemon.entry_number = APIdata.id;
    data.currentPokemon.id = pokeID(id);
    data.currentPokemon.name = APIdata.name;
    data.currentPokemon.height = APIdata.height;
    data.currentPokemon.weight = APIdata.weight;
    for (var i = 0; i < APIdata.abilities.length; i++) {
      data.currentPokemon.abilities.push(APIdata.abilities[i].ability.name);
    }
    for (var k = 0; k < APIdata.types.length; k++) {
      data.currentPokemon.types.push(APIdata.types[k].type.name);
    }
    for (var j = 0; j < APIdata.stats.length; j++) {
      var stat = {};
      stat.name = APIdata.stats[j].stat.name;
      stat.base_stat = APIdata.stats[j].base_stat;
      data.currentPokemon.stats.push(stat);
    }
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
    var description = APIdata.flavor_text_entries[0].flavor_text;
    data.currentPokemon.description = editDescription(description);
    renderPokemonImg(data.currentPokemon);
    renderPokemonDetails(data.currentPokemon);
  });
  xhr3.send();
}

function renderPokemonEntries(pokemon) {
  var $outerDiv = document.createElement('div');
  $outerDiv.setAttribute('id', pokemon.entry_number);
  $outerDiv.setAttribute('class', 'entries col-half col-third col-fifth col-seventh justify-center');
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
  // console.log($row);
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
  $height.textContent = heightConversion(pokemon.height);
  var $weight = document.createElement('p');
  $weight.textContent = weightConversion(pokemon.weight);
  var $description = document.createElement('p');
  $description.textContent = pokemon.description;
  $infoCol.appendChild($abilities);
  $infoCol.appendChild($height);
  $infoCol.appendChild($weight);
  $infoCol.appendChild($description);
  var $statsDiv = document.createElement('div');
  $statsDiv.className = 'row stats-box hidden';
  $nameDiv.appendChild($statsDiv);
  $statsDiv.appendChild(renderStatsName(data.currentPokemon.stats));
  $statsDiv.appendChild(renderStatsNum(data.currentPokemon.stats));
  $statsDiv.appendChild(renderStatsBar(data.currentPokemon.stats));
  // console.log($row);
}

var $header = document.querySelector('#header');
var $homepage = document.querySelector('#homepage');
var $card = document.querySelector('#card');
// var $info = document.querySelector('#info');
// var $stats = document.querySelector('#stats');

$homepage.addEventListener('click', handlePokemonClick);

function handlePokemonClick(event) {
  if (event.target.tagName === 'IMG' || event.target.tagName === 'P') {
    showCard();
    var closestEntryDiv = event.target.closest('.entries');
    var id = Number.parseInt(closestEntryDiv.id);
    return id;
  }
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

function showCard() {
  $header.className = 'container nav hidden';
  $homepage.className = 'container hidden';
  $card.className = 'card-wrapper';
}

// function hideCard() {
//   $header.className = 'container nav';
//   $homepage.className = 'container';
//   $card.className = 'card-wrapper hidden';
// }

function renderTypeBox(types) {
  var $typeDiv = document.createElement('div');
  $typeDiv.className = 'type-box';
  var $allTypes = [];
  var $div = document.createElement('div');
  $div.className = 'type-1';
  if (types.length === 1) {
    $div.textContent = capitalize(types[0]);
    $div.style.backgroundColor = data.typeColors[types[0]];
    $allTypes.push($div);
  } else {
    $div.textContent = capitalize(types[0]);
    $div.style.backgroundColor = data.typeColors[types[0]];
    $allTypes.push($div);
    var $div2 = document.createElement('div');
    $div2.className = 'type-2';
    $div2.textContent = capitalize(types[1]);
    $div2.style.backgroundColor = data.typeColors[types[1]];
    $allTypes.push($div2);
  }
  for (var i = 0; i < $allTypes.length; i++) {
    $typeDiv.appendChild($allTypes[i]);
  }
  return $typeDiv;
}

// var dummytype = ['fire'];
// var dummy2types = ['water', 'rock'];

function renderStatsName(stats) {
  var $statsName = document.createElement('div');
  $statsName.className = 'col-two-eighth col-desktop-eighth stats-text';
  var $allP = [];
  for (var i = 0; i < stats.length; i++) {
    var $p = document.createElement('p');
    if (stats[i].name === 'special-attack') {
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

function renderStatsBar(stats) {
  var $statsBar = document.createElement('div');
  $statsBar.className = 'col-five-eighth col-desktop-six-eighth';
  var $allDiv = [];
  for (var i = 0; i < stats.length; i++) {
    var $div = document.createElement('div');
    $div.setAttribute('id', stats[i].name + '-bar');
    $div.className = 'bar';
    $allDiv.push($div);
  }
  for (var k = 0; k < $allDiv.length; k++) {
    $statsBar.appendChild($allDiv[k]);
  }
  return $statsBar;
}

// var statsdummy = [{ name: 'hp', base_stat: 45 }, { name: 'attack', base_stat: 49 }, { name: 'defense', base_stat: 49 }, { name: 'special-attack', base_stat: 65 }, { name: 'special-defense', base_stat: 65 }, { name: 'speed', base_stat: 45 }];

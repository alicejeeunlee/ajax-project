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
    // var $cardContainer = document.querySelector('#card-container');
    renderPokemonImg(data.currentPokemon);
    renderPokemonDetails(data.currentPokemon);
    // console.log(data.currentPokemon);
  });
  xhr2.send();
  // console.log(data.currentPokemon);

}

getPokemonDetail(1);

function getPokemonDescription(id) {
  var xhr3 = new XMLHttpRequest();
  xhr3.open('GET', 'https://pokeapi.co/api/v2/pokemon-species/' + id);
  xhr3.responseType = 'json';
  xhr3.addEventListener('load', function () {
    var APIdata = xhr3.response;
    var description = APIdata.flavor_text_entries[0].flavor_text;
    data.currentPokemon.description = editDescription(description);
    // console.log(data.currentPokemon.description);
    // console.log(data.currentPokemon);
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
  var $typeDiv = document.createElement('div');
  $typeDiv.className = 'type-box';
  $nameDiv.appendChild($typeDiv);
  var $type1 = document.createElement('div');
  $type1.className = 'type-1';
  $type1.textContent = pokemon.types[0];
  var $type2 = document.createElement('div');
  $type2.className = 'type-2';
  if (pokemon.types.length === 1) {
    $typeDiv.appendChild($type1);
  } else {
    $typeDiv.appendChild($type1);
    $type2.textContent = pokemon.types[1];
    $typeDiv.appendChild($type2);
  }
  var $infoDiv = document.createElement('div');
  $infoDiv.className = 'row info-box';
  $nameDiv.appendChild($infoDiv);
  var $infoCol = document.createElement('div');
  $infoCol.className = 'col-full';
  $infoDiv.appendChild($infoCol);
  var $abilities = document.createElement('p');
  $abilities.textContent = 'Abilities: ' + capitalize(pokemon.abilities[0]) + ', ' + capitalize(pokemon.abilities[1]);
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
    // console.log(id);
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

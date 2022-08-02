function getPokemonData(id) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://pokeapi.co/api/v2/pokemon/' + id);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    var APIdata = xhr.response;
    var pokemon = {};
    var pokeID = id.toString().padStart(3, '0');
    pokemon.id = pokeID;
    pokemon.name = APIdata.name;
    pokemon.height = APIdata.height;
    pokemon.weight = APIdata.weight;
    pokemon.abilities = [];
    for (var i = 0; i < APIdata.abilities.length; i++) {
      pokemon.abilities.push(APIdata.abilities[i].ability.name);
    }
    pokemon.types = [];
    for (var k = 0; k < APIdata.types.length; k++) {
      pokemon.types.push(APIdata.types[k].type.name);
    }
    pokemon.stats = [];
    for (var j = 0; j < APIdata.stats.length; j++) {
      var stat = {};
      stat.name = APIdata.stats[j].stat.name;
      stat.base_stat = APIdata.stats[j].base_stat;
      pokemon.stats.push(stat);
    }
    pokemon.imgURL = APIdata.sprites.other['official-artwork'].front_default;
    data.pokemon.push(pokemon);
    var $row = document.querySelector('.allPokemon');
    $row.appendChild(renderPokemon(pokemon));
  });
  xhr.send();
}

for (var i = 1; i <= 151; i++) {
  getPokemonData(i);
}

function renderPokemon(pokemon) {
  var $outerDiv = document.createElement('div');
  $outerDiv.setAttribute('class', 'col-half col-third col-fifth col-seventh justify-center');
  var $entryWrapDiv = document.createElement('div');
  $entryWrapDiv.setAttribute('class', 'entry-wrap');
  if (pokemon.types.length === 1) {
    $entryWrapDiv.style.backgroundColor = '#' + data.typeColors[pokemon.types[0]];
  } else {
    $entryWrapDiv.style.background = 'linear-gradient(150deg, #' + data.typeColors[pokemon.types[0]] + ' 50%, #' + data.typeColors[pokemon.types[1]] + ' 50%)';
  }
  $outerDiv.appendChild($entryWrapDiv);
  var $img = document.createElement('img');
  $img.setAttribute('class', 'entry-img');
  $img.setAttribute('src', pokemon.imgURL);
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

function capitalize(word) {
  return word[0].toUpperCase() + word.slice(1).toLowerCase();
}

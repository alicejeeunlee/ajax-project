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

function renderPokemonEntries(pokemon) {
  var $outerDiv = document.createElement('div');
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

function capitalize(name) {
  return name[0].toUpperCase() + name.slice(1).toLowerCase();
}

function pokeID(num) {
  return num.toString().padStart(3, '0');
}

/* exported data */
var data = {
  pokemon: []
};

function getPokemonData(id) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://pokeapi.co/api/v2/pokemon/' + id);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    var APIdata = xhr.response;
    // console.log(APIdata);
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
    pokemon.img = APIdata.sprites.other['official-artwork'].front_default;
    data.pokemon.push(pokemon);
  });
  xhr.send();
}

for (var i = 1; i <= 151; i++) {
  getPokemonData(i);
}

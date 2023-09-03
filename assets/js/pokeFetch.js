const pokeAPI = {}

function parseJsonToModelPokemon(pokemonDetails) {
  // console.log(pokemonDetails)
  const pokemon = new Pokemon()
  pokemon.order = pokemonDetails.order
  pokemon.name = pokemonDetails.name

  const types = pokemonDetails.types.map(typeSlot => typeSlot.type.name)
  const [mainType] = types

  pokemon.types = types
  pokemon.type =  mainType
  pokemon.sprite = pokemonDetails.sprites.other.dream_world.front_default

  for(stats of pokemonDetails.stats){
    const stat = stats.base_stat
    switch(stats.stat.name){
      case 'hp':
        pokemon.statsData.hp = stat
        break
      case 'attack':
        pokemon.statsData.attack = stat
        break
      case 'defense':
        pokemon.statsData.defense = stat
        break
      case 'special-attack':
        pokemon.statsData.special_attack = stat
        break
      case 'special-defense':
        pokemon.statsData.special_defense = stat
        break
      case 'speed':
        pokemon.statsData.speed = stat
        break
    }
  }
  
  return pokemon
}

pokeAPI.getPokemonDetails = (pokemon) => {
  return fetch(pokemon.url).then(res => res.json()).then(parseJsonToModelPokemon)
}

pokeAPI.getPokemons = (offset = 0, limit = 9) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
  const result = fetch(url)
                .then(res => res.json())
                .then(res => res.results)
                .then(pokemons => pokemons.map(pokeAPI.getPokemonDetails))
                .then(detailReq => Promise.all(detailReq))
                .then(pokemonDetails => {
                  return pokemonDetails})
  return result
}

pokeAPI.getStatsPokemon = (pokemonName) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`

  return fetch(url)
  .then(res => res.json())
  .then(parseJsonToModelPokemon)
}

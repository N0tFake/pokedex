const pokemonStructHtmlRef = document.getElementById("pokemons-list")
const moreButtonRef = document.getElementById("morePokemon")

let offset = 0
const limit = 9

function convertPokemonToHTML(pokemon){
  // console.log(pokemon)
  const formattedNumber = `#${pokemon.order.toString().padStart(3, '0')}`;
  const pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
  const pokemonTypes = pokemon.types.map(type => `<li class="type ${type}">${type}</li>`).join('')
  const pokemonSprite =  `<img src=${pokemon.sprite} alt=${pokemon.name}>`

  const idRef = `${pokemon.name}-${pokemon.order}`

  return `
    <li id=${idRef} class="pokemon pokemon-card-main ${pokemon.type}">
      <span class="number">${formattedNumber}</span>
      <span class="name">${pokemonName}</span>
      <div class="detail">
          <ol class="types">
              ${pokemonTypes}
          </ol>
         ${pokemonSprite}
      </div>
    </li>
  `
}

function setClassNameProgressBar(stat){
  let className = ''
  if (stat >= 0 && stat <= 20 ){
    className = 'valor-color-red'
  } else if (stat > 20 && stat <= 50 ){
    className = 'valor-color-orange'
  } else if (stat > 50 && stat <= 70 ){
    className = 'valor-color-light-green'
  } else if (stat > 70 && stat <= 90 ){
    className = 'valor-color-green'
  } else if (stat > 90 && stat <= 100 ){
    className = 'valor-color-blue'
  } else if (stat > 100) {
    className = 'valor-color-purple'
  }

  return className
}

function setClassNameProgressBarTotal(stat){
  let className = ''
  if (stat >= 0 && stat <= 120 ){
    className = 'valor-color-red'
  } else if (stat > 120 && stat <= 300 ){
    className = 'valor-color-orange'
  } else if (stat > 300 && stat <= 420 ){
    className = 'valor-color-light-green'
  } else if (stat > 420 && stat <= 540 ){
    className = 'valor-color-green'
  } else if (stat > 540 && stat <= 600 ){
    className = 'valor-color-blue'
  } else if (stat > 600) {
    className = 'valor-color-purple'
  }

  return className
}

function renameStats(name){
  let newName = ''
  if (name == 'hp') newName = 'HP'
  else if (name == 'attack') newName = 'Attack'
  else if (name == 'defense') newName = 'Defense'
  else if (name == 'special_attack') newName = 'Sp. Atk'
  else if (name == 'special_defense') newName = 'Sp. Def'
  else if (name == 'speed') newName = 'Speed'

  return newName
}

function createListStatsHTML(listStats){
  const result = []

  result.push(listStats.map(stat => {
    let max = 100
    if(stat.name == 'Total') max = 600
    return `
    <div class="itens-stats">
       <span class="type-stat">${stat.name}</span>
       <span class="valor-stat">${stat.valor}</span>
       <progress class="progress-bar ${stat.className}" value="${stat.valor}" max="${max}"></progress>
     </div>
   `
  }).join(''))

  return result
}

function convertStatsPokemonToHTML(pokemon){
  console.log(pokemon)
  const classNameProgressBar = {}
  const formattedNumber = `#${pokemon.order.toString().padStart(3, '0')}`;
  const pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
  const pokemonTypes = pokemon.types.map(type => `<li class="type ${type}">${type}</li>`).join('')
  const pokemonSprite =  `<img src=${pokemon.sprite} alt=${pokemon.name}>`
  
  const statsData = pokemon.statsData
  let totalValor = 0
  const listStats = []
  for (const key in statsData){
    if(statsData.hasOwnProperty(key)){
      const valor = statsData[key]
      totalValor += valor
      listStats.push({
        name: renameStats(key),
        valor: valor,
        className: setClassNameProgressBar(valor)
      })
    }
  }

  listStats.push({
    name: 'Total',
    valor: totalValor,
    className: setClassNameProgressBarTotal(totalValor)
  })

  const listStatsHtml = createListStatsHTML(listStats)

  return `
  <div class="content-modal-body">
      <div class="pokemon-view pokemon ${pokemon.type}">
        <span class="number">${formattedNumber}</span>
        <span class="name">${pokemonName}</span>
        <div class="detail">
          <ol class="types">${pokemonTypes}</ol>
          ${pokemonSprite}
        </div>
      </div>
      <div class="container-stats">
        ${listStatsHtml}
      </div>
    </div>
  `
}

function loadPokemons(offset, limit) {
  pokeAPI.getPokemons(offset, limit).then((pokemonList = []) => {
    pokemonStructHtmlRef.innerHTML += pokemonList.map(convertPokemonToHTML).join('')
  })
  .then(res => {
    const pokemons = document.querySelectorAll('.pokemon')
    pokemons.forEach(function (pokemon) {
        pokemon.addEventListener('click', function(){
          const pokemonName = pokemon.id.split('-')[0]
        
          // const pokemonCard = document.getElementById('open-modal-info')
          const modalRef = document.getElementById('info-modal')
          const closeRef = document.getElementById('close-modal-btn')
          const infoRef = document.getElementById('content-info')
          
          pokeAPI.getStatsPokemon(pokemonName).then(pokemon => {
            infoRef.innerHTML = convertStatsPokemonToHTML(pokemon)
            modalRef.style.display = 'block'
          })

          closeRef.onclick = function () {
            modalRef.style.display = 'none'
          }

          window.onclick = function (event) {
              if (event.target == modalRef) {
                  modalRef.style.display = 'none'
              }
          }

        })
    })
  })
}

loadPokemons(offset, limit)

moreButtonRef.addEventListener('click', () => {
  offset += limit
  loadPokemons(offset, limit)
})
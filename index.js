import GAMES_DATA from './games.js';

const GAMES_JSON = JSON.parse(GAMES_DATA);

function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

const gamesContainer = document.getElementById("games-container");

document.addEventListener("DOMContentLoaded", function () {
    // Call the function we just defined using the correct variable
    // Later, we'll call this function using a different list of games
    addGamesToPage(GAMES_JSON);
});

const ourGamesBtn = document.getElementById("our-games-btn");
ourGamesBtn.addEventListener("click", scrollToOurGames);

function scrollToOurGames() {
    // Adjust the element ID based on your actual section ID for Our Games
    const ourGamesSection = document.getElementById("games-container");
    ourGamesSection.scrollIntoView({ behavior: "smooth" });
}

function addGamesToPage(games) {
    for (let i = 0; i < games.length; i++) {
        const game = games[i];
        const gameCard = document.createElement("div");
        gameCard.classList.add("game-card");
        gameCard.innerHTML = `
            <img class="game-img" src="${game.img}" alt="${game.name}" />
            <h3>${game.name}</h3>
            <p>${game.description}</p>
            <p class="pledged">$${game.pledged.toLocaleString()}</p>
            <p class="backers">${game.backers.toLocaleString()} backers</p>
        `;
        gamesContainer.appendChild(gameCard);
    }
}

const contributionsCard = document.getElementById("num-contributions");

const totalContributions = GAMES_JSON.reduce((total, game) => {
    return total + game.backers;
}, 0);

contributionsCard.innerHTML = `$${totalContributions.toLocaleString()}`;

const raisedCard = document.getElementById("total-raised");
const totalRaised = GAMES_JSON.reduce((total, game) => {
    return total + game.pledged;
}, 0);

raisedCard.innerHTML = `$${totalRaised.toLocaleString()}`;

const gamesCard = document.getElementById("num-games");
gamesCard.innerHTML = `${GAMES_JSON.length}`;

function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);
    const unfundedGames = GAMES_JSON.filter((game) => {
        return game.pledged < game.goal;
    });
    addGamesToPage(unfundedGames);
}

function filterFundedOnly() {
    deleteChildElements(gamesContainer);
    const fundedGames = GAMES_JSON.filter((game) => {
        return game.pledged >= game.goal;
    });
    addGamesToPage(fundedGames);
}

function showAllGames() {
    deleteChildElements(gamesContainer);
    addGamesToPage(GAMES_JSON);
}

const searchInput = document.getElementById("search-input");
searchInput.addEventListener("input", handleSearch);

function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredGames = GAMES_JSON.filter(game => game.name.toLowerCase().includes(searchTerm));
    deleteChildElements(gamesContainer);
    addGamesToPage(filteredGames);
}

const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);

const descriptionContainer = document.getElementById("description-container");

const numUnfundedGames = GAMES_JSON.filter((game) => {
    return game.pledged < game.goal;
}).length;

const unfundedGamesString = `
    A total of $${totalRaised.toLocaleString()} has been raised for ${GAMES_JSON.length} games. Currently, ${numUnfundedGames} games remain unfunded. We need your help to fund these amazing games!
`;

const unfundedGamesParagraph = document.createElement("p");
unfundedGamesParagraph.innerHTML = unfundedGamesString;
descriptionContainer.appendChild(unfundedGamesParagraph);

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames = GAMES_JSON.sort((item1, item2) => {
    return item2.pledged - item1.pledged;
});

const [topGame, runnerUpGame] = sortedGames;

const topGameName = document.createElement("h3");
topGameName.innerHTML = topGame.name;
firstGameContainer.appendChild(topGameName);

const runnerUpGameName = document.createElement("h3");
runnerUpGameName.innerHTML = runnerUpGame.name;
secondGameContainer.appendChild(runnerUpGameName);
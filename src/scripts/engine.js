const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById('score_points'),
    },
    cardsSprites: {
        avatar: document.getElementById('card-image'),
        name: document.getElementById('card-name'),
        type: document.getElementById('card-type'),
    },
    fieldCards: {
        player:document.getElementById('player-field-card'),
        computer:document.getElementById('computer-field-card'),
    },
    playerSides: {
        player1: 'player-cards',
        player1BOX: document.querySelector('#player-cards'), 
        computer: 'computer-cards',
        computerBOX: document.querySelector('#computer-cards'),
    },
    actions: {
        button: document.getElementById('next-duel'),
    },
};
// Um state é um objeto de objetos, é onde se guarda a memória de alguma propriedade ou característica.

const pathImages = './src/assets/icons/'

const cardData = [
    {
        id: 0,
        name: 'Blue Eyes White Dragon',
        type: 'Paper',
        img: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2],
    },
    {
        id: 1,
        name: 'Dark Magician',
        type: 'Rock',
        img: `${pathImages}magician.png`,
        WinOf: [2],
        LoseOf: [0],
    },
    {
        id: 2,
        name: 'Exodia',
        type: 'Scissors',
        img: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [1],
    }
];
// Enumeração das cartas: Enumerar significa dar um sentido para facilitar o acesso. No cardData está passando as caracteristicas das cartas que serão usadas no game.


async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}; // Função para pegar aleatoriamente o id do meu objeto cardData.

async function creatCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement('img'); // Criando a tag img.
    cardImage.setAttribute('height', '100px'); // Definindo sua altura.
    cardImage.setAttribute('src', './src/assets/icons/card-back.png'); // Definindo o caminho da imagem.
    cardImage.setAttribute('data-id', IdCard); // O "data" permite criar atributos dinâmicos pro HTML. E aqui estou salvando o Id da carta.
    cardImage.classList.add('card'); // Adicionando a classe card à minha tag.

// Eu sou posso deixar a carta ser clicável se ela estiver do lado do player. Segue a verificação para tal:
    if(fieldSide === state.playerSides.player1) {
        cardImage.addEventListener('mouseover', () => {
            drawSelectCard(IdCard);
        }); // Desenhar as minhas cartas quando eu passar o mouse por cima de cada uma delas.

        cardImage.addEventListener('click', () => {
            setCardsField(cardImage.getAttribute('data-id'));
        });

    };

    return cardImage;
}; 

async function setCardsField(cardId) {
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId() // Sorteia uma carta aleatória para o computador.

    await showHiddenCardFieldsImages(true);

    await hiddenCardDetails();

    await drawCardsInfield(cardId, computerCardId);

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}


async function drawCardsInfield(cardId, computerCardId) {
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function showHiddenCardFieldsImages(value) {
    if(value === true) {
        state.fieldCards.player.style.display = 'block';
        state.fieldCards.computer.style.display = 'block';
    }

    if(value === false) {
        state.fieldCards.player.style.display = 'none'
        state.fieldCards.computer.style.display = 'none'
    }
}

async function hiddenCardDetails() {
    state.cardsSprites.avatar.src = '';
    state.cardsSprites.name.innerText = '';
    state.cardsSprites.type.innerText = '';
}

async function drawButton(text) {
    state.actions.button.innerText = text;
    state.actions.button.style.display = 'block';
    // Fazendo o botão aparecer novamente com o texto de vitória, derrota ou empate
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = 'DRAW';
    let playerCard = cardData[playerCardId]; 

    if(playerCard.WinOf.includes(computerCardId)) {
        duelResults = 'WIN';
        state.score.playerScore++;
    };

    if(playerCard.LoseOf.includes(computerCardId)) {
        duelResults = 'LOSE';
        state.score.computerScore++;
    };

    await playAudio(duelResults)

    return duelResults;
};

async function removeAllCardsImages() {
    let {computerBOX, player1BOX} = state.playerSides;
    let imgElements = computerBOX.querySelectorAll('img'); // Aqui eu pego cada uma dessas imagens
    imgElements.forEach((img) => img.remove()); // E aqui eu estou removendo todas as cartas.

    imgElements = player1BOX.querySelectorAll('img');
    imgElements.forEach((img) => img.remove());
};


async function drawSelectCard(index) {
    state.cardsSprites.avatar.src = cardData[index].img;
    state.cardsSprites.name.innerText = cardData[index].name;
    state.cardsSprites.type.innerText = 'Attribute : ' + cardData[index].type;
};


async function drawCards(cardNumbers, fieldSide) {
    for(let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId(); 
        const cardImage = await creatCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel() {
    state.cardsSprites.avatar.src = '';
    state.actions.button.style.display = 'none';

    state.fieldCards.player.style.display = 'none';
    state.fieldCards.computer.style.display = 'none';

    init();
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);

    try {
        audio.play();
    } catch {};
}

function init() {
    showHiddenCardFieldsImages(false);

    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);

    const bgm = document.getElementById('bgm');
    bgm.play();
};

init(); // Função para chamar o estado inicial do jogo.
const burgerIcon = document.querySelector('.header-burger');
const wrapper = document.querySelector('.wrapper');
const menuItem = document.querySelectorAll('.menu-item');
const menu = document.querySelector('.menu');
const menuList = document.querySelector('.menu-list');
const headerLogo = document.querySelector('.header-logo');
const headerLogoClone = headerLogo.cloneNode(true);

const addLogo = () => {
  if (menu.classList.contains('menu-active')) {
    menu.append(headerLogoClone);
  } else {
    headerLogoClone.remove();
  }
}

const toggleMenu = () => {
  burgerIcon.classList.toggle('menu-active');
  menu.classList.toggle('menu-active');
  wrapper.classList.toggle('lock');
  menuList.classList.toggle('menu-active');
  addLogo();
}

burgerIcon.addEventListener('click', () => {
  toggleMenu();
});

menuItem.forEach((el) => el.addEventListener('click', () => {
  if (menu.classList.contains('menu-active')) {
    toggleMenu();
  }
}));

document.addEventListener('click', (e) => {
  let menuClick = e.target === menu || menu.contains(e.target);
  let burgerClick = e.target === burgerIcon || burgerIcon.contains(e.target);
  let menuActive = menu.classList.contains('menu-active');

  if (!menuClick && !burgerClick && menuActive) {
    toggleMenu();
  }
});

const next = document.querySelector('.next');
const prev = document.querySelector('.prev');
const up = document.querySelector('.up');
const down = document.querySelector('.down');
const forward = document.querySelectorAll('.forward');
const back = document.querySelectorAll('.back');
const petsLink = "../../assets/pets.json";
const petsPage = document.querySelector('.pets-page');
let pageActiveNumber = document.querySelector('.button-active');
const paginators = document.querySelectorAll('.paginator');

function requestPets(pets, onComplete, onError) {
  fetch(pets)
      .then((res) => res.json())
      .then(onComplete)
      .catch(onError)
}

function showPets() {
  requestPets(petsLink, addPets, handleError);
}

showPets();

function addPets(pets) {

  getAllPets(pets);
  mixUpPets(pets);
  addPage(pets);

}

function handleError(error) {
  console.log('Error: ', error);
}

let allPets = [];
let allPagesPets = [];


function getAllPets(pets) {
  for (let i = 0; i < pets.length; i++) {
    allPets.push(pets[i]);
  }

  for (let i = 0; i < 6; i++) {
    allPagesPets.push(...allPets);
  }
}


function mixUpPets(pets) {
  pets.sort(() => Math.random() - 0.5);
}


let cardsLength;
if (window.matchMedia("(max-width: 767px)").matches) {
  cardsLength = 3;
} else if (window.matchMedia("(max-width: 1279px)").matches) {
  cardsLength = 6;
} else {
  cardsLength = 8;
}


function addPage(pets) {
  let petCard;
  for (let i = 0; i < 48 / cardsLength; i++) {
    const petsCards = document.createElement("div");
    petsCards.classList.add("pets-cards");
    mixUpPets(pets)
    for (let i = 0; i < cardsLength; i++) {
      petCard = drawPet(pets[i]);
      petsCards.append(petCard);
    }
    petsPage.append(petsCards);
  }
}


function drawPet(pet) {
  const petCard = document.createElement("div");
  petCard.classList.add("pet-card");
  petCard.classList.add(`${pet.name}`);

  const petImage = document.createElement('img');
  petImage.classList.add('pet-image');
  petImage.src = pet.img;
  petCard.appendChild(petImage);

  const petName = document.createElement('h4');
  petName.classList.add("pet-name");
  petName.innerHTML = pet.name;
  petCard.append(petName);

  const cardButton = document.createElement('button');
  cardButton.classList.add('pet-card-button');
  cardButton.classList.add('button');
  cardButton.innerHTML = 'Learn more';
  petCard.append(cardButton);

//popup
  petCard.addEventListener('click', () => {
    showPopup();
    addModal(petCard);
  })
  return petCard;
}


let modalWindow = document.createElement("div");

function addModal(card) {
  modalWindow.classList.add("modal-window");
  if (modal.classList.contains('modal-active')) {
    let petClassName = card.className.substring(9);
    for (let i = 0; i < allPets.length; i++) {
      if (petClassName === (`${allPets[i].name}`)) {
        modalWindow.innerHTML = addPopupCard(allPets[i]);
      }
    }
    modalWindowWrapper.append(modalWindow);
  } else {
    modalWindow.remove();
  }
}


const moveLeft = () => {
  changePage('left', cardsLength, pageActiveNumber.innerHTML);
  disable(pageActiveNumber.innerHTML)

  petsPage.classList.add("transition-left");
  prev.removeEventListener("click", moveLeft);
  next.removeEventListener("click", moveRight);
};

const moveRight = () => {
  changePage('right', cardsLength, pageActiveNumber.innerHTML);
  disable(pageActiveNumber.innerHTML)

  petsPage.classList.add("transition-right");
  prev.removeEventListener("click", moveLeft);
  next.removeEventListener("click", moveRight);
};

prev.addEventListener('click', moveLeft);
next.addEventListener("click", moveRight);


function disable(number) {
  number = parseInt(number);

  if (number === 1) {
    back.forEach(b => {
      b.classList.add('button-inactive');
      b.disabled = true;
    })
    forward.forEach(f => {
      f.classList.remove('button-inactive');
      f.disabled = false;
    })
  } else if (number > 1 && number < (48 / cardsLength)) {
    paginators.forEach(p => {
      p.classList.remove('button-inactive');
      p.disabled = false;
    })
  } else if (number === (48 / cardsLength)) {
    forward.forEach(f => {
      f.classList.add('button-inactive');
      f.disabled = true;
    })
    back.forEach(b => {
      b.classList.remove('button-inactive');
      b.disabled = false;
    })
  }
}


const moveUp = () => {
  lastPage('right', cardsLength, pageActiveNumber.innerHTML)
  disable(pageActiveNumber.innerHTML);
  petsPage.classList.add("transition-right");
}

const moveDown = () => {
  lastPage('left', cardsLength, pageActiveNumber.innerHTML)
  disable(pageActiveNumber.innerHTML)
  petsPage.classList.add("transition-left");
}

down.addEventListener('click', moveDown);
up.addEventListener("click", moveUp);

function changePage(direction, cardsLength, number) {
  if (direction === 'right' && cardsLength === 8) {
    direction = -1240;
    number++;
  } else if (direction === 'left' && cardsLength === 8) {
    direction = 1240;
    number--;
  } else if (direction === 'right' && cardsLength === 6) {
    direction = -620;
    number++;
  } else if (direction === 'left' && cardsLength === 6) {
    direction = 620;
    number--;
  } else if (direction === 'right' && cardsLength === 3) {
    direction = -310;
    number++;
  } else if (direction === 'left' && cardsLength === 3) {
    direction = 310;
    number--;
  }
  let left = petsPage.offsetLeft;
  petsPage.style.left = `${left + direction}px`;
  pageActiveNumber.innerHTML = number;
}

petsPage.addEventListener("animationend", (animationEvent) => {
  if (animationEvent.animationName === "move-left") {
    petsPage.classList.remove("transition-left");
  } else {
    petsPage.classList.remove("transition-right");
  }
  prev.addEventListener("click", moveLeft);
  next.addEventListener("click", moveRight);
  down.addEventListener('click', moveDown);
  up.addEventListener("click", moveUp);
});


function lastPage(direction, cardsLength, number) {
  if (direction === 'right' && cardsLength === 8) {
    direction = (-1240 * 5);
    number = '6';
  } else if (direction === 'left' && cardsLength === 8) {
    direction = 0;
    number = '1';
  } else if (direction === 'right' && cardsLength === 6) {
    direction = (-620 * 7);
    number = '8';
  } else if (direction === 'left' && cardsLength === 6) {
    direction = 0;
    number = '1';
  } else if (direction === 'right' && cardsLength === 3) {
    direction = (-310 * 15);
    number = '16';
  } else if (direction === 'left' && cardsLength === 3) {
    direction = 0;
    number = '1';
  }

  let left = 0;
  pageActiveNumber.innerHTML = number;
  petsPage.style.left = `${left + direction}px`;
}


const body = document.querySelector('body');
const modal = document.querySelector('.modal');
const closeButton = document.querySelector('.close-button');
const modalWindowWrapper = document.querySelector('.modal-window-wrapper');
const blackout = document.createElement('div');
blackout.setAttribute('class', 'blackout');

function addPopupCard(pet) {
  return `
    <img src=${pet.img} alt="pet photo" class="modal-image">
    <div class="modal-content">
      <div class="modal-headings">
        <h3 class="modal-name heading">${pet.name}</h3>
        <h4 class="modal-type-breed">${pet.type} - ${pet.breed}</h4>
      </div>
      <p class="modal-description">${pet.description}</p>
      <ul class="modal-list">
        <li class="modal-list-item">
          <span class="modal-key">Age:</span> <span class="modal-value"> ${pet.age}</span>
        </li>
        <li class="modal-list-item">
          <span class="modal-key">Inoculations:</span><span class="modal-value"> ${pet.inoculations}</span>
        </li>
        <li class="modal-list-item">
          <span class="modal-key">Diseases:</span><span class="modal-value"> ${pet.diseases}</span>
        </li>
        <li class="modal-list-item">
          <span class="modal-key">Parasites:</span><span class="modal-value"> ${pet.parasites}</span>
        </li>
      </ul>
    </div>
  `
}

function showPopup() {
  modal.classList.add('modal-active');
  body.classList.add('lock');
  modal.append(blackout);
}

function closePopup() {
  modal.classList.remove('modal-active');
  body.classList.remove('lock');
  blackout.remove();
  modalWindow.remove();
}

closeButton.addEventListener('click', () => {
  closePopup();
});

blackout.addEventListener('mouseover', () => {
  closeButton.classList.add('close-button-hover');
});

blackout.addEventListener('mouseout', () => {
  closeButton.classList.remove('close-button-hover');
});

blackout.addEventListener('click', () => {
  closePopup();
  closeButton.classList.remove('close-button-hover');
});


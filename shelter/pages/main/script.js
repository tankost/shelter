const burgerIcon = document.querySelector('.header-burger');
const wrapper = document.querySelector('.wrapper');
const menuItem = document.querySelectorAll('.menu-item');
const menu = document.querySelector('.menu');
const menuList = document.querySelector('.menu-list')
const headerLogo = document.querySelector('.header-logo');
const headerLogoClone = headerLogo.cloneNode(true);
const blackout = document.createElement('div');
blackout.setAttribute('class', 'blackout');


const addLogo = () => {
  if (menu.classList.contains('menu-active')) {
    menu.append(headerLogoClone);
  } else {
    headerLogoClone.remove();
  }
}

const darken = () => {
  if (wrapper.classList.contains('lock')) {
    wrapper.append(blackout);
  } else {
    blackout.remove();
  }
}

const toggleMenu = () => {
  burgerIcon.classList.toggle('menu-active');
  menu.classList.toggle('menu-active');
  wrapper.classList.toggle('lock');
  menuList.classList.toggle('menu-active');
  addLogo();
  darken();
}

burgerIcon.addEventListener('click', () => {
  toggleMenu();
});

menuItem.forEach((el) => el.addEventListener('click', () => {
      if (menu.classList.contains('menu-active')) {
        toggleMenu();
      }
    })
);

document.addEventListener('click', (e) => {
  let menuClick = e.target === menu || menu.contains(e.target);
  let burgerClick = e.target === burgerIcon || burgerIcon.contains(e.target);
  let menuActive = menu.classList.contains('menu-active');

  if (!menuClick && !burgerClick && menuActive) {
    toggleMenu();
  }
});


//CAROUSEL
const carousel = document.querySelector('.carousel');
const petsLink = "../../assets/pets.json";
const activeCards = document.querySelector('.active-cards');
const leftCards = document.querySelector('.left-cards');
const rightCards = document.querySelector('.right-cards');
const buttonLeft = document.querySelector('.arrow-left');
const buttonRight = document.querySelector('.arrow-right');
let activePets = [];
let leftPets = [];
let rightPets = [];
let allPets = [];

function requestPets(pets, onComplete, onError) {
  fetch(pets)
      .then((res) => res.json())
      .then(onComplete)
      .catch(onError)
}

function showPets() {
  requestPets(petsLink, addPets, handleError);
}

function handleError(error) {
  console.log('Error: ', error);
}

function addPets(pets) {
  getAllPets(pets);
  mixUpPets(pets);
  addActivePets(pets);
  addLeftPets(pets);
  addRightPets(pets);
}

showPets();

function getAllPets(pets) {
  for (let i = 0; i < pets.length; i++) {
    allPets.push(pets[i]);
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
  const allCards = document.querySelectorAll('.pet-card');
  allCards.forEach(card => {
        card.addEventListener('click', () => {
          showPopup();
          addModal(card);
        })
      }
  )
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


function addActivePets(pets) {
  let petCard;
  let cardsLength;
  if (window.matchMedia("(max-width: 767px)").matches) {
    cardsLength = 1;
  } else if (window.matchMedia("(max-width: 1279px)").matches) {
    cardsLength = 2;
  } else {
    cardsLength = 3;
  }
  for (let i = 0; i < cardsLength; i++) {
    petCard = drawPet(pets[i]);
    activeCards.append(petCard);
    activePets.push(pets[i]);
  }
}

function mixUpPets(pets) {
  pets.sort(() => Math.random() - 0.5);
}

function checkRepeatedPets(pets) {
  return pets.filter(pet => !activePets.includes(pet));
}

function addLeftPets(pets) {
  let petCard;
  mixUpPets(pets);
  pets = checkRepeatedPets(pets);
  let cardsLength;
  if (window.matchMedia("(max-width: 767px)").matches) {
    cardsLength = 1;
  } else if (window.matchMedia("(max-width: 1279px)").matches) {
    cardsLength = 2;
  } else {
    cardsLength = 3;
  }

  for (let i = 0; i < cardsLength; i++) {
    petCard = drawPet(pets[i]);
    leftCards.append(petCard);
    leftPets.splice(i, 1, pets[i]);
  }
}

function addRightPets(pets) {
  let petCard;
  mixUpPets(pets);
  pets = checkRepeatedPets(pets);
  let cardsLength;
  if (window.matchMedia("(max-width: 767px)").matches) {
    cardsLength = 1;
  } else if (window.matchMedia("(max-width: 1279px)").matches) {
    cardsLength = 2;
  } else {
    cardsLength = 3;
  }

  for (let i = 0; i < cardsLength; i++) {
    petCard = drawPet(pets[i]);
    rightCards.append(petCard);
    rightPets.splice(i, 1, pets[i]);
  }
}

function addLeftOrRightPets(pets, item) {
  item === leftCards ? addLeftPets(pets) : addRightPets(pets);
}

const moveLeft = () => {
  carousel.classList.add("transition-left");
  buttonLeft.removeEventListener("click", moveLeft);
  buttonRight.removeEventListener("click", moveRight);

};

const moveRight = () => {
  carousel.classList.add("transition-right");
  buttonLeft.removeEventListener("click", moveLeft);
  buttonRight.removeEventListener("click", moveRight);
};

buttonLeft.addEventListener('click', moveLeft);
buttonRight.addEventListener("click", moveRight);

carousel.addEventListener("animationend", (animationEvent) => {
  let changedItem;
  if (animationEvent.animationName === "move-left") {
    carousel.classList.remove("transition-left");
    activePets = leftPets;
    leftPets = [];
    changedItem = leftCards;
    activeCards.innerHTML = leftCards.innerHTML;
  } else {
    carousel.classList.remove("transition-right");
    activePets = rightPets;
    rightPets = [];
    changedItem = rightCards;
    activeCards.innerHTML = rightCards.innerHTML;
  }
  changedItem.innerHTML = "";

  addLeftOrRightPets(allPets, changedItem);

  buttonLeft.addEventListener("click", moveLeft);
  buttonRight.addEventListener("click", moveRight);
});


//pop-up
const body = document.querySelector('body');
const modal = document.querySelector('.modal');
const closeButton = document.querySelector('.close-button');
const modalWindowWrapper = document.querySelector('.modal-window-wrapper');


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



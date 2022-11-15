'use strict';

const todoForm = document.getElementById('form__todo');
const todoList = document.querySelector('.todo__list');
const listLengthEl = todoList.querySelector('.todo__list-items--number');
const deleteModalEl = document.querySelector('.modal__delete');
const toggleThemeBtn = document.querySelector('.toggle-theme');

class App {
  listArr = [];
  selectedListItem;

  constructor() {
    //Handlers
    this.#displayListLength();
    todoForm.addEventListener('submit', this._createListItem.bind(this));

    todoList.addEventListener('click', (e) => {
      this._checkListItem(e);
      this._displayModal(e);
    });

    deleteModalEl.addEventListener('click', (e) => {
      this._handleModal(e);
    });

    toggleThemeBtn.addEventListener('click', this._toggleTheme.bind(this));
  }

  //Helper Functions
  #emptyInput() {
    const input = todoForm.querySelector('input');
    input.value = '';
    input.focus();
  }

  #displayListLength() {
    listLengthEl.textContent = this.listArr.length;
  }

  #showDeleteModal() {
    deleteModalEl.classList.remove('hidden');
    deleteModalEl.classList.add('show');
  }

  #closeDeleteModal() {
    deleteModalEl.classList.remove('show');
    deleteModalEl.classList.add('hidden');
  }

  #updateListUI(deletedItem) {
    deletedItem.remove();
  }

  #acceptDeleteModal(target) {
    const deletedItem = target.parentElement;
    const indexOfDeletedItem = this.listArr.indexOf(deletedItem);
    this.listArr.splice(indexOfDeletedItem, 1);

    this.#updateListUI(deletedItem);
    this.#displayListLength();
    this.#closeDeleteModal();
  }

  #declineDeleteModal() {
    this.#closeDeleteModal();
    //if escape is clicked
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.#closeDeleteModal();
      }
    });
  }

  #toggleModusText(modus, othermodus) {
    const backgroundImg = document.querySelector('.background-img');
    const backgroundEl = document.querySelector('.background');

    let imgHtml = `images/bg-desktop-${modus}.jpg`;
    let ariaLabelHtml = `switch to ${othermodus} modus`;
    let altHtml = `switch to ${othermodus} modus`;
    let pictureHtml = `
      <picture>
        <source
          media="(max-width:599px)"
          srcset="images/bg-mobile-${modus}.jpg"
        />
        <source
          media="(min-width:600px)"
          srcset="images/bg-desktop-${modus}.jpg"
        />
        <img
          src="images/bg-mobile-${modus}.jpg"
          class="background-img"
          aria-hidden="true"
        />
    </picture>
    `;

    backgroundImg.src = imgHtml;
    toggleThemeBtn.ariaLabel = ariaLabelHtml;
    toggleThemeBtn.alt = altHtml;
    backgroundEl.innerHTML = pictureHtml;
  }

  //App functions
  _createListItem(e) {
    e.preventDefault();
    const inputValue = todoForm.querySelector('input').value;

    if (inputValue === '') return;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
        <path
          fill="#9394a5"
          fill-rule="evenodd"
          d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"
        />
      </svg>`;

    const liEl = document.createElement('li');
    liEl.className = 'todo__list--item';
    liEl.innerHTML = `
              <div class="circle" data-checkable="false">
                  <img
                    src="images/icon-check.svg"
                    alt="ckecked"
                    class="checked-icon"
                  />
                </div>
                <p class="todo__list--item__text">${inputValue}</p>
                <div class="delete-icon">
                  ${svg}
                </div>
        `;

    todoList.insertAdjacentElement('afterbegin', liEl);
    this.listArr.push(liEl);
    this.#emptyInput();
    this.#displayListLength();
  }

  _displayModal(e) {
    const target = e.target.closest('.delete-icon');
    this.selectedListItem = target; //save the targeted list item
    if (!target) return;
    this.#showDeleteModal();
  }

  _checkListItem(e) {
    const target = e.target;
    if (!target.classList.contains('circle')) return;

    if (target.getAttribute('data-checkable') === 'false') {
      target.setAttribute('data-checkable', 'true');
      target.parentElement.classList.add('checked');
    } else {
      target.setAttribute('data-checkable', 'false');
      target.parentElement.classList.remove('checked');
    }
  }

  _handleModal(e) {
    if (e.target.classList.contains('accept')) {
      this.#acceptDeleteModal(this.selectedListItem);
    } else if (e.target.classList.contains('decline')) {
      this.#declineDeleteModal();
    } else {
      return;
    }
  }

  _toggleTheme() {
    let modus;
    let otherModus;
    if (document.documentElement.classList.contains('dark')) {
      modus = 'light';
      otherModus = 'dark';
      this.#toggleModusText(modus, otherModus);
      toggleThemeBtn.src = 'images/icon-moon.svg';
      document.documentElement.classList.remove('dark');
    } else {
      modus = 'dark';
      otherModus = 'light';
      this.#toggleModusText(modus, otherModus);
      toggleThemeBtn.src = 'images/icon-sun.svg';
      document.documentElement.classList.add('dark');
    }
  }
}

new App();

//Lazy loading

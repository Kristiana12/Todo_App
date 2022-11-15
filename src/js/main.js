'use strict';

const todoForm = document.getElementById('form__todo');
const todoList = document.querySelector('.todo__list');
const listLengthEl = todoList.querySelector('.todo__list-items--number');

class App {
  listArr = [];

  constructor() {
    //Handlers
    this.#displayListLength();
    todoForm.addEventListener('submit', this._createListItem.bind(this));
    todoList.addEventListener('click', this._checkListItem.bind(this));
  }

  #emptyInput() {
    const input = todoForm.querySelector('input');
    input.value = '';
    input.focus();
  }

  #displayListLength() {
    listLengthEl.textContent = this.listArr.length;
  }

  _createListItem(e) {
    e.preventDefault();
    const inputValue = todoForm.querySelector('input').value;
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

  _deleteListItem(e) {}
}

new App();

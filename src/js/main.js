'use strict';

const todoForm = document.getElementById('form__todo');
const todoList = document.querySelector('.todo__list');
const listLengthEl = document.querySelector('.todo__list-items--number');
const deleteModalEl = document.querySelector('.modal__delete');
const toggleThemeBtn = document.querySelector('.toggle-theme');

const sortContainers = document.querySelectorAll('.todo__list--sort');
const clearCompletedBtn = document.querySelector('[data-clear]');
let listArr = [];

class Task {
  constructor(task) {
    this.task = task;
    ///Create Task
    this._createListItem();
    //Dragging functionality
    todoList.addEventListener(
      'dragover',
      this._dragAndDropContainer.bind(this)
    );
    this._displayListLength();
  }

  //Help Functions
  _displayListLength() {
    listLengthEl.textContent = listArr.length;
  }

  #dragAndDropItem() {
    const items = document.querySelectorAll('.todo__list--item');
    //styling the dragging items (class)
    items.forEach((item) => {
      item.addEventListener('dragstart', () => {
        item.classList.add('dragging');
      });
      item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
      });
    });
  }

  //get the after element relative to the dragging element (Y axis)
  #afterDragElement(y) {
    //Select all the list elements except from the one being dragged
    const draggableElements = [
      ...todoList.querySelectorAll('.todo__list--item:not(.dragging)'),
    ];

    //Loop through the element's list and determine which single element is right after our mouse cursor based on the y position that we pass in
    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        //Get half of the box on the y axis
        const offset = y - box.top - box.height / 2;
        //First the number needs to be negative, that is how we know that we are hovering over another child element, but we need the closest one, so the one whiches offset is the smallest
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }

  _createListItem() {
    if (!this.task) return;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
            <path
              fill="#9394a5"
              fill-rule="evenodd"
              d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"
            />
          </svg>`;

    const liEl = document.createElement('li');
    liEl.className = 'todo__list--item active';
    liEl.setAttribute('draggable', 'true');
    liEl.innerHTML = `
                  <div class="circle" data-checkable="false">
                      <img
                        src="images/icon-check.svg"
                        alt="ckecked"
                        class="checked-icon"
                      />
                      </div>
                    <span></span>
                    <p class="todo__list--item__text">${this.task}</p>
                    <div class="delete-icon">
                      ${svg}
                    </div>
            `;

    todoList.insertAdjacentElement('afterbegin', liEl);
    listArr.unshift(liEl);
    this._displayListLength();

    //make the drag n drop styling
    this.#dragAndDropItem();
  }

  _dragAndDropContainer(e) {
    const draggingItem = todoList.querySelector('.dragging');

    const afterItem = this.#afterDragElement(e.clientY);
    if (afterItem === null) {
      todoList.appendChild(draggingItem);
    } else {
      todoList.insertBefore(draggingItem, afterItem);
    }
  }
}

class App extends Task {
  selectedListItem;

  constructor(task) {
    super(task);
    //submit new task
    todoForm.addEventListener('submit', this._submitTask.bind(this));
    //Checking styling and displaying delete Modal onclick
    todoList.addEventListener('click', (e) => {
      this._checkListItem(e);
      this._displayModal(e);
    });

    //delete selected task or close delete modal without deleting
    deleteModalEl.addEventListener('click', (e) => {
      this._handleModal(e);
    });

    //toggle dark-light modus
    toggleThemeBtn.addEventListener('click', this._toggleTheme.bind(this));

    //Clear completed tasks
    clearCompletedBtn.addEventListener(
      'click',
      this._clearCompletedTasks.bind(this)
    );
  }

  //Helper Functions
  #emptyInput() {
    const input = todoForm.querySelector('input');
    input.value = '';
    input.focus();
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
    const indexOfDeletedItem = listArr.indexOf(deletedItem);
    listArr.splice(indexOfDeletedItem, 1);

    this.#updateListUI(deletedItem);
    this._displayListLength();
    this.#closeDeleteModal();
  }

  #toggleModusText(currModus, otherModus) {
    const backgroundImg = document.querySelector('.background-img');
    const backgroundEl = document.querySelector('.background');

    let imgHtml = `images/bg-desktop-${currModus}.jpg`;
    let ariaLabelHtml = `switch to ${otherModus} modus`;
    let altHtml = `switch to ${otherModus} modus`;
    let pictureHtml = `
        <picture>
          <source
            media="(max-width:599px)"
            srcset="images/bg-mobile-${currModus}.jpg"
          />
          <source
            media="(min-width:600px)"
            srcset="images/bg-desktop-${currModus}.jpg"
          />
          <img
            src="images/bg-mobile-${currModus}.jpg"
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

  _submitTask(e) {
    e.preventDefault();
    const inputValue = todoForm.querySelector('input').value;

    if (inputValue === '') return;

    new Task(inputValue);
    this.#emptyInput();
  }

  _checkListItem(e) {
    if (!e.target.classList.contains('circle')) return;

    if (e.target.getAttribute('data-checkable') === 'false') {
      e.target.setAttribute('data-checkable', 'true');
      e.target.parentElement.classList.add('checked');
      e.target.parentElement.classList.remove('active');
    } else {
      e.target.setAttribute('data-checkable', 'false');
      e.target.parentElement.classList.remove('checked');
      e.target.parentElement.classList.add('active');
    }
  }

  _displayModal(e) {
    const target = e.target.closest('.delete-icon');
    this.selectedListItem = target; //save the targeted list item to delete when user clicks 'Yes'
    if (!target) return;
    this.#showDeleteModal();
  }

  _handleModal(e) {
    if (e.target.classList.contains('accept')) {
      this.#acceptDeleteModal(this.selectedListItem);
    } else if (e.target.classList.contains('decline')) {
      this.#closeDeleteModal();
    } else {
      return;
    }
  }

  _toggleTheme() {
    let currModus;
    let otherModus;
    if (document.documentElement.classList.contains('dark')) {
      currModus = 'light';
      otherModus = 'dark';
      this.#toggleModusText(currModus, otherModus);
      toggleThemeBtn.src = 'images/icon-moon.svg';
      document.documentElement.classList.remove('dark');
    } else {
      currModus = 'dark';
      otherModus = 'light';
      this.#toggleModusText(currModus, otherModus);
      toggleThemeBtn.src = 'images/icon-sun.svg';
      document.documentElement.classList.add('dark');
    }
  }

  _clearCompletedTasks() {
    listArr.forEach((item) => {
      if (item.classList.contains('checked')) {
        this.#updateListUI(item);
      }

      const listArrCleared = listArr.filter(
        (item) => !item.classList.contains('checked')
      );

      listArr = listArrCleared;
      this._displayListLength();
    });
  }
}

class SortingItems {
  constructor() {
    sortContainers.forEach((container) =>
      container.addEventListener('click', this._sorting.bind(this))
    );
  }

  #classHandler(e) {
    const sortOptions = document.querySelectorAll('p[data-sort]');
    sortOptions.forEach((option) => option.classList.remove('active'));
    e.target.classList.add('active');
  }

  #sortOnCondition(condition) {
    const allItems = document.querySelectorAll('.todo__list--item');

    allItems.forEach((item) => {
      if (item.classList.contains(condition)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  _sorting(e) {
    if (e.target.dataset.sort === 'all') {
      this.#sortOnCondition('todo__list--item');
      this.#classHandler(e);
    } else if (e.target.dataset.sort === 'active') {
      this.#sortOnCondition('active');
      this.#classHandler(e);
    } else if (e.target.dataset.sort === 'completed') {
      this.#sortOnCondition('checked');
      this.#classHandler(e);
    } else return;
  }
}

new Task('Complete Todo App on Frontend Mentor');
new Task('Pick up groceries');
new Task('Read for 1 hour');
new Task('10 minutes meditation');
new Task('Jog around the park 3x');
new Task('Complete online JavaScript course');
new App();
new SortingItems();

/************************************** */
/************************************** */
/************************************** */

// OLD WAY (WORKS) - Just changed the structure on the above code to add some Tasks on page load

// class App {
//   listArr = [];
//   selectedListItem;

//   constructor() {
//     //Handlers
//     this.#displayListLength();
//     //create task
//     todoForm.addEventListener('submit', this._createListItem.bind(this));

//     //check selected task and add the modal listener to be able to delete task
//     todoList.addEventListener('click', (e) => {
//       this._checkListItem(e);
//       this._displayModal(e);
//     });

//     //delete selected task or close delete modal without deleting
//     deleteModalEl.addEventListener('click', (e) => {
//       this._handleModal(e);
//     });

//     //toggle dark-light modus
//     toggleThemeBtn.addEventListener('click', this._toggleTheme.bind(this));

//     //Clear completed tasks
//     clearCompletedBtn.addEventListener(
//       'click',
//       this._clearCompletedTasks.bind(this)
//     );

//     //Dragging functionality
//     todoList.addEventListener(
//       'dragover',
//       this._dragAndDropContainer.bind(this)
//     );
//   }

//   //Helper Functions
//   #emptyInput() {
//     const input = todoForm.querySelector('input');
//     input.value = '';
//     input.focus();
//   }

//   #displayListLength() {
//     listLengthEl.textContent = this.listArr.length;
//   }

//   #showDeleteModal() {
//     deleteModalEl.classList.remove('hidden');
//     deleteModalEl.classList.add('show');
//   }

//   #closeDeleteModal() {
//     deleteModalEl.classList.remove('show');
//     deleteModalEl.classList.add('hidden');
//   }

//   #updateListUI(deletedItem) {
//     deletedItem.remove();
//   }

//   #acceptDeleteModal(target) {
//     const deletedItem = target.parentElement;
//     const indexOfDeletedItem = this.listArr.indexOf(deletedItem);
//     this.listArr.splice(indexOfDeletedItem, 1);

//     this.#updateListUI(deletedItem);
//     this.#displayListLength();
//     this.#closeDeleteModal();
//   }

//   #toggleModusText(currModus, otherModus) {
//     const backgroundImg = document.querySelector('.background-img');
//     const backgroundEl = document.querySelector('.background');

//     let imgHtml = `images/bg-desktop-${currModus}.jpg`;
//     let ariaLabelHtml = `switch to ${otherModus} modus`;
//     let altHtml = `switch to ${otherModus} modus`;
//     let pictureHtml = `
//       <picture>
//         <source
//           media="(max-width:599px)"
//           srcset="images/bg-mobile-${currModus}.jpg"
//         />
//         <source
//           media="(min-width:600px)"
//           srcset="images/bg-desktop-${currModus}.jpg"
//         />
//         <img
//           src="images/bg-mobile-${currModus}.jpg"
//           class="background-img"
//           aria-hidden="true"
//         />
//     </picture>
//     `;

//     backgroundImg.src = imgHtml;
//     toggleThemeBtn.ariaLabel = ariaLabelHtml;
//     toggleThemeBtn.alt = altHtml;
//     backgroundEl.innerHTML = pictureHtml;
//   }

//   #dragAndDropItem() {
//     const items = document.querySelectorAll('.todo__list--item');
//     //styling the dragging items (class)
//     items.forEach((item) => {
//       item.addEventListener('dragstart', () => {
//         item.classList.add('dragging');
//       });
//       item.addEventListener('dragend', () => {
//         item.classList.remove('dragging');
//       });
//     });
//   }

//   //get the after element relative to the dragging element (Y axis)
//   #afterDragElement(y) {
//     //Select all the list elements except from the one being dragged
//     const draggableElements = [
//       ...todoList.querySelectorAll('.todo__list--item:not(.dragging)'),
//     ];

//     //Loop through the elements' list and determine which single element is right after our mouse cursor based on the y position that we pass in
//     return draggableElements.reduce(
//       (closest, child) => {
//         const box = child.getBoundingClientRect();
//         //Get half of the box on the y axis
//         const offset = y - box.top - box.height / 2;
//         //First the number needs to be negative, that is how we know that we are hovering over another child element, but we need the closest one, so the one which offset is the smallest
//         if (offset < 0 && offset > closest.offset) {
//           return { offset: offset, element: child };
//         } else {
//           return closest;
//         }
//       },
//       { offset: Number.NEGATIVE_INFINITY }
//     ).element;
//   }

//   //App functions
//   _createListItem(e) {
//     e.preventDefault();
//     const inputValue = todoForm.querySelector('input').value;

//     if (inputValue === '') return;

//     const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
//         <path
//           fill="#9394a5"
//           fill-rule="evenodd"
//           d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"
//         />
//       </svg>`;

//     const liEl = document.createElement('li');
//     liEl.className = 'todo__list--item active';
//     liEl.setAttribute('draggable', 'true');
//     liEl.innerHTML = `
//               <div class="circle" data-checkable="false">
//                   <img
//                     src="images/icon-check.svg"
//                     alt="ckecked"
//                     class="checked-icon"
//                   />
//                 </div>
//                 <p class="todo__list--item__text">${inputValue}</p>
//                 <div class="delete-icon">
//                   ${svg}
//                 </div>
//         `;

//     todoList.insertAdjacentElement('afterbegin', liEl);
//     this.listArr.unshift(liEl);
//     this.#emptyInput();
//     this.#displayListLength();

//     //make the drag n drop styling
//     this.#dragAndDropItem();
//   }

//   _displayModal(e) {
//     const target = e.target.closest('.delete-icon');
//     this.selectedListItem = target; //save the targeted list item to delete when user clicks 'Yes'
//     if (!target) return;
//     this.#showDeleteModal();
//   }

//   _checkListItem(e) {
//     if (!e.target.classList.contains('circle')) return;

//     if (e.target.getAttribute('data-checkable') === 'false') {
//       e.target.setAttribute('data-checkable', 'true');
//       e.target.parentElement.classList.add('checked');
//       e.target.parentElement.classList.remove('active');
//     } else {
//       e.target.setAttribute('data-checkable', 'false');
//       e.target.parentElement.classList.remove('checked');
//       e.target.parentElement.classList.add('active');
//     }
//   }

//   _handleModal(e) {
//     if (e.target.classList.contains('accept')) {
//       this.#acceptDeleteModal(this.selectedListItem);
//     } else if (e.target.classList.contains('decline')) {
//       this.#closeDeleteModal();
//     } else {
//       return;
//     }
//   }

//   _toggleTheme() {
//     let currModus;
//     let otherModus;
//     if (document.documentElement.classList.contains('dark')) {
//       currModus = 'light';
//       otherModus = 'dark';
//       this.#toggleModusText(currModus, otherModus);
//       toggleThemeBtn.src = 'images/icon-moon.svg';
//       document.documentElement.classList.remove('dark');
//     } else {
//       currModus = 'dark';
//       otherModus = 'light';
//       this.#toggleModusText(currModus, otherModus);
//       toggleThemeBtn.src = 'images/icon-sun.svg';
//       document.documentElement.classList.add('dark');
//     }
//   }

//   _clearCompletedTasks() {
//     this.listArr.forEach((item) => {
//       if (item.classList.contains('checked')) {
//         this.#updateListUI(item);
//       }
//     });

//     const listArrCleared = this.listArr.filter(
//       (item) => !item.classList.contains('checked')
//     );

//     this.listArr = listArrCleared;
//     this.#displayListLength();
//   }

//   _dragAndDropContainer(e) {
//     const draggingItem = todoList.querySelector('.dragging');

//     const afterItem = this.#afterDragElement(e.clientY);
//     if (afterItem === null) {
//       todoList.appendChild(draggingItem);
//     } else {
//       todoList.insertBefore(draggingItem, afterItem);
//     }
//   }
// }

// class SortingItems {
//   constructor() {
//     sortContainers.forEach((container) =>
//       container.addEventListener('click', this._sorting.bind(this))
//     );
//   }

//   #classHandler(e) {
//     const sortOptions = document.querySelectorAll('p[data-sort]');
//     sortOptions.forEach((option) => option.classList.remove('active'));
//     e.target.classList.add('active');
//   }

//   #sortOnCondition(condition) {
//     const allItems = document.querySelectorAll('.todo__list--item');

//     allItems.forEach((item) => {
//       if (item.classList.contains(condition)) {
//         item.style.display = 'flex';
//       } else {
//         item.style.display = 'none';
//       }
//     });
//   }

//   _sorting(e) {
//     if (e.target.dataset.sort === 'all') {
//       this.#sortOnCondition('todo__list--item');
//       this.#classHandler(e);
//     } else if (e.target.dataset.sort === 'active') {
//       this.#sortOnCondition('active');
//       this.#classHandler(e);
//     } else if (e.target.dataset.sort === 'completed') {
//       this.#sortOnCondition('checked');
//       this.#classHandler(e);
//     } else return;
//   }
// }

// new App();
// new SortingItems();

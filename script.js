const addBtn = document.querySelector('.add-btn');
const modalOverlay = document.querySelector('.modal-overlay');
const modalCont = document.querySelector('.modal-cont');
const textAreaCont = document.querySelector('.textArea-cont');
const removeBtn = document.querySelector('.remove-btn');

let addTaskFlag = false;
let removeTaskFlag = false;

let ticketArr = JSON.parse(localStorage.getItem('tickets')) || [];

// Show modal
addBtn.addEventListener('click', function () {
  addTaskFlag = !addTaskFlag;
  modalOverlay.style.display = addTaskFlag ? 'flex' : 'none';
});

// Close modal when clicking outside
modalOverlay.addEventListener('click', function (ev) {
  if (ev.target === modalOverlay) {
    modalOverlay.style.display = 'none';
    addTaskFlag = false;
  }
});

// Remove tickets
removeBtn.addEventListener('click', function () {
  removeTaskFlag = !removeTaskFlag;
  const allTickets = document.querySelectorAll('.ticket-cont');
  allTickets.forEach(ticket => handleTicketRemoval(ticket));
  removeBtn.style.background = removeTaskFlag ? '#ff4d4d' : 'white';
});

// Create ticket
function createTicket(ticketColor, ticketTask, ticketID) {
  const ticketCont = document.createElement('div');
  ticketCont.classList.add('ticket-cont');
  ticketCont.innerHTML = `
    <div class="ticket-color" style="background-color: ${ticketColor}"></div>
    <div class="ticket-id">${ticketID}</div>
    <div class="ticket-area">${ticketTask}</div>
    <div class="ticket-lock"><i class="fa-solid fa-lock"></i></div>
  `;
  document.querySelector('.main-cont').appendChild(ticketCont);
  handleLock(ticketCont);
  handleColor(ticketCont);
  handleTicketRemoval(ticketCont);
}

// Create ticket on Enter
modalCont.addEventListener('keydown', function (ev) {
  if (ev.key === 'Enter') {
    const ticketTaskValue = textAreaCont.value.trim();
    if (!ticketTaskValue) return; // prevent empty tickets

    const ticketID = Math.random().toString(36).substring(2, 9);
    createTicket(modalPriorityColor, ticketTaskValue, ticketID);
    modalOverlay.style.display = 'none';
    textAreaCont.value = '';

    ticketArr.push({ ticketID, ticketColor: modalPriorityColor, taskContent: ticketTaskValue });
    updateLocalStorage();
  }
});

// Priority colors
let modalPriorityColor = 'black';
document.querySelectorAll('.priority-color').forEach(colorElem => {
  colorElem.addEventListener('click', function () {
    document.querySelectorAll('.priority-color').forEach(c => c.classList.remove('active'));
    colorElem.classList.add('active');
    modalPriorityColor = colorElem.getAttribute('data-color');
  });
});

// Lock functionality
function handleLock(ticketElem) {
  const ticketLockElem = ticketElem.querySelector('.ticket-lock');
  const ticketTaskArea = ticketElem.querySelector('.ticket-area');
  const id = ticketElem.querySelector('.ticket-id').innerText;

  ticketLockElem.addEventListener('click', function () {
    const ticketIdx = getTicketIdx(id);
    if (ticketLockElem.children[0].classList.contains('fa-lock')) {
      ticketLockElem.children[0].classList.replace('fa-lock', 'fa-lock-open');
      ticketTaskArea.setAttribute('contenteditable', "true");
    } else {
      ticketLockElem.children[0].classList.replace('fa-lock-open', 'fa-lock');
      ticketTaskArea.setAttribute('contenteditable', "false");
    }
    ticketArr[ticketIdx].taskContent = ticketTaskArea.innerText;
    updateLocalStorage();
  });
}

// Change color
const colors = ['lightpink', 'lightgreen', 'lightblue', 'black'];
function handleColor(ticketElem) {
  const ticketColorBand = ticketElem.querySelector('.ticket-color');
  const id = ticketElem.querySelector('.ticket-id').innerText;

  ticketColorBand.addEventListener('click', function () {
    const currentColor = colors.find(color => ticketColorBand.style.backgroundColor.includes(color)) || colors[0];
    const currentColorIndex = colors.indexOf(currentColor);
    const newColorIndex = (currentColorIndex + 1) % colors.length;
    const newTicketColor = colors[newColorIndex];

    ticketColorBand.style.backgroundColor = newTicketColor;
    const ticketIdx = getTicketIdx(id);
    ticketArr[ticketIdx].ticketColor = newTicketColor;
    updateLocalStorage();
  });
}

// Remove ticket
function handleTicketRemoval(ticketElem) {
  ticketElem.addEventListener('click', function () {
    if (removeTaskFlag) {
      const id = ticketElem.querySelector('.ticket-id').innerText;
      const idx = getTicketIdx(id);
      ticketArr.splice(idx, 1);
      updateLocalStorage();
      ticketElem.remove();
    }
  });
}

// Update local storage
function updateLocalStorage() {
  localStorage.setItem('tickets', JSON.stringify(ticketArr));
}

// Init tickets
function initialise() {
  ticketArr.forEach(ticket => {
    createTicket(ticket.ticketColor, ticket.taskContent, ticket.ticketID);
  });
}
initialise();

function getTicketIdx(id) {
  return ticketArr.findIndex(ticket => ticket.ticketID === id);
}
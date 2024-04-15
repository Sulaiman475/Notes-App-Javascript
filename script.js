
const togglers = document.querySelectorAll('[data-model-toggler]');

const addBtnInit = document.querySelector('[data-add-task]');
const overlay = document.querySelector('[data-overlay]');
const closeBtn = document.querySelector('.cross');
const modelWindow = document.querySelector('[data-model-window]');
const noteContentModel = document.querySelector('.content');

const noteModel = document.querySelector('[data-note-model]');
const noteTogglers = document.querySelectorAll('[data-note-toggler]');


const btnModel = document.querySelector('.btn-model');
const createForm = document.querySelector('.model-form');
const parentNotes = document.querySelector('.all-notes');

const addEventsOnElements = function(elements, eventType, callback) {
    for(let i = 0, len = togglers.length; i < len; i++) {
        elements[i].addEventListener(eventType, callback);
    }
}

const togglerModel = function (noteToUpdate = 0) {
    overlay.classList.toggle('active');
    modelWindow.classList.toggle('active');

    
    if(noteToUpdate != 0) {
        modelWindow.querySelector('#title').value = noteToUpdate.title;
        modelWindow.querySelector('#message').value = noteToUpdate.message;   
        modelWindow.querySelector('#hiddenField').value = noteToUpdate.id;
    }
}



function addEventsForNotes(elements, eventType, callback) {
    for(let i = 0, len = noteTogglers.length; i < len; i++) {
        elements[i].addEventListener(eventType, callback);
    }
}

function noteModelRead(e, data = null) {
    document.querySelector('[data-note-overlay]').classList.toggle('active');
    noteModel.classList.toggle('active');
    
    if(data != null) {
        const content = noteModel.querySelector('.content');
        console.log(content)
        content.querySelector('.h2').textContent = `${data[0].title}`;
        content.querySelector('p').textContent = `${data[0].message}`;
    }

}
addEventsForNotes(noteTogglers, 'click', (e) => noteModelRead(e));



addEventsOnElements(togglers, 'click', (e) => togglerModel());


function shortText(text) {
    if(text.length > 80) {
        const tempText = text.slice(0, 100)
        const shortText = tempText.trim() + '...'
        return shortText;
    } else {
        return text;
    }
}




////////////////////////////////  DATE FUNCTIONS   ////////////////////////////////////////

function convertDate(date) {
    // Names of months (only first 3 letters)
    const monthsAbbreviated = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Days of the month with full names (starting from Sunday)
    const daysFullNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Getting hours
    const hours = date.getHours();

    // Getting minutes
    const currentTimeMillis = date.getTime();
    const currentTimeSeconds = Math.floor(currentTimeMillis / 1000);
    const currentMinutes = Math.floor(currentTimeSeconds / 60);
    const minutes = currentMinutes % 60;

    let dateObj = {
        hours: hours < 10 ? "0" + hours : hours.toString(),
        minutes: minutes < 10 ? '0' + minutes : minutes.toString(),
        dayName: daysFullNames[date.getDay()],
        dayOfMonth: date.getDate(),
        monthName: monthsAbbreviated[date.getMonth()],
        year: date.getFullYear(),
    }

    // console.log(`${dateObj.dayName}, ${dateObj.dayOfMonth} ${dateObj.monthName} ${dateObj.year} at ${dateObj.hours}:${dateObj.minutes}`);
    return `${dateObj.dayName}, ${dateObj.dayOfMonth} ${dateObj.monthName} ${dateObj.year} at ${dateObj.hours}:${dateObj.minutes}`;
}

// Get data from forms
function getDataForm(thisKeyword) {
    // Get form data
    const formData = new FormData(thisKeyword);
    // Convert form data entries to object
    const formDataObj = Object.fromEntries(formData.entries());
    return formDataObj;
}


////////////////////////////////  APP VARIABLES   ////////////////////////////////////////
let notesArr = JSON.parse(localStorage.getItem("notes")) ?? [];

////////////////////////////////  LISTENER FUNCTIONS   ////////////////////////////////////////

function addListenersToNotes() {
    document.querySelectorAll('.note').forEach(function(note) {
        note.addEventListener('click', (e) => callback(e));
    })
}

function callback(e) {
    // console.log(e.target);
    const targetElement = e.target;
    if(targetElement.classList.contains('trash-outline')) {
        deleteNote(targetElement)
    } else if(targetElement.classList.contains('create-outline')) {
        updateNote(targetElement)
    } else {
        const id = e.target.dataset.id

        const data = notesArr.filter(item => item.id == id)
        noteModelRead(targetElement, data)
    }
}



////////////////////////////////  MAIN FUNCTIONS   ////////////////////////////////////////


////////////////////////////////  Add Note   ////////////////////////////////////
function addNote(formDataObj) {
    let note = {
        title: formDataObj.title,
        message: formDataObj.message,
        time: convertDate(new Date()),
        id: new Date().getTime(),
    }
    // console.log(note)
    
    notesArr.push(note);
    
    localStorage.setItem("notes", JSON.stringify(notesArr));
    
    displayNote();
    
    togglerModel();
}


////////////////////////////////  Display Note   ////////////////////////////////////
function displayNote(arr = 0) {
    let data = [];
    
    if(arr != 0) {
        data = arr;
    } else {
        
        data = JSON.parse(localStorage.getItem('notes'))
    }
    console.log(arr)
    
    const reverseArr = data?.slice();
    const markup = reverseArr.reverse().map(note => generateTaskMarkup(note)).join('');
    
    parentNotes.innerHTML = '';
    parentNotes.insertAdjacentHTML('beforeend', markup);
    addListenersToNotes();
}

////////////////////////////////  Delete Note   ////////////////////////////////////
function deleteNote(targetElement) {
    const noteParent = targetElement.closest('.note');
    // console.log(noteParent)
    const id = noteParent.dataset.id;
    console.log(id)
    let filteredArr = notesArr.filter(note => {
        return note.id.toString() != id;
    })
    
    notesArr = filteredArr;
    localStorage.setItem("notes", JSON.stringify(notesArr));
    displayNote()
}

////////////////////////////////  Update Note   ////////////////////////////////////
function updateNote(targetElement) {
    const noteParent = targetElement.closest('.note');
    const id = noteParent.dataset.id;
    
    let noteToUpdate = notesArr.find(note => note.id == id);
    console.log(noteToUpdate)
    togglerModel(noteToUpdate);
    
}

function updateNoteActual(formDataObj) {
    let note = {
        title: formDataObj.title,
        message: formDataObj.message,
        time: convertDate(new Date()),
        id: +formDataObj.hiddenField,
    }
    // console.log(note);
    console.log(notesArr.filter(el => el.id != note.id))      
    
    const index = notesArr.findIndex(el => el.id == note.id)
    notesArr.splice(index, 1);
    notesArr.push(note)
    
    localStorage.setItem("notes", JSON.stringify(notesArr))
    
    displayNote();
    togglerModel()
}


////////////////////////////////  Update Note   ////////////////////////////////////
createForm.addEventListener('submit', function(e) {
    e.preventDefault();
  
    const formDataObj = getDataForm(e.target);
    console.log(formDataObj)
    // console.log(formDataObj)
    this.querySelector('.title').value = "";
    this.querySelector('textarea').value = "";
    this.querySelector('#hiddenField').value = "hiddenValue";
    
    if(formDataObj.hiddenField != 'hiddenValue') {
        updateNoteActual(formDataObj);
    } else
    addNote(formDataObj);
    // console.log("data")      
    
})


////////////////////////////////  Generating Markup   ////////////////////////////////////
function generateTaskMarkup(note) {
    const html = `
        <div class="note" data-id="${note.id}" data-note-toggler>
            <h5 class="title">${note.title}</h5>
            <p class="note-text">
                ${shortText(note.message)}
            </p>
            <div class="btn-date">
                <div class="btns">
                    <button class="btn">
                        <ion-icon name="create-outline" class="create-outline"></ion-icon>
                    </button>
                    <button class="btn">
                        <ion-icon name="trash-outline" class="trash-outline"></ion-icon>
                    </button>
                </div>
                <p class="date">${note.time}</p>
            </div>
        </div>
    `;

    return html;
}

window.addEventListener('load', () => displayNote())




//////////////////////////////////////   SEARCH  /////////////////////////////////////////////

const searchField = document.querySelector('#search');
searchField.addEventListener('input', (e) => searchNotes(e));

function searchNotes(e) {
    const value = e.target.value;
    const arr = notesArr.filter(item => {
        return item.title.toLowerCase().includes(value.toLowerCase()) || item.message.toLowerCase().includes(value.toLowerCase())
    })
    // console.log(alpha)
    displayNote(arr)

}


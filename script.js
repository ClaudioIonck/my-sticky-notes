const notesContainer = document.getElementById("app");
const addNoteButton = notesContainer.querySelector(".add-note");

getNotes().forEach((note) => {
    const noteElement = createNoteElement(note.id, note.content);
    notesContainer.insertBefore(noteElement, addNoteButton);
});

addNoteButton.addEventListener("click", () => addNote());

function getNotes() {
    return JSON.parse(localStorage.getItem("notes") || "[]");
}

function saveNotes(notes) {
    localStorage.setItem('notes', JSON.stringify(notes));
}

function loadNotes() {
    const notes = localStorage.getItem('notes');
    return notes ? JSON.parse(notes) : [];
}

function createNoteElement(id, content) {
    const noteElement = document.createElement("div");
    noteElement.classList.add("note-container");

    const element = document.createElement("textarea");
    element.classList.add("note");
    element.value = content;
    element.placeholder = "Empty Sticky Note";

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.classList.add("delete-note");

    element.addEventListener("change", () => {
        updateNote(id, element.value);
    });

    deleteButton.addEventListener("click", () => {
        const currentNoteContent = element.value.trim();

        if (currentNoteContent !== "") {
            swal({
                title: "Are you sure?",
                text: "Once deleted, you will not be able to recover this sticky note!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    deleteNote(id, noteElement);
                }
            });
        } else {
            deleteNote(id, noteElement);
        }
    });

    noteElement.appendChild(element);
    noteElement.appendChild(deleteButton);

    return noteElement;
}

function addNote() {
    const notes = getNotes();
    const noteObject = {
        id: Math.floor(Math.random() * 100000),
        content: ""
    };

    const noteElement = createNoteElement(noteObject.id, noteObject.content);
    notesContainer.insertBefore(noteElement, addNoteButton);

    notes.push(noteObject);
    saveNotes(notes);
}

function updateNote(id, newContent) {
    const notes = getNotes();
    const targetNote = notes.filter((note) => note.id == id)[0];

    targetNote.content = newContent;
    saveNotes(notes);
}

function deleteNote(id, element) {
    const notes = getNotes().filter((note) => note.id != id);

    saveNotes(notes);
    notesContainer.removeChild(element);
}

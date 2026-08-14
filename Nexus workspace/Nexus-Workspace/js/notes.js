/* =====================================================
   NEXUS WORKSPACE
   NOTES & KNOWLEDGE BASE
===================================================== */


/* =====================================================
   STORAGE
===================================================== */

let nexusNotes =
    JSON.parse(
        localStorage.getItem(
            "nexusNotes"
        )
    ) || [];


let activeNoteId = null;


/* =====================================================
   ELEMENTS
===================================================== */

const notesList =
    document.getElementById(
        "notesList"
    );

const noteSearch =
    document.getElementById(
        "noteSearch"
    );

const noteCategoryFilter =
    document.getElementById(
        "noteCategoryFilter"
    );

const noteTitle =
    document.getElementById(
        "noteTitle"
    );

const noteCategory =
    document.getElementById(
        "noteCategory"
    );

const noteContent =
    document.getElementById(
        "noteContent"
    );

const noteEditor =
    document.getElementById(
        "noteEditor"
    );

const noteEmptyState =
    document.getElementById(
        "noteEmptyState"
    );

const noteSavedStatus =
    document.getElementById(
        "noteSavedStatus"
    );


/* =====================================================
   SAVE
===================================================== */

function saveNotes() {

    localStorage.setItem(
        "nexusNotes",
        JSON.stringify(
            nexusNotes
        )
    );

}


/* =====================================================
   CREATE NOTE
===================================================== */

function createNote() {

    const now =
        new Date().toISOString();


    const newNote = {

        id:
            Date.now(),

        title:
            "Untitled Note",

        content:
            "",

        category:
            "Academic",

        pinned:
            false,

        created:
            now,

        updated:
            now

    };


    nexusNotes.unshift(
        newNote
    );


    saveNotes();


    activeNoteId =
        newNote.id;


    renderNotesList();

    openNote(
        newNote.id
    );

}


/* =====================================================
   OPEN NOTE
===================================================== */

function openNote(
    id
) {

    const note =
        nexusNotes.find(
            item =>
                item.id === id
        );


    if (!note) {

        return;

    }


    activeNoteId =
        id;


    noteEditor.style.display =
        "flex";


    noteEmptyState.style.display =
        "none";


    noteTitle.value =
        note.title;


    noteCategory.value =
        note.category;


    noteContent.value =
        note.content;


    updatePinButton(
        note
    );


    updateWordCount();

    updateNoteDate(
        note
    );


    renderNotesList();

}


/* =====================================================
   UPDATE NOTE
===================================================== */

function updateCurrentNote() {

    if (
        activeNoteId === null
    ) {

        return;

    }


    const note =
        nexusNotes.find(
            item =>
                item.id ===
                activeNoteId
        );


    if (!note) {

        return;

    }


    note.title =
        noteTitle.value
            .trim() ||
        "Untitled Note";


    note.category =
        noteCategory.value;


    note.content =
        noteContent.value;


    note.updated =
        new Date().toISOString();


    saveNotes();


    renderNotesList();

    updateWordCount();

    updateNoteDate(
        note
    );


    noteSavedStatus.textContent =
        "Saved";

}


/* =====================================================
   AUTO SAVE
===================================================== */

let saveTimeout;


function scheduleSave() {

    noteSavedStatus.textContent =
        "Saving...";


    clearTimeout(
        saveTimeout
    );


    saveTimeout =
        setTimeout(
            updateCurrentNote,
            400
        );

}


/* =====================================================
   PIN
===================================================== */

function togglePin() {

    if (
        activeNoteId === null
    ) {

        return;

    }


    const note =
        nexusNotes.find(
            item =>
                item.id ===
                activeNoteId
        );


    if (!note) {

        return;

    }


    note.pinned =
        !note.pinned;


    saveNotes();


    updatePinButton(
        note
    );


    renderNotesList();

}


function updatePinButton(
    note
) {

    const button =
        document.getElementById(
            "pinNoteButton"
        );


    if (
        note.pinned
    ) {

        button.textContent =
            "★ Pinned";

        button.classList.add(
            "pinned"
        );

    } else {

        button.textContent =
            "☆ Pin";

        button.classList.remove(
            "pinned"
        );

    }

}


/* =====================================================
   DELETE NOTE
===================================================== */

function deleteCurrentNote() {

    if (
        activeNoteId === null
    ) {

        return;

    }


    const confirmed =
        confirm(
            "Delete this note?"
        );


    if (!confirmed) {

        return;

    }


    nexusNotes =
        nexusNotes.filter(
            note =>
                note.id !==
                activeNoteId
        );


    saveNotes();


    activeNoteId =
        null;


    noteEditor.style.display =
        "none";


    noteEmptyState.style.display =
        "flex";


    renderNotesList();

}


/* =====================================================
   RENDER NOTES
===================================================== */

function renderNotesList() {

    if (!notesList) {

        return;

    }


    const search =
        noteSearch
            ?.value
            .toLowerCase()
            .trim() || "";


    const category =
        noteCategoryFilter
            ?.value || "all";


    let filtered =
        [...nexusNotes];


    if (search) {

        filtered =
            filtered.filter(
                note =>
                    note.title
                        .toLowerCase()
                        .includes(search) ||

                    note.content
                        .toLowerCase()
                        .includes(search)
            );

    }


    if (
        category !==
        "all"
    ) {

        filtered =
            filtered.filter(
                note =>
                    note.category ===
                    category
            );

    }


    /* Pinned first */

    filtered.sort(
        (a, b) => {

            if (
                a.pinned !==
                b.pinned
            ) {

                return b.pinned - a.pinned;

            }


            return (
                new Date(b.updated) -
                new Date(a.updated)
            );

        }
    );


    notesList.innerHTML =
        "";


    if (
        filtered.length ===
        0
    ) {

        notesList.innerHTML = `

            <div class="notes-list-empty">

                <span>✦</span>

                <p>
                    No notes found.
                </p>

            </div>

        `;

    }


    filtered.forEach(
        function(note) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "note-list-item";


            if (
                note.id ===
                activeNoteId
            ) {

                item.classList.add(
                    "active"
                );

            }


            if (
                note.pinned
            ) {

                item.classList.add(
                    "pinned"
                );

            }


            const preview =
                note.content
                    .replace(
                        /\s+/g,
                        " "
                    )
                    .trim();


            item.innerHTML = `

                <span class="note-list-title">

                    ${
                        escapeHTML(
                            note.title
                        )
                    }

                </span>

                <span class="note-list-preview">

                    ${
                        escapeHTML(
                            preview ||
                            "No content yet..."
                        )
                    }

                </span>

                <div class="note-list-meta">

                    <span class="note-list-category">

                        ${
                            escapeHTML(
                                note.category
                            )
                        }

                    </span>

                    <span class="note-list-date">

                        ${
                            formatNoteDate(
                                note.updated
                            )
                        }

                    </span>

                </div>

            `;


            item.addEventListener(
                "click",
                function() {

                    openNote(
                        note.id
                    );

                }
            );


            notesList.appendChild(
                item
            );

        }
    );


    const count =
        document.getElementById(
            "notesCount"
        );


    if (count) {

        count.textContent =
            `${nexusNotes.length} ${
                nexusNotes.length === 1
                    ? "note"
                    : "notes"
            }`;

    }

}


/* =====================================================
   WORD COUNT
===================================================== */

function updateWordCount() {

    if (!noteContent) {

        return;

    }


    const text =
        noteContent.value
            .trim();


    const words =
        text
            ? text.split(/\s+/).length
            : 0;


    document.getElementById(
        "noteWordCount"
    ).textContent =
        `${words} ${
            words === 1
                ? "word"
                : "words"
        }`;

}


/* =====================================================
   DATE
===================================================== */

function updateNoteDate(
    note
) {

    const element =
        document.getElementById(
            "noteUpdated"
        );


    if (!element) {

        return;

    }


    element.textContent =
        `Last edited ${
            formatNoteDate(
                note.updated
            )
        }`;

}


function formatNoteDate(
    dateString
) {

    const date =
        new Date(
            dateString
        );


    return date.toLocaleDateString(
        undefined,
        {
            day: "numeric",
            month: "short"
        }
    );

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(
    value
) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =====================================================
   EVENT LISTENERS
===================================================== */

document.getElementById(
    "newNoteButton"
)?.addEventListener(
    "click",
    createNote
);


document.getElementById(
    "emptyCreateNote"
)?.addEventListener(
    "click",
    createNote
);


document.getElementById(
    "deleteCurrentNote"
)?.addEventListener(
    "click",
    deleteCurrentNote
);


document.getElementById(
    "pinNoteButton"
)?.addEventListener(
    "click",
    togglePin
);


noteTitle?.addEventListener(
    "input",
    scheduleSave
);


noteCategory?.addEventListener(
    "change",
    scheduleSave
);


noteContent?.addEventListener(
    "input",
    function() {

        updateWordCount();

        scheduleSave();

    }
);


noteSearch?.addEventListener(
    "input",
    renderNotesList
);


noteCategoryFilter?.addEventListener(
    "change",
    renderNotesList
);


/* =====================================================
   CLEAR ALL
===================================================== */

document.getElementById(
    "clearNotesButton"
)?.addEventListener(
    "click",
    function() {

        if (
            nexusNotes.length === 0
        ) {

            return;

        }


        const confirmed =
            confirm(
                "Delete ALL your notes? This cannot be undone."
            );


        if (!confirmed) {

            return;

        }


        nexusNotes = [];

        activeNoteId = null;


        saveNotes();


        noteEditor.style.display =
            "none";


        noteEmptyState.style.display =
            "flex";


        renderNotesList();

    }
);


/* =====================================================
   INITIALIZE
===================================================== */

renderNotesList();
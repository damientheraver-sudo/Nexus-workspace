/* =====================================================
   NEXUS WORKSPACE
   GLOBAL SEARCH ENGINE
===================================================== */


/* =====================================================
   STATE
===================================================== */

let nexusSearchResults = [];

let nexusSearchSelectedIndex = -1;


/* =====================================================
   ELEMENTS
===================================================== */

const searchOverlay =
    document.getElementById(
        "nexusSearchOverlay"
    );

const searchInput =
    document.getElementById(
        "globalSearchInput"
    );

const searchResults =
    document.getElementById(
        "globalSearchResults"
    );

const searchEmpty =
    document.getElementById(
        "globalSearchEmpty"
    );

const searchResultsHeader =
    document.getElementById(
        "searchResultsHeader"
    );


/* =====================================================
   OPEN SEARCH
===================================================== */

function openNexusSearch() {

    if (!searchOverlay) {

        return;

    }


    searchOverlay.hidden =
        false;


    document.body.style.overflow =
        "hidden";


    setTimeout(
        () => {

            searchInput?.focus();

        },
        50
    );


    renderSearchResults(
        ""
    );

}


/* =====================================================
   CLOSE SEARCH
===================================================== */

function closeNexusSearch() {

    if (!searchOverlay) {

        return;

    }


    searchOverlay.hidden =
        true;


    document.body.style.overflow =
        "";


    if (searchInput) {

        searchInput.value =
            "";

    }


    nexusSearchSelectedIndex =
        -1;

}


/* =====================================================
   TRIGGER
===================================================== */

document
    .getElementById(
        "globalSearchTrigger"
    )
    ?.addEventListener(
        "click",
        openNexusSearch
    );


/* =====================================================
   ESCAPE
===================================================== */

searchOverlay
    ?.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                searchOverlay
            ) {

                closeNexusSearch();

            }

        }
    );


/* =====================================================
   KEYBOARD SHORTCUT
===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.ctrlKey &&
            event.key.toLowerCase() === "k"
        ) {

            event.preventDefault();

            if (
                searchOverlay?.hidden
            ) {

                openNexusSearch();

            } else {

                closeNexusSearch();

            }

        }


        if (
            event.key === "Escape" &&
            !searchOverlay?.hidden
        ) {

            closeNexusSearch();

        }

    }
);


/* =====================================================
   SEARCH INPUT
===================================================== */

searchInput
    ?.addEventListener(
        "input",
        function() {

            renderSearchResults(
                this.value
            );

        }
    );


/* =====================================================
   COLLECT DATA
===================================================== */

function collectNexusSearchData() {

    const results = [];


    /* -----------------------------------------------
       TASKS
    ------------------------------------------------ */

    const tasks =
        getSearchStorageArray(
            "nexusTasks"
        );


    tasks.forEach(
        task => {

            results.push({

                id:
                    task.id ||
                    `task-${Math.random()}`,

                title:
                    task.title ||
                    task.name ||
                    "Untitled Task",

                description:
                    task.description ||
                    task.notes ||
                    "Workspace task",

                type: "task",

                icon: "✓",

                page: "tasks",

                data: task

            });

        }
    );


    /* -----------------------------------------------
       NOTES
    ------------------------------------------------ */

    const notes =
        getSearchStorageArray(
            "nexusNotes"
        );


    notes.forEach(
        note => {

            results.push({

                id:
                    note.id ||
                    `note-${Math.random()}`,

                title:
                    note.title ||
                    "Untitled Note",

                description:
                    note.content ||
                    note.text ||
                    "Workspace note",

                type: "note",

                icon: "✎",

                page: "notes",

                data: note

            });

        }
    );


    /* -----------------------------------------------
       RESOURCES
    ------------------------------------------------ */

    const resources =
        getSearchStorageArray(
            "nexusResources"
        );


    resources.forEach(
        resource => {

            results.push({

                id:
                    resource.id ||
                    `resource-${Math.random()}`,

                title:
                    resource.title ||
                    resource.name ||
                    "Resource",

                description:
                    resource.description ||
                    resource.category ||
                    "Academic resource",

                type: "resource",

                icon: "◇",

                page: "resources",

                data: resource

            });

        }
    );


    /* -----------------------------------------------
       PROJECTS
    ------------------------------------------------ */

    const projects =
        getSearchStorageArray(
            "nexusProjects"
        );


    projects.forEach(
        project => {

            results.push({

                id:
                    project.id ||
                    `project-${Math.random()}`,

                title:
                    project.title ||
                    project.name ||
                    "Engineering Project",

                description:
                    project.description ||
                    project.technology ||
                    "Engineering project",

                type: "project",

                icon: "⌘",

                page: "engineering",

                data: project

            });

        }
    );


    /* -----------------------------------------------
       NOTIFICATIONS
    ------------------------------------------------ */

    const notifications =
        getSearchStorageArray(
            "nexusNotifications"
        );


    notifications.forEach(
        notification => {

            results.push({

                id:
                    notification.id ||
                    `notification-${Math.random()}`,

                title:
                    notification.title ||
                    "Notification",

                description:
                    notification.message ||
                    "Nexus notification",

                type: "notification",

                icon:
                    notification.icon ||
                    "N",

                page: "notifications",

                data: notification

            });

        }
    );


    /* -----------------------------------------------
       CALENDAR
    ------------------------------------------------ */

    const calendarKeys = [

        "nexusCalendar",

        "nexusEvents",

        "calendarEvents"

    ];


    let calendar =
        [];


    for (
        const key of calendarKeys
    ) {

        const stored =
            getSearchStorageArray(
                key
            );


        if (
            stored.length
        ) {

            calendar =
                stored;

            break;

        }

    }


    calendar.forEach(
        event => {

            results.push({

                id:
                    event.id ||
                    `calendar-${Math.random()}`,

                title:
                    event.title ||
                    event.name ||
                    "Calendar Event",

                description:
                    event.description ||
                    event.date ||
                    "Calendar event",

                type: "calendar",

                icon: "◷",

                page: "calendar",

                data: event

            });

        }
    );


    /* -----------------------------------------------
       ACADEMIC SUBJECTS
    ------------------------------------------------ */

    const academics =
        getSearchStorageArray(
            "nexusSubjects"
        );


    academics.forEach(
        subject => {

            results.push({

                id:
                    subject.id ||
                    `subject-${Math.random()}`,

                title:
                    subject.name ||
                    subject.title ||
                    "Academic Subject",

                description:
                    subject.code ||
                    subject.description ||
                    "Academic subject",

                type: "academic",

                icon: "⌘",

                page: "academics",

                data: subject

            });

        }
    );


    return results;

}


/* =====================================================
   SEARCH
===================================================== */

function performNexusSearch(
    query
) {

    const allData =
        collectNexusSearchData();


    const cleanQuery =
        query
            .trim()
            .toLowerCase();


    if (!cleanQuery) {

        return [];

    }


    return allData
        .filter(
            item => {

                const searchable =
                    [

                        item.title,

                        item.description,

                        item.type

                    ]
                        .join(" ")
                        .toLowerCase();


                return searchable
                    .includes(
                        cleanQuery
                    );

            }
        )
        .slice(
            0,
            30
        );

}


/* =====================================================
   RENDER
===================================================== */

function renderSearchResults(
    query
) {

    if (!searchResults) {

        return;

    }


    nexusSearchResults =
        performNexusSearch(
            query
        );


    nexusSearchSelectedIndex =
        -1;


    searchResults.innerHTML =
        "";


    if (
        !query.trim()
    ) {

        searchResultsHeader.textContent =
            "Start typing to search your workspace.";


        searchEmpty.hidden =
            true;


        return;

    }


    searchResultsHeader.textContent =
        `${nexusSearchResults.length} result${
            nexusSearchResults.length === 1
                ? ""
                : "s"
        } found`;


    if (
        nexusSearchResults.length === 0
    ) {

        searchEmpty.hidden =
            false;

        return;

    }


    searchEmpty.hidden =
        true;


    nexusSearchResults.forEach(
        (
            result,
            index
        ) => {

            const element =
                createSearchResult(
                    result,
                    index
                );


            searchResults.appendChild(
                element
            );

        }
    );

}


/* =====================================================
   RESULT ELEMENT
===================================================== */

function createSearchResult(
    result,
    index
) {

    const element =
        document.createElement(
            "div"
        );


    element.className =
        "global-search-result";


    element.dataset.index =
        index;


    element.innerHTML = `

        <div class="search-result-icon">

            ${escapeSearchHTML(
                result.icon
            )}

        </div>


        <div class="search-result-content">

            <div class="search-result-title">

                ${escapeSearchHTML(
                    result.title
                )}

            </div>


            <div class="search-result-description">

                ${escapeSearchHTML(
                    result.description
                )}

            </div>

        </div>


        <span class="search-result-type">

            ${escapeSearchHTML(
                result.type
            )}

        </span>

    `;


    element.addEventListener(
        "click",
        function() {

            openNexusSearchResult(
                result
            );

        }
    );


    return element;

}


/* =====================================================
   OPEN RESULT
===================================================== */

function openNexusSearchResult(
    result
) {

    closeNexusSearch();


    if (
        typeof window.navigateToPage ===
        "function"
    ) {

        window.navigateToPage(
            result.page
        );

        return;

    }


    const page =
        document.getElementById(
            result.page
        );


    if (page) {

        document
            .querySelectorAll(
                ".page-section"
            )
            .forEach(
                section =>
                    section.classList
                        .remove(
                            "active"
                        )
            );


        page.classList.add(
            "active"
        );

    }

}


/* =====================================================
   KEYBOARD NAVIGATION
===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            searchOverlay?.hidden
        ) {

            return;

        }


        if (
            event.key === "ArrowDown"
        ) {

            event.preventDefault();

            moveSearchSelection(
                1
            );

        }


        if (
            event.key === "ArrowUp"
        ) {

            event.preventDefault();

            moveSearchSelection(
                -1
            );

        }


        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            if (
                nexusSearchSelectedIndex >=
                0
            ) {

                const result =
                    nexusSearchResults[
                        nexusSearchSelectedIndex
                    ];


                if (result) {

                    openNexusSearchResult(
                        result
                    );

                }

            }

        }

    }
);


/* =====================================================
   MOVE SELECTION
===================================================== */

function moveSearchSelection(
    direction
) {

    const elements =
        document.querySelectorAll(
            ".global-search-result"
        );


    if (
        elements.length === 0
    ) {

        return;

    }


    nexusSearchSelectedIndex +=
        direction;


    if (
        nexusSearchSelectedIndex < 0
    ) {

        nexusSearchSelectedIndex =
            elements.length - 1;

    }


    if (
        nexusSearchSelectedIndex >=
        elements.length
    ) {

        nexusSearchSelectedIndex =
            0;

    }


    elements.forEach(
        element =>
            element.classList
                .remove(
                    "selected"
                )
    );


    const selected =
        elements[
            nexusSearchSelectedIndex
        ];


    selected.classList.add(
        "selected"
    );


    selected.scrollIntoView({
        block: "nearest"
    });

}


/* =====================================================
   STORAGE HELPER
===================================================== */

function getSearchStorageArray(
    key
) {

    try {

        const value =
            localStorage.getItem(
                key
            );


        if (!value) {

            return [];

        }


        const parsed =
            JSON.parse(
                value
            );


        return Array.isArray(
            parsed
        )
            ? parsed
            : [];

    } catch {

        return [];

    }

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeSearchHTML(
    value
) {

    return String(
        value ?? ""
    )
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
   GLOBAL ACCESS
===================================================== */

window.NexusSearch = {

    open:
        openNexusSearch,

    close:
        closeNexusSearch,

    search:
        performNexusSearch

};
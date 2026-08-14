/* =====================================================
   NEXUS WORKSPACE
   COMMAND CENTER
===================================================== */


/* =====================================================
   ELEMENTS
===================================================== */

const commandOverlay =
    document.getElementById(
        "nexusCommandOverlay"
    );

const commandInput =
    document.getElementById(
        "commandInput"
    );

const commandList =
    document.getElementById(
        "commandList"
    );

const commandEmpty =
    document.getElementById(
        "commandEmpty"
    );


/* =====================================================
   STATE
===================================================== */

let commandResults = [];

let selectedCommandIndex = -1;


/* =====================================================
   COMMAND DEFINITIONS
===================================================== */

const nexusCommands = [

    {
        id: "new-task",

        title: "New Task",

        description:
            "Create a new task in your workspace.",

        icon: "✓",

        shortcut: "T",

        action: () => {

            openNexusPage("tasks");

            dispatchNexusEvent(
                "nexus:new-task"
            );

        }

    },


    {
        id: "new-note",

        title: "New Note",

        description:
            "Create a new study or work note.",

        icon: "✎",

        shortcut: "N",

        action: () => {

            openNexusPage("notes");

            dispatchNexusEvent(
                "nexus:new-note"
            );

        }

    },


    {
        id: "new-calendar",

        title: "Add Calendar Event",

        description:
            "Schedule a lecture, deadline or event.",

        icon: "◷",

        shortcut: "C",

        action: () => {

            openNexusPage("calendar");

            dispatchNexusEvent(
                "nexus:new-calendar-event"
            );

        }

    },


    {
        id: "start-focus",

        title: "Start Focus Session",

        description:
            "Start a focused study session.",

        icon: "◉",

        shortcut: "F",

        action: () => {

            openNexusPage("focus");

            dispatchNexusEvent(
                "nexus:start-focus"
            );

        }

    },


    {
        id: "academics",

        title: "Open Academics",

        description:
            "View your academic dashboard.",

        icon: "⌘",

        shortcut: "A",

        action: () => {

            openNexusPage("academics");

        }

    },


    {
        id: "engineering",

        title: "Open Engineering Lab",

        description:
            "Open your Computer Engineering workspace.",

        icon: "⚙",

        shortcut: "E",

        action: () => {

            openNexusPage("engineering");

        }

    },


    {
        id: "resources",

        title: "Open Resources",

        description:
            "Browse study materials and resources.",

        icon: "◇",

        shortcut: "R",

        action: () => {

            openNexusPage("resources");

        }

    },


    {
        id: "calendar",

        title: "Open Calendar",

        description:
            "View your schedule and upcoming events.",

        icon: "◷",

        shortcut: "D",

        action: () => {

            openNexusPage("calendar");

        }

    },


    {
        id: "analytics",

        title: "Open Analytics",

        description:
            "Review your study and productivity statistics.",

        icon: "▥",

        shortcut: "Y",

        action: () => {

            openNexusPage("analytics");

        }

    },


    {
        id: "notifications",

        title: "Open Notifications",

        description:
            "View alerts and important updates.",

        icon: "●",

        shortcut: "I",

        action: () => {

            openNexusPage("notifications");

        }

    },


    {
        id: "settings",

        title: "Open Settings",

        description:
            "Configure Nexus Workspace.",

        icon: "⚙",

        shortcut: "S",

        action: () => {

            openNexusPage("settings");

        }

    }

];


/* =====================================================
   OPEN
===================================================== */

function openNexusCommandCenter() {

    if (!commandOverlay) {

        return;

    }


    commandOverlay.hidden =
        false;


    document.body.style.overflow =
        "hidden";


    selectedCommandIndex =
        -1;


    if (commandInput) {

        commandInput.value =
            "";

    }


    renderCommands(
        ""
    );


    setTimeout(
        () => {

            commandInput?.focus();

        },
        50
    );

}


/* =====================================================
   CLOSE
===================================================== */

function closeNexusCommandCenter() {

    if (!commandOverlay) {

        return;

    }


    commandOverlay.hidden =
        true;


    document.body.style.overflow =
        "";


    selectedCommandIndex =
        -1;

}


/* =====================================================
   TRIGGER
===================================================== */

document
    .getElementById(
        "commandCenterTrigger"
    )
    ?.addEventListener(
        "click",
        openNexusCommandCenter
    );


/* =====================================================
   BACKDROP
===================================================== */

commandOverlay
    ?.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                commandOverlay
            ) {

                closeNexusCommandCenter();

            }

        }
    );


/* =====================================================
   CTRL + SPACE
===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.ctrlKey &&
            event.code === "Space"
        ) {

            event.preventDefault();


            if (
                commandOverlay?.hidden
            ) {

                openNexusCommandCenter();

            } else {

                closeNexusCommandCenter();

            }

        }


        if (
            event.key === "Escape" &&
            !commandOverlay?.hidden
        ) {

            closeNexusCommandCenter();

        }

    }
);


/* =====================================================
   INPUT
===================================================== */

commandInput
    ?.addEventListener(
        "input",
        function() {

            renderCommands(
                this.value
            );

        }
    );


/* =====================================================
   SEARCH COMMANDS
===================================================== */

function searchCommands(
    query
) {

    const cleanQuery =
        query
            .trim()
            .toLowerCase();


    if (!cleanQuery) {

        return [
            ...nexusCommands
        ];

    }


    return nexusCommands.filter(
        command => {

            const searchable =
                [

                    command.title,

                    command.description,

                    command.id

                ]
                    .join(" ")
                    .toLowerCase();


            return searchable.includes(
                cleanQuery
            );

        }
    );

}


/* =====================================================
   RENDER
===================================================== */

function renderCommands(
    query
) {

    if (!commandList) {

        return;

    }


    commandResults =
        searchCommands(
            query
        );


    selectedCommandIndex =
        -1;


    commandList.innerHTML =
        "";


    if (
        commandResults.length === 0
    ) {

        commandEmpty.hidden =
            false;

        return;

    }


    commandEmpty.hidden =
        true;


    commandResults.forEach(
        (
            command,
            index
        ) => {

            commandList.appendChild(
                createCommandElement(
                    command,
                    index
                )
            );

        }
    );

}


/* =====================================================
   CREATE COMMAND
===================================================== */

function createCommandElement(
    command,
    index
) {

    const element =
        document.createElement(
            "div"
        );


    element.className =
        "command-item";


    element.dataset.index =
        index;


    element.innerHTML = `

        <div class="command-icon">

            ${escapeCommandHTML(
                command.icon
            )}

        </div>


        <div class="command-content">

            <div class="command-title">

                ${escapeCommandHTML(
                    command.title
                )}

            </div>


            <div class="command-description">

                ${escapeCommandHTML(
                    command.description
                )}

            </div>

        </div>


        <span class="command-shortcut">

            ${escapeCommandHTML(
                command.shortcut
            )}

        </span>

    `;


    element.addEventListener(
        "click",
        function() {

            executeCommand(
                command
            );

        }
    );


    return element;

}


/* =====================================================
   EXECUTE
===================================================== */

function executeCommand(
    command
) {

    closeNexusCommandCenter();


    if (
        typeof command.action ===
        "function"
    ) {

        setTimeout(
            () => {

                command.action();

            },
            80
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
            commandOverlay?.hidden
        ) {

            return;

        }


        if (
            event.key === "ArrowDown"
        ) {

            event.preventDefault();

            moveCommandSelection(
                1
            );

        }


        if (
            event.key === "ArrowUp"
        ) {

            event.preventDefault();

            moveCommandSelection(
                -1
            );

        }


        if (
            event.key === "Enter"
        ) {

            event.preventDefault();


            if (
                selectedCommandIndex >= 0
            ) {

                const command =
                    commandResults[
                        selectedCommandIndex
                    ];


                if (command) {

                    executeCommand(
                        command
                    );

                }

            }

        }

    }
);


/* =====================================================
   MOVE SELECTION
===================================================== */

function moveCommandSelection(
    direction
) {

    const elements =
        document.querySelectorAll(
            ".command-item"
        );


    if (
        elements.length === 0
    ) {

        return;

    }


    selectedCommandIndex +=
        direction;


    if (
        selectedCommandIndex < 0
    ) {

        selectedCommandIndex =
            elements.length - 1;

    }


    if (
        selectedCommandIndex >=
        elements.length
    ) {

        selectedCommandIndex =
            0;

    }


    elements.forEach(
        element => {

            element.classList.remove(
                "selected"
            );

        }
    );


    const selected =
        elements[
            selectedCommandIndex
        ];


    selected.classList.add(
        "selected"
    );


    selected.scrollIntoView({
        block: "nearest"
    });

}


/* =====================================================
   NAVIGATION HELPER
===================================================== */

function openNexusPage(
    page
) {

    if (
        typeof window.navigateToPage ===
        "function"
    ) {

        window.navigateToPage(
            page
        );

        return;

    }


    const target =
        document.getElementById(
            page
        );


    if (!target) {

        console.warn(
            `Nexus page "${page}" not found.`
        );

        return;

    }


    document
        .querySelectorAll(
            ".page-section"
        )
        .forEach(
            section => {

                section.classList.remove(
                    "active"
                );

            }
        );


    target.classList.add(
        "active"
    );

}


/* =====================================================
   CUSTOM EVENTS
===================================================== */

function dispatchNexusEvent(
    eventName
) {

    document.dispatchEvent(
        new CustomEvent(
            eventName
        )
    );

}


/* =====================================================
   HTML ESCAPE
===================================================== */

function escapeCommandHTML(
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
   GLOBAL API
===================================================== */

window.NexusCommandCenter = {

    open:
        openNexusCommandCenter,

    close:
        closeNexusCommandCenter

};
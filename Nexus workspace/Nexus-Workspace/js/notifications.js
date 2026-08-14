/* =====================================================
   NEXUS WORKSPACE
   NOTIFICATION ENGINE
===================================================== */


/* =====================================================
   STORAGE KEY
===================================================== */

const NEXUS_NOTIFICATION_KEY =
    "nexusNotifications";


/* =====================================================
   DEFAULT NOTIFICATIONS
===================================================== */

const defaultNexusNotifications = [

    {

        id: "welcome",

        title: "Welcome to Nexus Workspace",

        message:
            "Your personal study and work command center is ready, Mr Damien.",

        type: "system",

        important: false,

        read: false,

        timestamp: Date.now(),

        icon: "N"

    },

    {

        id: "engineering",

        title: "Engineering Workspace Ready",

        message:
            "Your Computer Engineering workspace is ready for projects, notes and technical resources.",

        type: "academic",

        important: true,

        read: false,

        timestamp:
            Date.now() - 1000 * 60 * 30,

        icon: "⌘"

    }

];


/* =====================================================
   LOAD
===================================================== */

function getNexusNotifications() {

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    NEXUS_NOTIFICATION_KEY
                )
            );


        if (
            Array.isArray(saved)
        ) {

            return saved;

        }

    } catch {

        console.warn(
            "Unable to load Nexus notifications."
        );

    }


    return [
        ...defaultNexusNotifications
    ];

}


/* =====================================================
   SAVE
===================================================== */

function saveNexusNotifications(
    notifications
) {

    localStorage.setItem(
        NEXUS_NOTIFICATION_KEY,
        JSON.stringify(
            notifications
        )
    );

}


/* =====================================================
   ADD NOTIFICATION
===================================================== */

function addNexusNotification({

    title,

    message,

    type = "system",

    important = false,

    icon = "N"

}) {

    const notifications =
        getNexusNotifications();


    const notification = {

        id:
            "notification-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .slice(2),

        title,

        message,

        type,

        important,

        read: false,

        timestamp: Date.now(),

        icon

    };


    notifications.unshift(
        notification
    );


    saveNexusNotifications(
        notifications
    );


    renderNexusNotifications();

}


/* =====================================================
   CURRENT FILTER
===================================================== */

let currentNotificationFilter =
    "all";


/* =====================================================
   SEARCH
===================================================== */

let notificationSearchValue =
    "";


/* =====================================================
   FILTER NOTIFICATIONS
===================================================== */

function filterNexusNotifications(
    notifications
) {

    let filtered =
        [...notifications];


    switch (
        currentNotificationFilter
    ) {

        case "unread":

            filtered =
                filtered.filter(
                    notification =>
                        !notification.read
                );

            break;


        case "important":

            filtered =
                filtered.filter(
                    notification =>
                        notification.important
                );

            break;


        case "academic":

            filtered =
                filtered.filter(
                    notification =>
                        notification.type ===
                        "academic"
                );

            break;


        case "task":

            filtered =
                filtered.filter(
                    notification =>
                        notification.type ===
                        "task"
                );

            break;


        case "calendar":

            filtered =
                filtered.filter(
                    notification =>
                        notification.type ===
                        "calendar"
                );

            break;

    }


    if (
        notificationSearchValue
    ) {

        const search =
            notificationSearchValue
                .toLowerCase();


        filtered =
            filtered.filter(
                notification => {

                    return (

                        notification.title
                            .toLowerCase()
                            .includes(search)

                        ||

                        notification.message
                            .toLowerCase()
                            .includes(search)

                    );

                }
            );

    }


    return filtered;

}


/* =====================================================
   RENDER
===================================================== */

function renderNexusNotifications() {

    const list =
        document.getElementById(
            "notificationList"
        );


    const empty =
        document.getElementById(
            "notificationEmpty"
        );


    if (!list) {

        return;

    }


    const notifications =
        getNexusNotifications();


    const filtered =
        filterNexusNotifications(
            notifications
        );


    list.innerHTML = "";


    filtered.forEach(
        notification => {

            list.appendChild(
                createNotificationElement(
                    notification
                )
            );

        }
    );


    if (empty) {

        empty.hidden =
            filtered.length !== 0;

    }


    updateNotificationStats(
        notifications
    );

}


/* =====================================================
   CREATE NOTIFICATION
===================================================== */

function createNotificationElement(
    notification
) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        `notification-item ${notification.type} ${
            notification.read
                ? ""
                : "unread"
        }`;


    article.dataset.id =
        notification.id;


    const unreadDot =
        notification.read
            ? ""
            : `
                <span
                    class="notification-unread-dot"
                ></span>
            `;


    const importantBadge =
        notification.important
            ? `
                <span
                    class="notification-badge important"
                >
                    Important
                </span>
            `
            : "";


    article.innerHTML = `

        <div class="notification-icon">

            ${escapeNotificationHTML(
                notification.icon || "N"
            )}

        </div>


        <div class="notification-content">

            <div class="notification-title-row">

                <strong
                    class="notification-title"
                >
                    ${escapeNotificationHTML(
                        notification.title
                    )}
                </strong>

                ${importantBadge}

            </div>


            <p class="notification-message">

                ${escapeNotificationHTML(
                    notification.message
                )}

            </p>


            <p class="notification-time">

                ${formatNotificationTime(
                    notification.timestamp
                )}

            </p>

        </div>


        <div class="notification-actions">

            ${unreadDot}

            <button
                class="notification-action"
                data-action="read"
                title="${
                    notification.read
                        ? "Mark unread"
                        : "Mark as read"
                }"
            >
                ${
                    notification.read
                        ? "○"
                        : "✓"
                }
            </button>


            <button
                class="notification-action"
                data-action="delete"
                title="Delete notification"
            >
                ×
            </button>

        </div>

    `;


    article
        .querySelectorAll(
            ".notification-action"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function() {

                        const action =
                            this.dataset.action;


                        if (
                            action === "read"
                        ) {

                            toggleNotificationRead(
                                notification.id
                            );

                        }


                        if (
                            action === "delete"
                        ) {

                            deleteNexusNotification(
                                notification.id
                            );

                        }

                    }
                );

            }
        );


    return article;

}


/* =====================================================
   TOGGLE READ
===================================================== */

function toggleNotificationRead(
    id
) {

    const notifications =
        getNexusNotifications();


    const notification =
        notifications.find(
            item =>
                item.id === id
        );


    if (!notification) {

        return;

    }


    notification.read =
        !notification.read;


    saveNexusNotifications(
        notifications
    );


    renderNexusNotifications();

}


/* =====================================================
   MARK ALL READ
===================================================== */

function markAllNexusNotificationsRead() {

    const notifications =
        getNexusNotifications();


    notifications.forEach(
        notification => {

            notification.read =
                true;

        }
    );


    saveNexusNotifications(
        notifications
    );


    renderNexusNotifications();

}


/* =====================================================
   DELETE
===================================================== */

function deleteNexusNotification(
    id
) {

    const notifications =
        getNexusNotifications();


    const updated =
        notifications.filter(
            notification =>
                notification.id !== id
        );


    saveNexusNotifications(
        updated
    );


    renderNexusNotifications();

}


/* =====================================================
   CLEAR ALL
===================================================== */

function clearAllNexusNotifications() {

    const confirmed =
        confirm(
            "Clear every notification from Nexus Workspace?"
        );


    if (!confirmed) {

        return;

    }


    saveNexusNotifications(
        []
    );


    renderNexusNotifications();

}


/* =====================================================
   STATISTICS
===================================================== */

function updateNotificationStats(
    notifications
) {

    const unread =
        notifications.filter(
            notification =>
                !notification.read
        ).length;


    const important =
        notifications.filter(
            notification =>
                notification.important
        ).length;


    const todayStart =
        new Date();


    todayStart.setHours(
        0,
        0,
        0,
        0
    );


    const today =
        notifications.filter(
            notification =>
                notification.timestamp >=
                todayStart.getTime()
        ).length;


    setNotificationText(
        "unreadNotificationCount",
        unread
    );


    setNotificationText(
        "todayNotificationCount",
        today
    );


    setNotificationText(
        "importantNotificationCount",
        important
    );


    setNotificationText(
        "totalNotificationCount",
        notifications.length
    );

}


/* =====================================================
   TEXT
===================================================== */

function setNotificationText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;

    }

}


/* =====================================================
   TIME FORMAT
===================================================== */

function formatNotificationTime(
    timestamp
) {

    const difference =
        Date.now() -
        timestamp;


    const minute =
        60 * 1000;


    const hour =
        60 * minute;


    const day =
        24 * hour;


    if (
        difference < minute
    ) {

        return "Just now";

    }


    if (
        difference < hour
    ) {

        return (
            Math.floor(
                difference / minute
            ) +
            " min ago"
        );

    }


    if (
        difference < day
    ) {

        return (
            Math.floor(
                difference / hour
            ) +
            " hr ago"
        );

    }


    if (
        difference < 7 * day
    ) {

        return (
            Math.floor(
                difference / day
            ) +
            " days ago"
        );

    }


    return new Date(
        timestamp
    ).toLocaleDateString();

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeNotificationHTML(
    value
) {

    return String(
        value
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
   FILTER BUTTONS
===================================================== */

document
    .querySelectorAll(
        ".notification-filter"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                function() {

                    currentNotificationFilter =
                        this.dataset
                            .notificationFilter;


                    document
                        .querySelectorAll(
                            ".notification-filter"
                        )
                        .forEach(
                            item =>
                                item.classList
                                    .remove(
                                        "active"
                                    )
                        );


                    this.classList.add(
                        "active"
                    );


                    renderNexusNotifications();

                }
            );

        }
    );


/* =====================================================
   SEARCH
===================================================== */

document
    .getElementById(
        "notificationSearch"
    )
    ?.addEventListener(
        "input",
        function() {

            notificationSearchValue =
                this.value.trim();


            renderNexusNotifications();

        }
    );


/* =====================================================
   HEADER BUTTONS
===================================================== */

document
    .getElementById(
        "markAllReadButton"
    )
    ?.addEventListener(
        "click",
        markAllNexusNotificationsRead
    );


document
    .getElementById(
        "clearNotificationsButton"
    )
    ?.addEventListener(
        "click",
        clearAllNexusNotifications
    );


/* =====================================================
   INITIALIZE
===================================================== */

renderNexusNotifications();


/* =====================================================
   GLOBAL ACCESS
===================================================== */

window.NexusNotifications = {

    add:
        addNexusNotification,

    get:
        getNexusNotifications,

    render:
        renderNexusNotifications

};
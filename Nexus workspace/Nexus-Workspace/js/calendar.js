/* =====================================================
   NEXUS WORKSPACE
   CALENDAR & SCHEDULE
===================================================== */


/* =====================================================
   STORAGE
===================================================== */

let nexusCalendarEvents =
    JSON.parse(
        localStorage.getItem(
            "nexusCalendarEvents"
        )
    ) || [];


/* =====================================================
   CALENDAR STATE
===================================================== */

let calendarDate =
    new Date();


/* =====================================================
   ELEMENTS
===================================================== */

const calendarGrid =
    document.getElementById(
        "calendarGrid"
    );

const calendarMonthTitle =
    document.getElementById(
        "calendarMonthTitle"
    );

const calendarFilter =
    document.getElementById(
        "calendarFilter"
    );

const upcomingEvents =
    document.getElementById(
        "upcomingEvents"
    );


/* =====================================================
   SAVE
===================================================== */

function saveCalendarEvents() {

    localStorage.setItem(
        "nexusCalendarEvents",
        JSON.stringify(
            nexusCalendarEvents
        )
    );

}


/* =====================================================
   DATE HELPERS
===================================================== */

function dateKey(
    date
) {

    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return `${year}-${month}-${day}`;

}


function formatLongDate(
    date
) {

    return date.toLocaleDateString(
        undefined,
        {
            weekday: "short",
            day: "numeric",
            month: "short"
        }
    );

}


/* =====================================================
   RENDER CALENDAR
===================================================== */

function renderCalendar() {

    if (!calendarGrid) {

        return;

    }


    const year =
        calendarDate.getFullYear();


    const month =
        calendarDate.getMonth();


    calendarMonthTitle.textContent =
        calendarDate.toLocaleDateString(
            undefined,
            {
                month: "long",
                year: "numeric"
            }
        );


    calendarGrid.innerHTML =
        "";


    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    const daysInPreviousMonth =
        new Date(
            year,
            month,
            0
        ).getDate();


    const today =
        new Date();


    const totalCells =
        42;


    for (
        let i = 0;
        i < totalCells;
        i++
    ) {

        let dayNumber;

        let cellDate;

        let otherMonth =
            false;


        if (
            i < firstDay
        ) {

            dayNumber =
                daysInPreviousMonth -
                firstDay +
                i +
                1;


            cellDate =
                new Date(
                    year,
                    month - 1,
                    dayNumber
                );


            otherMonth =
                true;

        }


        else if (
            i >=
            firstDay +
            daysInMonth
        ) {

            dayNumber =
                i -
                firstDay -
                daysInMonth +
                1;


            cellDate =
                new Date(
                    year,
                    month + 1,
                    dayNumber
                );


            otherMonth =
                true;

        }


        else {

            dayNumber =
                i -
                firstDay +
                1;


            cellDate =
                new Date(
                    year,
                    month,
                    dayNumber
                );

        }


        const cell =
            document.createElement(
                "div"
            );


        cell.className =
            "calendar-day";


        if (
            otherMonth
        ) {

            cell.classList.add(
                "other-month"
            );

        }


        if (
            dateKey(
                cellDate
            ) ===
            dateKey(
                today
            )
        ) {

            cell.classList.add(
                "today"
            );

        }


        cell.innerHTML = `

            <div class="calendar-day-number">

                ${dayNumber}

            </div>

        `;


        const events =
            getEventsForDate(
                cellDate
            );


        events.forEach(
            event => {

                const eventElement =
                    document.createElement(
                        "div"
                    );


                eventElement.className =
                    `calendar-event ${event.category}`;


                eventElement.textContent =
                    event.time
                        ? `${event.time} ${event.name}`
                        : event.name;


                eventElement.title =
                    event.name;


                eventElement.addEventListener(
                    "click",
                    function(e) {

                        e.stopPropagation();

                        showEventDetails(
                            event.id
                        );

                    }
                );


                cell.appendChild(
                    eventElement
                );

            }
        );


        cell.addEventListener(
            "click",
            function() {

                openAddEventForDate(
                    cellDate
                );

            }
        );


        calendarGrid.appendChild(
            cell
        );

    }


    renderUpcomingEvents();

    updateCalendarStatistics();

}


/* =====================================================
   GET EVENTS
===================================================== */

function getEventsForDate(
    date
) {

    const key =
        dateKey(
            date
        );


    let events =
        nexusCalendarEvents.filter(
            event =>
                event.date ===
                key
        );


    const filter =
        calendarFilter
            ?.value ||
        "all";


    if (
        filter !==
        "all"
    ) {

        events =
            events.filter(
                event =>
                    event.category ===
                    filter
            );

    }


    return events.sort(
        (a, b) =>
            (a.time || "")
                .localeCompare(
                    b.time || ""
                )
    );

}


/* =====================================================
   ADD EVENT MODAL
===================================================== */

function openCalendarModal() {

    const modal =
        document.getElementById(
            "calendarEventModal"
        );


    modal?.classList.add(
        "active"
    );

}


function closeCalendarModal() {

    const modal =
        document.getElementById(
            "calendarEventModal"
        );


    modal?.classList.remove(
        "active"
    );

}


function openAddEventForDate(
    date
) {

    const input =
        document.getElementById(
            "calendarEventDate"
        );


    if (input) {

        input.value =
            dateKey(
                date
            );

    }


    openCalendarModal();

}


/* =====================================================
   ADD EVENT
===================================================== */

function addCalendarEvent(
    event
) {

    event.preventDefault();


    const name =
        document.getElementById(
            "calendarEventName"
        ).value.trim();


    const date =
        document.getElementById(
            "calendarEventDate"
        ).value;


    const time =
        document.getElementById(
            "calendarEventTime"
        ).value;


    const category =
        document.getElementById(
            "calendarEventCategory"
        ).value;


    const duration =
        document.getElementById(
            "calendarEventDuration"
        ).value;


    const description =
        document.getElementById(
            "calendarEventDescription"
        ).value.trim();


    if (
        !name ||
        !date
    ) {

        return;

    }


    const newEvent = {

        id:
            Date.now(),

        name,

        date,

        time,

        category,

        duration,

        description,

        completed:
            false,

        created:
            new Date().toISOString()

    };


    nexusCalendarEvents.push(
        newEvent
    );


    saveCalendarEvents();


    document.getElementById(
        "calendarEventForm"
    ).reset();


    closeCalendarModal();


    calendarDate =
        new Date(
            date + "T12:00:00"
        );


    renderCalendar();

}


/* =====================================================
   EVENT DETAILS
===================================================== */

function showEventDetails(
    id
) {

    const event =
        nexusCalendarEvents.find(
            item =>
                item.id === id
        );


    if (!event) {

        return;

    }


    const date =
        new Date(
            event.date +
            "T12:00:00"
        );


    const completedText =
        event.completed
            ? "Completed"
            : "Not completed";


    const action =
        confirm(
            `${event.name}\n\n` +

            `${formatLongDate(date)}\n` +

            `${event.time || "No time set"}\n` +

            `${event.category}\n\n` +

            `${event.description || "No description"}\n\n` +

            `Status: ${completedText}\n\n` +

            `OK = Toggle completion\n` +

            `Cancel = Delete event`
        );


    if (action) {

        event.completed =
            !event.completed;

        saveCalendarEvents();

        renderCalendar();

        return;

    }


    const deleteEvent =
        confirm(
            "Delete this event?"
        );


    if (deleteEvent) {

        nexusCalendarEvents =
            nexusCalendarEvents.filter(
                item =>
                    item.id !== id
            );


        saveCalendarEvents();

        renderCalendar();

    }

}


/* =====================================================
   UPCOMING EVENTS
===================================================== */

function renderUpcomingEvents() {

    if (!upcomingEvents) {

        return;

    }


    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    let upcoming =
        nexusCalendarEvents
            .filter(
                event => {

                    const eventDate =
                        new Date(
                            event.date +
                            "T23:59:59"
                        );

                    return (
                        eventDate >=
                        today
                    );

                }
            )
            .sort(
                (a, b) => {

                    const dateA =
                        new Date(
                            `${a.date}T${
                                a.time ||
                                "23:59"
                            }`
                        );

                    const dateB =
                        new Date(
                            `${b.date}T${
                                b.time ||
                                "23:59"
                            }`
                        );

                    return dateA - dateB;

                }
            )
            .slice(
                0,
                7
            );


    upcomingEvents.innerHTML =
        "";


    if (
        upcoming.length ===
        0
    ) {

        upcomingEvents.innerHTML = `

            <div class="upcoming-empty">

                No upcoming events.

            </div>

        `;

        return;

    }


    upcoming.forEach(
        event => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "upcoming-event";


            const date =
                new Date(
                    event.date +
                    "T12:00:00"
                );


            item.innerHTML = `

                <span class="upcoming-event-date">

                    ${
                        formatLongDate(
                            date
                        )
                    }

                    ${
                        event.time
                            ? " • " +
                              event.time
                            : ""
                    }

                </span>


                <span class="upcoming-event-name">

                    ${
                        escapeCalendarHTML(
                            event.name
                        )
                    }

                </span>


                <span class="upcoming-event-category">

                    ${
                        event.category
                    }

                    ${
                        event.completed
                            ? " • Completed"
                            : ""
                    }

                </span>

            `;


            item.addEventListener(
                "click",
                function() {

                    showEventDetails(
                        event.id
                    );

                }
            );


            upcomingEvents.appendChild(
                item
            );

        }
    );

}


/* =====================================================
   STATISTICS
===================================================== */

function updateCalendarStatistics() {

    const todayKey =
        dateKey(
            new Date()
        );


    const todayEvents =
        nexusCalendarEvents.filter(
            event =>
                event.date ===
                todayKey
        ).length;


    const now =
        new Date();


    const startOfWeek =
        new Date(now);


    startOfWeek.setDate(
        now.getDate() -
        now.getDay()
    );


    startOfWeek.setHours(
        0,
        0,
        0,
        0
    );


    const endOfWeek =
        new Date(
            startOfWeek
        );


    endOfWeek.setDate(
        startOfWeek.getDate() +
        6
    );


    endOfWeek.setHours(
        23,
        59,
        59,
        999
    );


    const weekEvents =
        nexusCalendarEvents.filter(
            event => {

                const date =
                    new Date(
                        event.date +
                        "T12:00:00"
                    );

                return (
                    date >=
                    startOfWeek &&
                    date <=
                    endOfWeek
                );

            }
        ).length;


    const deadlines =
        nexusCalendarEvents.filter(
            event =>

                (
                    event.category ===
                    "Assignment" ||

                    event.category ===
                    "Exam"
                )

                &&

                !event.completed

        ).length;


    const completed =
        nexusCalendarEvents.filter(
            event =>
                event.completed
        ).length;


    document.getElementById(
        "calendarTodayEvents"
    ).textContent =
        todayEvents;


    document.getElementById(
        "calendarWeekEvents"
    ).textContent =
        weekEvents;


    document.getElementById(
        "calendarDeadlineEvents"
    ).textContent =
        deadlines;


    document.getElementById(
        "calendarCompletedEvents"
    ).textContent =
        completed;

}


/* =====================================================
   NAVIGATION
===================================================== */

document.getElementById(
    "previousMonth"
)?.addEventListener(
    "click",
    function() {

        calendarDate.setMonth(
            calendarDate.getMonth() -
            1
        );

        renderCalendar();

    }
);


document.getElementById(
    "nextMonth"
)?.addEventListener(
    "click",
    function() {

        calendarDate.setMonth(
            calendarDate.getMonth() +
            1
        );

        renderCalendar();

    }
);


document.getElementById(
    "calendarToday"
)?.addEventListener(
    "click",
    function() {

        calendarDate =
            new Date();

        renderCalendar();

    }
);


/* =====================================================
   MODAL EVENTS
===================================================== */

document.getElementById(
    "addCalendarEvent"
)?.addEventListener(
    "click",
    function() {

        openAddEventForDate(
            new Date()
        );

    }
);


document.getElementById(
    "closeCalendarModal"
)?.addEventListener(
    "click",
    closeCalendarModal
);


document.getElementById(
    "calendarEventForm"
)?.addEventListener(
    "submit",
    addCalendarEvent
);


document.getElementById(
    "calendarEventModal"
)?.addEventListener(
    "click",
    function(event) {

        if (
            event.target ===
            this
        ) {

            closeCalendarModal();

        }

    }
);


calendarFilter?.addEventListener(
    "change",
    renderCalendar
);


/* =====================================================
   HTML SAFETY
===================================================== */

function escapeCalendarHTML(
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
   INITIALIZE
===================================================== */

renderCalendar();
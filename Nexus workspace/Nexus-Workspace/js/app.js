/* =====================================================
   NEXUS WORKSPACE
   APPLICATION JAVASCRIPT
===================================================== */


/* =====================================================
   CLOCK
===================================================== */

function updateClock() {

    const now = new Date();


    const time = now.toLocaleTimeString(
        undefined,
        {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        }
    );


    const date = now.toLocaleDateString(
        undefined,
        {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        }
    );


    document.getElementById(
        "clock"
    ).textContent = time;


    document.getElementById(
        "currentDate"
    ).textContent = date;


    const hour = now.getHours();


    let greeting;


    if (hour < 12) {

        greeting = "Good morning";

    }

    else if (hour < 18) {

        greeting = "Good afternoon";

    }

    else {

        greeting = "Good evening";

    }


    document.getElementById(
        "welcomeMessage"
    ).textContent =
        `${greeting}, Mr Damien.`;

}


updateClock();


setInterval(
    updateClock,
    1000
);


/* =====================================================
   PAGE NAVIGATION
===================================================== */

const navigationItems =
    document.querySelectorAll(
        ".nav-item"
    );


const pageSections =
    document.querySelectorAll(
        ".page-section"
    );


navigationItems.forEach(
    function(item) {

        item.addEventListener(
            "click",
            function() {

                const target =
                    item.dataset.section;


                /*
                    Remove active state
                    from navigation.
                */

                navigationItems.forEach(
                    function(nav) {

                        nav.classList.remove(
                            "active"
                        );

                    }
                );


                /*
                    Activate selected
                    navigation item.
                */

                item.classList.add(
                    "active"
                );


                /*
                    Hide all sections.
                */

                pageSections.forEach(
                    function(section) {

                        section.classList.remove(
                            "active-section"
                        );

                    }
                );


                /*
                    Show requested section.
                */

                const targetSection =
                    document.getElementById(
                        target
                    );


                if (targetSection) {

                    targetSection.classList.add(
                        "active-section"
                    );

                }

            }
        );

    }
);


/* =====================================================
   MOBILE MENU
===================================================== */

const mobileMenuButton =
    document.getElementById(
        "mobileMenuButton"
    );


const sidebar =
    document.querySelector(
        ".sidebar"
    );


mobileMenuButton.addEventListener(
    "click",
    function() {

        sidebar.classList.toggle(
            "mobile-open"
        );

    }
);


/* =====================================================
   NOTIFICATIONS
===================================================== */

const notificationButton =
    document.getElementById(
        "notificationButton"
    );


notificationButton.addEventListener(
    "click",
    function() {

        alert(
            "You're all caught up, Mr Damien."
        );

    }
);


/* =====================================================
   FOCUS BUTTON
===================================================== */

const startFocusButton =
    document.getElementById(
        "startFocusButton"
    );


startFocusButton.addEventListener(
    "click",
    function() {

        /*
            For now this sends the user
            to the Focus section.

            Later we will connect this
            to the actual Pomodoro engine.
        */

        navigationItems.forEach(
            function(item) {

                item.classList.remove(
                    "active"
                );


                if (
                    item.dataset.section ===
                    "focus"
                ) {

                    item.classList.add(
                        "active"
                    );

                }

            }
        );


        pageSections.forEach(
            function(section) {

                section.classList.remove(
                    "active-section"
                );

            }
        );


        document
            .getElementById("focus")
            .classList.add(
                "active-section"
            );

    }
);


/* =====================================================
   ADD TASK BUTTON
===================================================== */

const addTaskButton =
    document.getElementById(
        "addTaskButton"
    );


addTaskButton.addEventListener(
    "click",
    function() {

        alert(
            "The full Task Manager will be built in the next section."
        );

    }
);
/* =====================================================
   NEXUS GLOBAL PAGE NAVIGATION
===================================================== */

function navigateToPage(
    pageId
) {

    const sections =
        document.querySelectorAll(
            ".page-section"
        );


    sections.forEach(
        section => {

            section.classList.remove(
                "active"
            );

        }
    );


    const target =
        document.getElementById(
            pageId
        );


    if (!target) {

        console.warn(
            `Nexus page "${pageId}" was not found.`
        );

        return;

    }


    target.classList.add(
        "active"
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* Make available to other systems */

window.navigateToPage =
    navigateToPage;
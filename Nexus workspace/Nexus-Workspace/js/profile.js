/* =====================================================
   NEXUS WORKSPACE
   PROFILE SYSTEM
===================================================== */

const nexusProfile = {

    name: "Mr Damien",

    field: "Computer Engineering",

    level: "Undergraduate",

    session: "2025 / 2026",

    university: "University Student",

    about:
        "Nexus Workspace is Mr Damien's personal command center for university life, engineering studies, productivity and personal development."

};


/* =====================================================
   STORAGE
===================================================== */

function loadProfile() {

    const saved =
        localStorage.getItem(
            "nexusProfile"
        );

    if (!saved) {

        return nexusProfile;

    }

    try {

        return {
            ...nexusProfile,
            ...JSON.parse(saved)
        };

    } catch {

        return nexusProfile;

    }

}


/* =====================================================
   SAVE PROFILE
===================================================== */

function saveProfile(profile) {

    localStorage.setItem(
        "nexusProfile",
        JSON.stringify(profile)
    );

}


/* =====================================================
   RENDER PROFILE
===================================================== */

function renderProfile() {

    const profile =
        loadProfile();


    const name =
        document.getElementById(
            "profileName"
        );

    const course =
        document.getElementById(
            "profileCourse"
        );

    const university =
        document.getElementById(
            "profileUniversity"
        );

    const avatar =
        document.getElementById(
            "profileAvatar"
        );


    if (name)
        name.textContent =
            profile.name;


    if (course)
        course.textContent =
            profile.field;


    if (university)
        university.textContent =
            profile.university;


    if (avatar)
        avatar.textContent =
            getInitial(
                profile.name
            );


    setText(
        "infoName",
        profile.name
    );

    setText(
        "infoField",
        profile.field
    );

    setText(
        "infoLevel",
        profile.level
    );

    setText(
        "infoSession",
        profile.session
    );

    setText(
        "profileAboutText",
        profile.about
    );

}


/* =====================================================
   TEXT HELPER
===================================================== */

function setText(
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
   INITIAL
===================================================== */

function getInitial(
    name
) {

    const cleanName =
        name
            .replace(
                /^Mr\s+/i,
                ""
            )
            .trim();


    return cleanName
        ? cleanName
            .charAt(0)
            .toUpperCase()
        : "D";

}


/* =====================================================
   EDIT PROFILE
===================================================== */

document
    .getElementById(
        "editProfileButton"
    )
    ?.addEventListener(
        "click",
        function() {

            const profile =
                loadProfile();


            const name =
                prompt(
                    "Display name:",
                    profile.name
                );


            if (
                name === null
            ) {

                return;

            }


            const field =
                prompt(
                    "Course / field:",
                    profile.field
                );


            const level =
                prompt(
                    "Academic level:",
                    profile.level
                );


            const session =
                prompt(
                    "Academic session:",
                    profile.session
                );


            const university =
                prompt(
                    "University:",
                    profile.university
                );


            const about =
                prompt(
                    "About yourself:",
                    profile.about
                );


            profile.name =
                name.trim() ||
                "Mr Damien";


            profile.field =
                field?.trim() ||
                profile.field;


            profile.level =
                level?.trim() ||
                profile.level;


            profile.session =
                session?.trim() ||
                profile.session;


            profile.university =
                university?.trim() ||
                profile.university;


            profile.about =
                about?.trim() ||
                profile.about;


            saveProfile(
                profile
            );


            renderProfile();

        }
    );


/* =====================================================
   PROFILE STATISTICS
===================================================== */

function updateProfileStatistics() {

    const tasks =
        getLocalArray(
            "nexusTasks"
        );


    const resources =
        getLocalArray(
            "nexusResources"
        );


    const projects =
        getLocalArray(
            "nexusProjects"
        );


    const sessions =
        getLocalArray(
            "nexusFocusSessions"
        );


    const completedTasks =
        tasks.filter(
            task =>
                task.completed
        ).length;


    let studyMinutes = 0;


    sessions.forEach(
        session => {

            studyMinutes +=
                Number(
                    session.duration ||
                    session.minutes ||
                    0
                );

        }
    );


    setText(
        "profileStudyHours",
        formatProfileHours(
            studyMinutes / 60
        )
    );


    setText(
        "profileTasksCompleted",
        completedTasks
    );


    setText(
        "profileResources",
        resources.length
    );


    setText(
        "profileProjects",
        projects.length
    );

}


/* =====================================================
   LOCAL STORAGE ARRAY
===================================================== */

function getLocalArray(
    key
) {

    try {

        return JSON.parse(
            localStorage.getItem(
                key
            )
        ) || [];

    } catch {

        return [];

    }

}


/* =====================================================
   FORMAT HOURS
===================================================== */

function formatProfileHours(
    hours
) {

    if (
        hours < 1
    ) {

        return `${Math.round(
            hours * 60
        )}m`;

    }


    return `${hours.toFixed(1)}h`;

}


/* =====================================================
   INITIALIZE
===================================================== */

renderProfile();

updateProfileStatistics();


/* =====================================================
   CROSS-TAB REFRESH
===================================================== */

window.addEventListener(
    "storage",
    function() {

        renderProfile();

        updateProfileStatistics();

    }
);
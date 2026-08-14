/* =====================================================
   NEXUS WORKSPACE
   ANALYTICS ENGINE
===================================================== */


/* =====================================================
   DATA
===================================================== */

const analyticsData = {

    goals: {

        studyHours: 10,

        tasks: 10,

        resources: 5

    },

    period: "week"

};


/* =====================================================
   HELPERS
===================================================== */

function getStorageData(
    key,
    fallback
) {

    try {

        return JSON.parse(
            localStorage.getItem(key)
        ) || fallback;

    } catch {

        return fallback;

    }

}


/* =====================================================
   CALCULATE TASKS
===================================================== */

function getTaskStatistics() {

    const tasks =
        getStorageData(
            "nexusTasks",
            []
        );


    const completed =
        tasks.filter(
            task =>
                task.completed
        );


    return {

        total:
            tasks.length,

        completed:
            completed.length,

        percentage:
            tasks.length
                ? Math.round(
                    (
                        completed.length /
                        tasks.length
                    ) * 100
                )
                : 0

    };

}


/* =====================================================
   CALCULATE RESOURCES
===================================================== */

function getResourceStatistics() {

    const resources =
        getStorageData(
            "nexusResources",
            []
        );


    return {

        total:
            resources.length,

        documents:
            resources.filter(
                resource =>
                    resource.kind ===
                    "PDF"
            ).length

    };

}


/* =====================================================
   CALCULATE CALENDAR
===================================================== */

function getCalendarStatistics() {

    const events =
        getStorageData(
            "nexusCalendarEvents",
            []
        );


    return {

        total:
            events.length,

        completed:
            events.filter(
                event =>
                    event.completed
            ).length

    };

}


/* =====================================================
   FOCUS DATA
===================================================== */

function getFocusStatistics() {

    const sessions =
        getStorageData(
            "nexusFocusSessions",
            []
        );


    let totalMinutes = 0;


    sessions.forEach(
        session => {

            totalMinutes +=
                Number(
                    session.duration ||
                    session.minutes ||
                    0
                );

        }
    );


    return {

        minutes:
            totalMinutes,

        hours:
            totalMinutes / 60

    };

}


/* =====================================================
   PRODUCTIVITY
===================================================== */

function calculateProductivity() {

    const tasks =
        getTaskStatistics();


    const resources =
        getResourceStatistics();


    const calendar =
        getCalendarStatistics();


    const focus =
        getFocusStatistics();


    let score = 0;


    if (
        tasks.total > 0
    ) {

        score +=
            tasks.percentage *
            0.40;

    }


    const studyScore =
        Math.min(
            focus.hours /
            analyticsData.goals.studyHours,
            1
        ) * 100;


    score +=
        studyScore *
        0.30;


    const resourceScore =
        Math.min(
            resources.total /
            analyticsData.goals.resources,
            1
        ) * 100;


    score +=
        resourceScore *
        0.15;


    const organizationScore =
        Math.min(
            calendar.total /
            5,
            1
        ) * 100;


    score +=
        organizationScore *
        0.15;


    return Math.round(
        score
    );

}


/* =====================================================
   UPDATE OVERVIEW
===================================================== */

function updateAnalyticsOverview() {

    const productivity =
        calculateProductivity();


    const tasks =
        getTaskStatistics();


    const resources =
        getResourceStatistics();


    const focus =
        getFocusStatistics();


    document.getElementById(
        "analyticsProductivity"
    ).textContent =
        `${productivity}%`;


    document.getElementById(
        "analyticsProductivityBar"
    ).style.width =
        `${productivity}%`;


    document.getElementById(
        "analyticsStudyTime"
    ).textContent =
        formatHours(
            focus.hours
        );


    document.getElementById(
        "analyticsTasks"
    ).textContent =
        tasks.completed;


    document.getElementById(
        "analyticsResources"
    ).textContent =
        resources.total;

}


/* =====================================================
   BREAKDOWN
===================================================== */

function updateBreakdown() {

    const tasks =
        getTaskStatistics();


    const focus =
        getFocusStatistics();


    const resources =
        getResourceStatistics();


    const calendar =
        getCalendarStatistics();


    const academic =
        tasks.percentage;


    const study =
        Math.min(
            focus.hours /
            analyticsData.goals.studyHours,
            1
        ) * 100;


    const organization =
        Math.min(
            calendar.total /
            5,
            1
        ) * 100;


    const resourceScore =
        Math.min(
            resources.total /
            analyticsData.goals.resources,
            1
        ) * 100;


    setScore(
        "academicScore",
        "academicScoreBar",
        academic
    );


    setScore(
        "taskScore",
        "taskScoreBar",
        tasks.percentage
    );


    setScore(
        "studyScore",
        "studyScoreBar",
        study
    );


    setScore(
        "organizationScore",
        "organizationScoreBar",
        Math.round(
            (
                organization +
                resourceScore
            ) / 2
        )
    );

}


function setScore(
    textId,
    barId,
    value
) {

    const text =
        document.getElementById(
            textId
        );


    const bar =
        document.getElementById(
            barId
        );


    if (text) {

        text.textContent =
            `${Math.round(value)}%`;

    }


    if (bar) {

        bar.style.width =
            `${Math.min(value, 100)}%`;

    }

}


/* =====================================================
   ACTIVITY CHART
===================================================== */

function renderActivityChart() {

    const chart =
        document.getElementById(
            "studyActivityChart"
        );


    if (!chart) {

        return;

    }


    const focus =
        getFocusStatistics();


    chart.innerHTML =
        "";


    const values =
        generateActivityValues();


    const max =
        Math.max(
            ...values,
            1
        );


    values.forEach(
        (value, index) => {

            const column =
                document.createElement(
                    "div"
                );


            column.className =
                "activity-column";


            const percentage =
                (
                    value /
                    max
                ) * 100;


            const day =
                getActivityDay(
                    index
                );


            column.innerHTML = `

                <span class="activity-value">

                    ${
                        value.toFixed(1)
                    }h

                </span>


                <div class="activity-bar-container">

                    <div
                        class="activity-bar"
                        style="
                            height:
                            ${Math.max(
                                percentage,
                                3
                            )}%;
                        "
                    ></div>

                </div>


                <span class="activity-day">

                    ${day}

                </span>

            `;


            chart.appendChild(
                column
            );

        }
    );


    document.getElementById(
        "analyticsActivityTotal"
    ).textContent =
        formatHours(
            focus.hours
        );

}


/* =====================================================
   ACTIVITY VALUES
===================================================== */

function generateActivityValues() {

    const focus =
        getFocusStatistics();


    if (
        focus.hours === 0
    ) {

        return [
            0,
            0,
            0,
            0,
            0,
            0,
            0
        ];

    }


    const average =
        focus.hours /
        7;


    return [
        average * 0.8,
        average * 1.1,
        average * 0.6,
        average * 1.4,
        average * 0.9,
        average * 1.2,
        average
    ];

}


function getActivityDay(
    index
) {

    const days = [
        "SUN",
        "MON",
        "TUE",
        "WED",
        "THU",
        "FRI",
        "SAT"
    ];


    return days[index];

}


/* =====================================================
   SUBJECT PROGRESS
===================================================== */

function renderSubjectProgress() {

    const container =
        document.getElementById(
            "subjectProgress"
        );


    if (!container) {

        return;

    }


    const subjects = [

        {
            name:
                "Mathematics",

            value:
                getSubjectProgress(
                    "Mathematics"
                )

        },

        {
            name:
                "Physics",

            value:
                getSubjectProgress(
                    "Physics"
                )

        },

        {
            name:
                "Chemistry",

            value:
                getSubjectProgress(
                    "Chemistry"
                )

        },

        {
            name:
                "Computer Engineering",

            value:
                getSubjectProgress(
                    "Computer Engineering"
                )

        },

        {
            name:
                "Programming",

            value:
                getSubjectProgress(
                    "Programming"
                )

        }

    ];


    container.innerHTML =
        "";


    subjects.forEach(
        subject => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "subject-row";


            row.innerHTML = `

                <span
                    class="subject-row-name"
                >

                    ${
                        subject.name
                    }

                </span>


                <div
                    class="subject-row-bar"
                >

                    <div
                        style="
                            width:
                            ${subject.value}%;
                        "
                    ></div>

                </div>


                <span
                    class="subject-row-value"
                >

                    ${
                        subject.value
                    }%

                </span>

            `;


            container.appendChild(
                row
            );

        }
    );

}


function getSubjectProgress(
    subject
) {

    const resources =
        getStorageData(
            "nexusResources",
            []
        );


    const subjectResources =
        resources.filter(
            resource =>
                resource.subject ===
                subject
        ).length;


    return Math.min(
        subjectResources * 20,
        100
    );

}


/* =====================================================
   ACHIEVEMENTS
===================================================== */

function renderAchievements() {

    const container =
        document.getElementById(
            "analyticsAchievements"
        );


    if (!container) {

        return;

    }


    const tasks =
        getTaskStatistics();


    const resources =
        getResourceStatistics();


    const focus =
        getFocusStatistics();


    const achievements = [];


    if (
        tasks.completed >= 1
    ) {

        achievements.push({

            icon: "✓",

            title:
                "First Task",

            description:
                "Completed your first task."

        });

    }


    if (
        tasks.completed >= 10
    ) {

        achievements.push({

            icon: "◆",

            title:
                "Task Master",

            description:
                "Completed 10 tasks."

        });

    }


    if (
        resources.total >= 5
    ) {

        achievements.push({

            icon: "◇",

            title:
                "Knowledge Builder",

            description:
                "Added 5 study resources."

        });

    }


    if (
        focus.hours >= 5
    ) {

        achievements.push({

            icon: "◷",

            title:
                "Deep Focus",

            description:
                "Reached 5 hours of focus."

        });

    }


    if (
        achievements.length === 0
    ) {

        achievements.push({

            icon: "☆",

            title:
                "Your journey starts here",

            description:
                "Complete activities to unlock achievements."

        });

    }


    container.innerHTML =
        "";


    achievements.forEach(
        achievement => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "achievement";


            item.innerHTML = `

                <div class="achievement-icon">

                    ${
                        achievement.icon
                    }

                </div>


                <div>

                    <strong>
                        ${
                            achievement.title
                        }
                    </strong>

                    <span>
                        ${
                            achievement.description
                        }
                    </span>

                </div>

            `;


            container.appendChild(
                item
            );

        }
    );

}


/* =====================================================
   WEEKLY GOALS
===================================================== */

function updateWeeklyGoals() {

    const focus =
        getFocusStatistics();


    const tasks =
        getTaskStatistics();


    const resources =
        getResourceStatistics();


    updateGoal(
        "goalStudyCurrent",
        "goalStudyTarget",
        "goalStudyBar",
        focus.hours,
        analyticsData.goals.studyHours
    );


    updateGoal(
        "goalTaskCurrent",
        "goalTaskTarget",
        "goalTaskBar",
        tasks.completed,
        analyticsData.goals.tasks
    );


    updateGoal(
        "goalResourceCurrent",
        "goalResourceTarget",
        "goalResourceBar",
        resources.total,
        analyticsData.goals.resources
    );

}


function updateGoal(
    currentId,
    targetId,
    barId,
    current,
    target
) {

    document.getElementById(
        currentId
    ).textContent =
        Number.isInteger(current)
            ? current
            : current.toFixed(1);


    document.getElementById(
        targetId
    ).textContent =
        target;


    const percentage =
        Math.min(
            (
                current /
                target
            ) * 100,
            100
        );


    document.getElementById(
        barId
    ).style.width =
        `${percentage}%`;

}


/* =====================================================
   FORMAT HOURS
===================================================== */

function formatHours(
    hours
) {

    if (
        hours < 1
    ) {

        return `${Math.round(hours * 60)}m`;

    }


    return `${hours.toFixed(1)}h`;

}


/* =====================================================
   REFRESH
===================================================== */

function refreshAnalytics() {

    updateAnalyticsOverview();

    updateBreakdown();

    renderActivityChart();

    renderSubjectProgress();

    renderAchievements();

    updateWeeklyGoals();

}


/* =====================================================
   PERIOD BUTTONS
===================================================== */

document
    .querySelectorAll(
        ".analytics-period-button"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                function() {

                    document
                        .querySelectorAll(
                            ".analytics-period-button"
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


                    analyticsData.period =
                        this.dataset.period;


                    refreshAnalytics();

                }
            );

        }
    );


/* =====================================================
   EDIT GOALS
===================================================== */

document.getElementById(
    "editWeeklyGoal"
)?.addEventListener(
    "click",
    function() {

        const study =
            prompt(
                "Weekly study target in hours:",
                analyticsData.goals.studyHours
            );


        const tasks =
            prompt(
                "Weekly task target:",
                analyticsData.goals.tasks
            );


        const resources =
            prompt(
                "Weekly resource target:",
                analyticsData.goals.resources
            );


        if (study !== null) {

            analyticsData.goals.studyHours =
                Math.max(
                    Number(study) || 1,
                    1
                );

        }


        if (tasks !== null) {

            analyticsData.goals.tasks =
                Math.max(
                    Number(tasks) || 1,
                    1
                );

        }


        if (resources !== null) {

            analyticsData.goals.resources =
                Math.max(
                    Number(resources) || 1,
                    1
                );

        }


        refreshAnalytics();

    }
);


/* =====================================================
   INITIALIZE
===================================================== */

refreshAnalytics();


/*
   Refresh when returning to the page.
*/

window.addEventListener(
    "storage",
    refreshAnalytics
);
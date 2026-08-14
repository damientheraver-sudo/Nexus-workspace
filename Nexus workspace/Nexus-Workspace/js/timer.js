/* =====================================================
   NEXUS WORKSPACE
   FOCUS / POMODORO ENGINE
===================================================== */


/* =====================================================
   STATE
===================================================== */

let focusMinutes = 25;

let breakMinutes = 5;

let remainingSeconds =
    focusMinutes * 60;

let timerInterval = null;

let timerRunning = false;

let focusMode = "focus";

let sessionStartedAt = null;


/* =====================================================
   STORAGE
===================================================== */

let focusHistory =
    JSON.parse(
        localStorage.getItem(
            "nexusFocusHistory"
        )
    ) || [];


function saveFocusHistory() {

    localStorage.setItem(
        "nexusFocusHistory",
        JSON.stringify(
            focusHistory
        )
    );

}


/* =====================================================
   ELEMENTS
===================================================== */

const focusTimer =
    document.getElementById(
        "focusTimer"
    );


const focusTimerRing =
    document.getElementById(
        "focusTimerRing"
    );


const focusTimerStatus =
    document.getElementById(
        "focusTimerStatus"
    );


const focusModeText =
    document.getElementById(
        "focusModeText"
    );


const focusModeIndicator =
    document.getElementById(
        "focusModeIndicator"
    );


const startButton =
    document.getElementById(
        "startFocusTimer"
    );


/* =====================================================
   TIMER DISPLAY
===================================================== */

function updateTimerDisplay() {

    if (!focusTimer) {

        return;

    }


    const minutes =
        Math.floor(
            remainingSeconds / 60
        );


    const seconds =
        remainingSeconds % 60;


    focusTimer.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;


    updateTimerRing();

}


/* =====================================================
   TIMER RING
===================================================== */

function updateTimerRing() {

    const totalSeconds =
        focusMode === "focus"
            ? focusMinutes * 60
            : breakMinutes * 60;


    const elapsed =
        totalSeconds -
        remainingSeconds;


    const percentage =
        Math.min(
            elapsed /
            totalSeconds,
            1
        );


    const degrees =
        percentage * 360;


    focusTimerRing.style.background =
        `conic-gradient(
            var(--blue) 0deg,
            var(--purple) ${degrees}deg,
            rgba(255,255,255,0.05) ${degrees}deg
        )`;

}


/* =====================================================
   START / PAUSE
===================================================== */

function startTimer() {

    if (timerRunning) {

        pauseTimer();

        return;

    }


    timerRunning = true;

    sessionStartedAt =
        sessionStartedAt ||
        Date.now();


    startButton.textContent =
        "Pause";


    focusTimerStatus.textContent =
        focusMode === "focus"
            ? "Deep work in progress"
            : "Take a short break";


    timerInterval =
        setInterval(
            tickTimer,
            1000
        );

}


function pauseTimer() {

    timerRunning = false;


    clearInterval(
        timerInterval
    );


    timerInterval = null;


    startButton.textContent =
        "Resume";


    focusTimerStatus.textContent =
        "Session paused";

}


/* =====================================================
   TIMER TICK
===================================================== */

function tickTimer() {

    if (
        remainingSeconds <= 0
    ) {

        completeCurrentTimer();

        return;

    }


    remainingSeconds--;

    updateTimerDisplay();

}


/* =====================================================
   COMPLETE SESSION
===================================================== */

function completeCurrentTimer() {

    clearInterval(
        timerInterval
    );


    timerInterval = null;

    timerRunning = false;


    if (
        focusMode === "focus"
    ) {

        recordFocusSession();


        focusMode =
            "break";


        remainingSeconds =
            breakMinutes * 60;


        focusModeText.textContent =
            "BREAK TIME";


        focusModeIndicator
            .classList
            .add(
                "break"
            );


        focusTimerStatus.textContent =
            "Focus session complete. Take a break.";


        startButton.textContent =
            "Start Break";

    }

    else {

        focusMode =
            "focus";


        remainingSeconds =
            focusMinutes * 60;


        focusModeText.textContent =
            "FOCUS SESSION";


        focusModeIndicator
            .classList
            .remove(
                "break"
            );


        focusTimerStatus.textContent =
            "Break complete. Ready for another session.";


        startButton.textContent =
            "Start Focus";

    }


    sessionStartedAt = null;


    updateTimerDisplay();

    updateFocusStatistics();

}


/* =====================================================
   RECORD SESSION
===================================================== */

function recordFocusSession() {

    const session = {

        id:
            Date.now(),

        duration:
            focusMinutes,

        date:
            new Date()
                .toISOString(),

        type:
            "Focus"

    };


    focusHistory.unshift(
        session
    );


    /*
        Keep the last 50 sessions.
    */

    focusHistory =
        focusHistory.slice(
            0,
            50
        );


    saveFocusHistory();

    renderFocusHistory();

    updateFocusStatistics();

}


/* =====================================================
   RESET
===================================================== */

function resetTimer() {

    clearInterval(
        timerInterval
    );


    timerInterval = null;

    timerRunning = false;

    focusMode = "focus";

    remainingSeconds =
        focusMinutes * 60;

    sessionStartedAt = null;


    focusModeText.textContent =
        "FOCUS SESSION";


    focusModeIndicator
        .classList
        .remove(
            "break"
        );


    focusTimerStatus.textContent =
        "Ready to focus";


    startButton.textContent =
        "Start Focus";


    updateTimerDisplay();

}


/* =====================================================
   SKIP
===================================================== */

function skipTimer() {

    clearInterval(
        timerInterval
    );


    timerInterval = null;

    timerRunning = false;


    if (
        focusMode === "focus"
    ) {

        focusMode = "break";

        remainingSeconds =
            breakMinutes * 60;


        focusModeText.textContent =
            "BREAK TIME";


        focusModeIndicator
            .classList
            .add(
                "break"
            );


        startButton.textContent =
            "Start Break";

    }

    else {

        focusMode = "focus";

        remainingSeconds =
            focusMinutes * 60;


        focusModeText.textContent =
            "FOCUS SESSION";


        focusModeIndicator
            .classList
            .remove(
                "break"
            );


        startButton.textContent =
            "Start Focus";

    }


    focusTimerStatus.textContent =
        "Ready";


    updateTimerDisplay();

}


/* =====================================================
   PRESETS
===================================================== */

document.querySelectorAll(
    ".focus-preset"
).forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                document
                    .querySelectorAll(
                        ".focus-preset"
                    )
                    .forEach(
                        preset =>
                            preset.classList
                                .remove(
                                    "active"
                                )
                    );


                button.classList.add(
                    "active"
                );


                focusMinutes =
                    Number(
                        button.dataset.focus
                    );


                breakMinutes =
                    Number(
                        button.dataset.break
                    );


                resetTimer();

            }
        );

    }
);


/* =====================================================
   CONTROLS
===================================================== */

startButton?.addEventListener(
    "click",
    startTimer
);


document.getElementById(
    "resetFocusButton"
)?.addEventListener(
    "click",
    resetTimer
);


document.getElementById(
    "skipFocusButton"
)?.addEventListener(
    "click",
    skipTimer
);


/* =====================================================
   FULLSCREEN MODE
===================================================== */

document.getElementById(
    "focusFullscreenButton"
)?.addEventListener(
    "click",
    function() {

        document.body.classList.toggle(
            "focus-mode-active"
        );


        this.textContent =
            document.body.classList.contains(
                "focus-mode-active"
            )
                ? "✕ Exit Focus"
                : "⛶ Focus Mode";

    }
);


/* =====================================================
   STATISTICS
===================================================== */

function updateFocusStatistics() {

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    const todaySessions =
        focusHistory.filter(
            session =>
                session.date
                    .startsWith(
                        today
                    )
        );


    const totalMinutes =
        todaySessions.reduce(
            (total, session) =>
                total +
                session.duration,
            0
        );


    const completed =
        todaySessions.length;


    document.getElementById(
        "todayFocusTime"
    ).textContent =
        formatMinutes(
            totalMinutes
        );


    document.getElementById(
        "todayFocusSessions"
    ).textContent =
        todaySessions.length;


    document.getElementById(
        "todayCompletedSessions"
    ).textContent =
        completed;


    updateFocusGoal(
        totalMinutes
    );


    updateFocusStreak();

}


/* =====================================================
   GOAL
===================================================== */

function updateFocusGoal(
    minutes
) {

    const goal =
        240;


    const percentage =
        Math.min(
            (minutes / goal) * 100,
            100
        );


    document.getElementById(
        "goalProgress"
    ).textContent =
        formatMinutes(
            minutes
        );


    document.getElementById(
        "focusGoalProgress"
    ).style.width =
        `${percentage}%`;

}


/* =====================================================
   STREAK
===================================================== */

function updateFocusStreak() {

    const uniqueDays =
        [
            ...new Set(
                focusHistory.map(
                    session =>
                        session.date
                            .split("T")[0]
                )
            )
        ]
        .sort()
        .reverse();


    let streak = 0;

    let current =
        new Date();


    for (
        let i = 0;
        i < uniqueDays.length;
        i++
    ) {

        const day =
            new Date(
                uniqueDays[i] +
                "T00:00:00"
            );


        const difference =
            Math.floor(
                (
                    current -
                    day
                ) /
                86400000
            );


        if (
            difference ===
            streak
        ) {

            streak++;

        }

        else {

            break;

        }

    }


    document.getElementById(
        "focusStreak"
    ).textContent =
        streak;

}


/* =====================================================
   HISTORY
===================================================== */

function renderFocusHistory() {

    const container =
        document.getElementById(
            "focusHistory"
        );


    if (!container) {

        return;

    }


    if (
        focusHistory.length === 0
    ) {

        container.innerHTML = `

            <div class="focus-empty">

                <span>
                    ◷
                </span>

                <p>
                    No focus sessions yet.
                </p>

                <small>
                    Start your first session to
                    build your study history.
                </small>

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    focusHistory
        .slice(0, 10)
        .forEach(
            function(session) {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "focus-history-item";


                const date =
                    new Date(
                        session.date
                    );


                item.innerHTML = `

                    <div class="history-icon">
                        ◷
                    </div>

                    <div class="history-main">

                        <strong>
                            Focus Session
                        </strong>

                        <small>
                            ${date.toLocaleDateString()}
                            ·
                            ${date.toLocaleTimeString(
                                [],
                                {
                                    hour:
                                        "2-digit",
                                    minute:
                                        "2-digit"
                                }
                            )}
                        </small>

                    </div>

                    <div class="history-duration">
                        ${session.duration} min
                    </div>

                `;


                container.appendChild(
                    item
                );

            }
        );

}


/* =====================================================
   CLEAR HISTORY
===================================================== */

document.getElementById(
    "clearFocusHistory"
)?.addEventListener(
    "click",
    function() {

        if (
            focusHistory.length === 0
        ) {

            return;

        }


        const confirmed =
            confirm(
                "Clear all focus session history?"
            );


        if (!confirmed) {

            return;

        }


        focusHistory = [];

        saveFocusHistory();

        renderFocusHistory();

        updateFocusStatistics();

    }
);


/* =====================================================
   FORMAT TIME
===================================================== */

function formatMinutes(
    minutes
) {

    const hours =
        Math.floor(
            minutes / 60
        );


    const mins =
        minutes % 60;


    if (hours > 0) {

        return `${hours}h ${String(mins).padStart(2, "0")}m`;

    }


    return `${mins}m`;

}


/* =====================================================
   INITIALIZE
===================================================== */

updateTimerDisplay();

renderFocusHistory();

updateFocusStatistics();
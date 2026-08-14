/* =====================================================
   NEXUS WORKSPACE
   SETTINGS ENGINE
===================================================== */


/* =====================================================
   DEFAULT SETTINGS
===================================================== */

const nexusSettings = {

    theme: "dark",

    compactMode: false,

    animations: true,

    startPage: "dashboard",

    welcomeMessage: true,

    autoSave: true,

    taskNotifications: true,

    studyNotifications: true,

    calendarNotifications: true

};


/* =====================================================
   LOAD SETTINGS
===================================================== */

function loadNexusSettings() {

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    "nexusSettings"
                )
            );

        return {

            ...nexusSettings,

            ...(saved || {})

        };

    } catch {

        return {
            ...nexusSettings
        };

    }

}


/* =====================================================
   SAVE SETTINGS
===================================================== */

function saveNexusSettings(settings) {

    localStorage.setItem(
        "nexusSettings",
        JSON.stringify(settings)
    );

}


/* =====================================================
   APPLY SETTINGS
===================================================== */

function applyNexusSettings() {

    const settings =
        loadNexusSettings();


    /* Theme */

    document.documentElement
        .setAttribute(
            "data-theme",
            settings.theme
        );


    /* Compact */

    document.body.classList.toggle(
        "nexus-compact",
        settings.compactMode
    );


    /* Animations */

    document.body.classList.toggle(
        "nexus-no-animations",
        !settings.animations
    );


    updateControls(
        settings
    );

}


/* =====================================================
   UPDATE CONTROLS
===================================================== */

function updateControls(
    settings
) {

    const compact =
        document.getElementById(
            "compactModeToggle"
        );

    const animations =
        document.getElementById(
            "animationsToggle"
        );

    const welcome =
        document.getElementById(
            "welcomeToggle"
        );

    const autoSave =
        document.getElementById(
            "autoSaveToggle"
        );

    const task =
        document.getElementById(
            "taskNotificationsToggle"
        );

    const study =
        document.getElementById(
            "studyNotificationsToggle"
        );

    const calendar =
        document.getElementById(
            "calendarNotificationsToggle"
        );


    if (compact)
        compact.checked =
            settings.compactMode;


    if (animations)
        animations.checked =
            settings.animations;


    if (welcome)
        welcome.checked =
            settings.welcomeMessage;


    if (autoSave)
        autoSave.checked =
            settings.autoSave;


    if (task)
        task.checked =
            settings.taskNotifications;


    if (study)
        study.checked =
            settings.studyNotifications;


    if (calendar)
        calendar.checked =
            settings.calendarNotifications;


    const startPage =
        document.getElementById(
            "startPageSelect"
        );


    if (startPage)
        startPage.value =
            settings.startPage;


    document
        .querySelectorAll(
            ".theme-option"
        )
        .forEach(
            button => {

                button.classList.toggle(
                    "active",
                    button.dataset.theme ===
                    settings.theme
                );

            }
        );

}


/* =====================================================
   SETTINGS TABS
===================================================== */

document
    .querySelectorAll(
        ".settings-tab"
    )
    .forEach(
        tab => {

            tab.addEventListener(
                "click",
                function() {

                    const target =
                        this.dataset
                            .settingsTab;


                    document
                        .querySelectorAll(
                            ".settings-tab"
                        )
                        .forEach(
                            item =>
                                item.classList
                                    .remove(
                                        "active"
                                    )
                        );


                    document
                        .querySelectorAll(
                            ".settings-page"
                        )
                        .forEach(
                            page =>
                                page.classList
                                    .remove(
                                        "active"
                                    )
                        );


                    this.classList.add(
                        "active"
                    );


                    document
                        .querySelector(
                            `[data-settings-page="${target}"]`
                        )
                        ?.classList
                        .add(
                            "active"
                        );

                }
            );

        }
    );


/* =====================================================
   THEME
===================================================== */

document
    .querySelectorAll(
        ".theme-option"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                function() {

                    const settings =
                        loadNexusSettings();


                    settings.theme =
                        this.dataset.theme;


                    saveNexusSettings(
                        settings
                    );


                    applyNexusSettings();

                }
            );

        }
    );


/* =====================================================
   TOGGLE HANDLER
===================================================== */

function bindToggle(
    id,
    setting
) {

    document
        .getElementById(id)
        ?.addEventListener(
            "change",
            function() {

                const settings =
                    loadNexusSettings();


                settings[setting] =
                    this.checked;


                saveNexusSettings(
                    settings
                );


                applyNexusSettings();

            }
        );

}


bindToggle(
    "compactModeToggle",
    "compactMode"
);


bindToggle(
    "animationsToggle",
    "animations"
);


bindToggle(
    "welcomeToggle",
    "welcomeMessage"
);


bindToggle(
    "autoSaveToggle",
    "autoSave"
);


bindToggle(
    "taskNotificationsToggle",
    "taskNotifications"
);


bindToggle(
    "studyNotificationsToggle",
    "studyNotifications"
);


bindToggle(
    "calendarNotificationsToggle",
    "calendarNotifications"
);


/* =====================================================
   START PAGE
===================================================== */

document
    .getElementById(
        "startPageSelect"
    )
    ?.addEventListener(
        "change",
        function() {

            const settings =
                loadNexusSettings();


            settings.startPage =
                this.value;


            saveNexusSettings(
                settings
            );

        }
    );


/* =====================================================
   EXPORT WORKSPACE
===================================================== */

document
    .getElementById(
        "exportDataButton"
    )
    ?.addEventListener(
        "click",
        function() {

            const workspace = {};


            for (
                let i = 0;
                i < localStorage.length;
                i++
            ) {

                const key =
                    localStorage.key(i);


                workspace[key] =
                    localStorage.getItem(
                        key
                    );

            }


            const data =
                JSON.stringify(
                    workspace,
                    null,
                    2
                );


            const blob =
                new Blob(
                    [data],
                    {
                        type:
                            "application/json"
                    }
                );


            const url =
                URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href =
                url;


            link.download =
                "nexus-workspace-backup.json";


            link.click();


            URL.revokeObjectURL(
                url
            );

        }
    );


/* =====================================================
   IMPORT WORKSPACE
===================================================== */

const importInput =
    document.getElementById(
        "importDataInput"
    );


document
    .getElementById(
        "importDataButton"
    )
    ?.addEventListener(
        "click",
        function() {

            importInput?.click();

        }
    );


importInput?.addEventListener(
    "change",
    function() {

        const file =
            this.files[0];


        if (!file) {

            return;

        }


        const reader =
            new FileReader();


        reader.onload =
            function(event) {

                try {

                    const data =
                        JSON.parse(
                            event.target.result
                        );


                    Object.entries(
                        data
                    ).forEach(
                        ([key, value]) => {

                            localStorage.setItem(
                                key,
                                value
                            );

                        }
                    );


                    alert(
                        "Nexus Workspace restored successfully."
                    );


                    location.reload();

                } catch {

                    alert(
                        "The selected backup file is invalid."
                    );

                }

            };


        reader.readAsText(
            file
        );

    }
);


/* =====================================================
   CLEAR DATA
===================================================== */

document
    .getElementById(
        "clearDataButton"
    )
    ?.addEventListener(
        "click",
        function() {

            const confirmation =
                confirm(
                    "This will permanently remove your Nexus Workspace data from this browser. Continue?"
                );


            if (!confirmation) {

                return;

            }


            localStorage.clear();


            alert(
                "Nexus Workspace data has been cleared."
            );


            location.reload();

        }
    );


/* =====================================================
   INITIALIZE
===================================================== */

applyNexusSettings();
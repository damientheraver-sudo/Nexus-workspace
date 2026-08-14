/* =====================================================
   NEXUS WORKSPACE
   ENGINEERING LAB
===================================================== */


/* =====================================================
   STORAGE
===================================================== */

let engineeringProjects =
    JSON.parse(
        localStorage.getItem(
            "nexusEngineeringProjects"
        )
    ) || [];


let engineeringSnippets =
    JSON.parse(
        localStorage.getItem(
            "nexusEngineeringSnippets"
        )
    ) || [];


/* =====================================================
   SAVE
===================================================== */

function saveEngineeringProjects() {

    localStorage.setItem(
        "nexusEngineeringProjects",
        JSON.stringify(
            engineeringProjects
        )
    );

}


/* =====================================================
   PROJECT CREATION
===================================================== */

function createEngineeringProject() {

    const name =
        prompt(
            "Project name:"
        );


    if (!name || !name.trim()) {

        return;

    }


    const description =
        prompt(
            "What are you building?"
        ) || "";


    const project = {

        id:
            Date.now(),

        name:
            name.trim(),

        description:
            description.trim(),

        status:
            "In Progress",

        created:
            new Date().toISOString()

    };


    engineeringProjects.unshift(
        project
    );


    saveEngineeringProjects();

    renderEngineeringProjects();

    updateEngineeringStatistics();

}


/* =====================================================
   RENDER PROJECTS
===================================================== */

function renderEngineeringProjects() {

    const container =
        document.getElementById(
            "engineeringProjects"
        );


    if (!container) {

        return;

    }


    if (
        engineeringProjects.length === 0
    ) {

        container.innerHTML = `

            <div class="engineering-empty">

                <span>
                    ◇
                </span>

                <p>
                    No engineering projects yet.
                </p>

                <small>
                    Start building something.
                </small>

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    engineeringProjects.forEach(
        function(project) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "engineering-project";


            const completed =
                project.status ===
                "Completed";


            item.innerHTML = `

                <div class="project-icon">
                    ◇
                </div>

                <div class="project-info">

                    <strong>
                        ${escapeEngineeringHTML(
                            project.name
                        )}
                    </strong>

                    <span>
                        ${escapeEngineeringHTML(
                            project.description ||
                            "Engineering project"
                        )}
                    </span>

                </div>

                <button
                    class="project-status ${
                        completed
                            ? "completed"
                            : ""
                    }"
                    data-project-id="${project.id}"
                >

                    ${
                        completed
                            ? "Completed"
                            : "In Progress"
                    }

                </button>

            `;


            container.appendChild(
                item
            );

        }
    );


    document
        .querySelectorAll(
            ".project-status"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function() {

                        toggleEngineeringProject(
                            Number(
                                this.dataset.projectId
                            )
                        );

                    }
                );

            }
        );

}


/* =====================================================
   TOGGLE PROJECT
===================================================== */

function toggleEngineeringProject(
    id
) {

    const project =
        engineeringProjects.find(
            item =>
                item.id === id
        );


    if (!project) {

        return;

    }


    project.status =
        project.status ===
        "Completed"
            ? "In Progress"
            : "Completed";


    saveEngineeringProjects();

    renderEngineeringProjects();

    updateEngineeringStatistics();

}


/* =====================================================
   STATISTICS
===================================================== */

function updateEngineeringStatistics() {

    const active =
        engineeringProjects.filter(
            project =>
                project.status !==
                "Completed"
        ).length;


    const completed =
        engineeringProjects.filter(
            project =>
                project.status ===
                "Completed"
        ).length;


    const projectCount =
        document.getElementById(
            "engineeringProjectCount"
        );


    const completedCount =
        document.getElementById(
            "engineeringCompletedCount"
        );


    const snippetCount =
        document.getElementById(
            "engineeringSnippetCount"
        );


    if (projectCount) {

        projectCount.textContent =
            active;

    }


    if (completedCount) {

        completedCount.textContent =
            completed;

    }


    if (snippetCount) {

        snippetCount.textContent =
            engineeringSnippets.length;

    }

}


/* =====================================================
   LANGUAGE CARDS
===================================================== */

document
    .querySelectorAll(
        ".language-card"
    )
    .forEach(
        card => {

            card.addEventListener(
                "click",
                function() {

                    const language =
                        this.dataset.language;


                    openProgrammingWorkspace(
                        language
                    );

                }
            );

        }
    );


function openProgrammingWorkspace(
    language
) {

    alert(
        `${language} workspace coming next.\n\n` +
        `This will become your dedicated ${language} `
        +
        `development area inside Nexus Workspace.`
    );

}


/* =====================================================
   ENGINEERING TOOLS
===================================================== */

document
    .querySelectorAll(
        ".engineering-tool-button"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                function() {

                    const tool =
                        this.dataset.tool;


                    if (
                        tool ===
                        "circuits"
                    ) {

                        openCircuitCalculator();

                    }


                    else if (
                        tool ===
                        "logic"
                    ) {

                        openLogicLab();

                    }


                    else if (
                        tool ===
                        "snippets"
                    ) {

                        openSnippetLibrary();

                    }


                    else if (
                        tool ===
                        "projects"
                    ) {

                        document
                            .getElementById(
                                "engineeringProjects"
                            )
                            ?.scrollIntoView({
                                behavior:
                                    "smooth"
                            });

                    }

                }
            );

        }
    );


/* =====================================================
   CIRCUIT CALCULATOR
===================================================== */

function openCircuitCalculator() {

    const voltage =
        Number(
            prompt(
                "Voltage (V):"
            )
        );


    if (
        !Number.isFinite(
            voltage
        )
    ) {

        return;

    }


    const resistance =
        Number(
            prompt(
                "Resistance (Ω):"
            )
        );


    if (
        !Number.isFinite(
            resistance
        ) ||
        resistance === 0
    ) {

        return;

    }


    const current =
        voltage /
        resistance;


    const power =
        voltage *
        current;


    alert(
        `Circuit Calculation\n\n` +

        `Voltage: ${voltage} V\n` +

        `Resistance: ${resistance} Ω\n\n` +

        `Current: ${current.toFixed(4)} A\n` +

        `Power: ${power.toFixed(4)} W`
    );

}


/* =====================================================
   DIGITAL LOGIC
===================================================== */

function openLogicLab() {

    const a =
        confirm(
            "Input A: OK = 1, Cancel = 0"
        )
            ? 1
            : 0;


    const b =
        confirm(
            "Input B: OK = 1, Cancel = 0"
        )
            ? 1
            : 0;


    alert(
        `Digital Logic\n\n` +

        `A = ${a}\n` +

        `B = ${b}\n\n` +

        `AND = ${a & b}\n` +

        `OR = ${a | b}\n` +

        `XOR = ${a ^ b}\n` +

        `NOT A = ${a ? 0 : 1}`
    );

}


/* =====================================================
   SNIPPET LIBRARY
===================================================== */

function openSnippetLibrary() {

    const snippet =
        prompt(
            "Paste a short code snippet:"
        );


    if (
        !snippet ||
        !snippet.trim()
    ) {

        return;

    }


    engineeringSnippets.unshift({

        id:
            Date.now(),

        code:
            snippet,

        created:
            new Date().toISOString()

    });


    engineeringSnippets =
        engineeringSnippets.slice(
            0,
            50
        );


    localStorage.setItem(
        "nexusEngineeringSnippets",
        JSON.stringify(
            engineeringSnippets
        )
    );


    updateEngineeringStatistics();


    alert(
        "Code snippet saved to your Engineering Lab."
    );

}


/* =====================================================
   PROJECT BUTTONS
===================================================== */

document.getElementById(
    "newEngineeringProject"
)?.addEventListener(
    "click",
    createEngineeringProject
);


document.getElementById(
    "engineeringAddProject"
)?.addEventListener(
    "click",
    createEngineeringProject
);


/* =====================================================
   HTML SAFETY
===================================================== */

function escapeEngineeringHTML(
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

renderEngineeringProjects();

updateEngineeringStatistics();
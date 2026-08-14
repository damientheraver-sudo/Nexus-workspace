/* =====================================================
   NEXUS WORKSPACE
   RESOURCES & STUDY LIBRARY
===================================================== */


/* =====================================================
   STORAGE
===================================================== */

let nexusResources =
    JSON.parse(
        localStorage.getItem(
            "nexusResources"
        )
    ) || [];


/* =====================================================
   SAVE
===================================================== */

function saveResources() {

    localStorage.setItem(
        "nexusResources",
        JSON.stringify(
            nexusResources
        )
    );

}


/* =====================================================
   ELEMENTS
===================================================== */

const resourceModal =
    document.getElementById(
        "resourceModal"
    );

const resourceForm =
    document.getElementById(
        "resourceForm"
    );

const resourceGrid =
    document.getElementById(
        "resourceGrid"
    );

const resourceSearch =
    document.getElementById(
        "resourceSearch"
    );

const resourceCategory =
    document.getElementById(
        "resourceCategory"
    );

const resourceType =
    document.getElementById(
        "resourceType"
    );


/* =====================================================
   OPEN / CLOSE MODAL
===================================================== */

function openResourceModal() {

    resourceModal?.classList.add(
        "active"
    );

}


function closeResourceModal() {

    resourceModal?.classList.remove(
        "active"
    );

}


/* =====================================================
   ADD RESOURCE
===================================================== */

function addResource(
    event
) {

    event.preventDefault();


    const name =
        document.getElementById(
            "resourceName"
        ).value.trim();


    const subject =
        document.getElementById(
            "resourceSubject"
        ).value;


    const kind =
        document.getElementById(
            "resourceKind"
        ).value;


    const url =
        document.getElementById(
            "resourceURL"
        ).value.trim();


    const description =
        document.getElementById(
            "resourceDescription"
        ).value.trim();


    if (!name) {

        return;

    }


    const resource = {

        id:
            Date.now(),

        name,

        subject,

        kind,

        url,

        description,

        favorite:
            false,

        created:
            new Date().toISOString()

    };


    nexusResources.unshift(
        resource
    );


    saveResources();


    resourceForm.reset();

    closeResourceModal();

    renderResources();

    updateResourceStatistics();

}


/* =====================================================
   RENDER
===================================================== */

function renderResources() {

    if (!resourceGrid) {

        return;

    }


    const search =
        resourceSearch
            ?.value
            .toLowerCase()
            .trim() || "";


    const category =
        resourceCategory
            ?.value || "all";


    const type =
        resourceType
            ?.value || "all";


    let filtered =
        [...nexusResources];


    if (search) {

        filtered =
            filtered.filter(
                resource =>

                    resource.name
                        .toLowerCase()
                        .includes(search)

                    ||

                    resource.description
                        .toLowerCase()
                        .includes(search)

                    ||

                    resource.subject
                        .toLowerCase()
                        .includes(search)
            );

    }


    if (
        category !==
        "all"
    ) {

        filtered =
            filtered.filter(
                resource =>
                    resource.subject ===
                    category
            );

    }


    if (
        type !==
        "all"
    ) {

        filtered =
            filtered.filter(
                resource =>
                    resource.kind ===
                    type
            );

    }


    resourceGrid.innerHTML =
        "";


    if (
        filtered.length ===
        0
    ) {

        resourceGrid.innerHTML = `

            <div class="resource-empty">

                <div class="resource-empty-icon">
                    ◈
                </div>

                <h3>
                    No resources found
                </h3>

                <p>
                    Try another search or add
                    a new resource to your library.
                </p>

            </div>

        `;

        renderFavorites();

        return;

    }


    filtered.forEach(
        resource => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "resource-card";


            card.innerHTML = `

                <div class="resource-card-top">

                    <div class="resource-type-icon">

                        ${
                            getResourceIcon(
                                resource.kind
                            )
                        }

                    </div>

                    <button
                        class="resource-favorite ${
                            resource.favorite
                                ? "active"
                                : ""
                        }"
                        data-id="${resource.id}"
                        title="Favorite"
                    >

                        ${
                            resource.favorite
                                ? "★"
                                : "☆"
                        }

                    </button>

                </div>


                <h3>

                    ${
                        escapeResourceHTML(
                            resource.name
                        )
                    }

                </h3>


                <p class="resource-card-description">

                    ${
                        escapeResourceHTML(
                            resource.description ||
                            "No description added."
                        )
                    }

                </p>


                <div class="resource-card-meta">

                    <span class="resource-subject">

                        ${
                            escapeResourceHTML(
                                resource.subject
                            )
                        }

                    </span>

                    <span class="resource-kind">

                        ${
                            resource.kind
                        }

                    </span>

                </div>


                <div class="resource-card-actions">

                    <button
                        class="resource-open-button"
                        data-open-id="${resource.id}"
                    >
                        Open Resource
                    </button>

                    <button
                        class="resource-delete-button"
                        data-delete-id="${resource.id}"
                    >
                        ×
                    </button>

                </div>

            `;


            resourceGrid.appendChild(
                card
            );

        }
    );


    attachResourceActions();

    renderFavorites();

}


/* =====================================================
   RESOURCE ICON
===================================================== */

function getResourceIcon(
    type
) {

    switch(type) {

        case "PDF":
            return "▣";

        case "Website":
            return "◎";

        case "Video":
            return "▶";

        case "Code":
            return "&lt;/&gt;";

        default:
            return "◈";

    }

}


/* =====================================================
   FAVORITES
===================================================== */

function renderFavorites() {

    const container =
        document.getElementById(
            "favoriteResources"
        );


    if (!container) {

        return;

    }


    const favorites =
        nexusResources.filter(
            resource =>
                resource.favorite
        );


    container.innerHTML =
        "";


    if (
        favorites.length ===
        0
    ) {

        container.classList.remove(
            "has-items"
        );

        return;

    }


    container.classList.add(
        "has-items"
    );


    favorites.forEach(
        resource => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "favorite-resource";


            item.innerHTML = `

                <span>
                    ★ ${resource.subject}
                </span>

                <strong>
                    ${
                        escapeResourceHTML(
                            resource.name
                        )
                    }
                </strong>

            `;


            item.addEventListener(
                "click",
                function() {

                    openResource(
                        resource.id
                    );

                }
            );


            container.appendChild(
                item
            );

        }
    );

}


/* =====================================================
   ACTIONS
===================================================== */

function attachResourceActions() {

    document
        .querySelectorAll(
            ".resource-favorite"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function() {

                        toggleFavorite(
                            Number(
                                this.dataset.id
                            )
                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(
            ".resource-open-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function() {

                        openResource(
                            Number(
                                this.dataset.openId
                            )
                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(
            ".resource-delete-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function() {

                        deleteResource(
                            Number(
                                this.dataset.deleteId
                            )
                        );

                    }
                );

            }
        );

}


/* =====================================================
   FAVORITE
===================================================== */

function toggleFavorite(
    id
) {

    const resource =
        nexusResources.find(
            item =>
                item.id === id
        );


    if (!resource) {

        return;

    }


    resource.favorite =
        !resource.favorite;


    saveResources();

    renderResources();

    updateResourceStatistics();

}


/* =====================================================
   OPEN
===================================================== */

function openResource(
    id
) {

    const resource =
        nexusResources.find(
            item =>
                item.id === id
        );


    if (!resource) {

        return;

    }


    if (
        resource.url
    ) {

        window.open(
            resource.url,
            "_blank",
            "noopener,noreferrer"
        );

    } else {

        alert(
            "No link has been added to this resource."
        );

    }

}


/* =====================================================
   DELETE
===================================================== */

function deleteResource(
    id
) {

    const resource =
        nexusResources.find(
            item =>
                item.id === id
        );


    if (!resource) {

        return;

    }


    const confirmed =
        confirm(
            `Delete "${resource.name}"?`
        );


    if (!confirmed) {

        return;

    }


    nexusResources =
        nexusResources.filter(
            item =>
                item.id !== id
        );


    saveResources();

    renderResources();

    updateResourceStatistics();

}


/* =====================================================
   STATISTICS
===================================================== */

function updateResourceStatistics() {

    const total =
        document.getElementById(
            "resourceTotal"
        );


    const documents =
        document.getElementById(
            "resourceDocuments"
        );


    const web =
        document.getElementById(
            "resourceWeb"
        );


    const favorites =
        document.getElementById(
            "resourceFavorites"
        );


    if (total) {

        total.textContent =
            nexusResources.length;

    }


    if (documents) {

        documents.textContent =
            nexusResources.filter(
                resource =>
                    resource.kind ===
                    "PDF"
            ).length;

    }


    if (web) {

        web.textContent =
            nexusResources.filter(
                resource =>
                    resource.kind ===
                    "Website"
            ).length;

    }


    if (favorites) {

        favorites.textContent =
            nexusResources.filter(
                resource =>
                    resource.favorite
            ).length;

    }

}


/* =====================================================
   HTML SAFETY
===================================================== */

function escapeResourceHTML(
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
   EVENT LISTENERS
===================================================== */

document.getElementById(
    "addResourceButton"
)?.addEventListener(
    "click",
    openResourceModal
);


document.getElementById(
    "emptyAddResource"
)?.addEventListener(
    "click",
    openResourceModal
);


document.getElementById(
    "closeResourceModal"
)?.addEventListener(
    "click",
    closeResourceModal
);


resourceForm?.addEventListener(
    "submit",
    addResource
);


resourceSearch?.addEventListener(
    "input",
    renderResources
);


resourceCategory?.addEventListener(
    "change",
    renderResources
);


resourceType?.addEventListener(
    "change",
    renderResources
);


/* Close when clicking outside */

resourceModal?.addEventListener(
    "click",
    function(event) {

        if (
            event.target ===
            resourceModal
        ) {

            closeResourceModal();

        }

    }
);


/* =====================================================
   INITIALIZE
===================================================== */

renderResources();

updateResourceStatistics();
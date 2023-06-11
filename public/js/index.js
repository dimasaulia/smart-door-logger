// SET DATA
const ctx = document.getElementById("chart");
const gradient = ctx.getContext("2d").createLinearGradient(800, 200, 100, 100);
gradient.addColorStop(1, "rgba(67, 156, 251, 0.8)");
gradient.addColorStop(0, "rgba(241, 135, 251, 0.5)");

function chartAddData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

const chart = new Chart(ctx, {
    type: "line",

    data: {
        labels: [],
        datasets: [
            {
                data: [],
                borderWidth: 1,
                fill: true,
                backgroundColor: gradient,
                label: "Responses Time (ms)",
            },
        ],
    },
    options: {
        plugins: {
            filler: {
                propagate: false,
            },
            title: {
                display: true,
                text: "LAST 20 RESPONSE TIME",
            },
        },
        elements: {
            line: {
                tension: 0.4,
            },
        },
        pointBackgroundColor: "rgb(241, 135, 251)",
        radius: 10,
        interaction: {
            intersect: false,
        },
    },
});

// FETCH DATA
const container = document.getElementById("container");
const moreBtn = document.getElementById("load");
const DATA_STORAGE = [];

const tableItemtemplate = (data) => {
    return `
        <div class="table-item" data-id=${data.id} id=${data.id}>
            <p>${data.Device.device_id}</p>
            <p>${data.Device.deviceType.replace("_", " ")}</p>
            <p>${data.responseTime}</p>
            <p>${days(data.createdAt)}</p>
            <div class="pointer">
                <p onclick="deleteButtonOnCLick('${data.id}')">Delete</p>
                <div class="hidden">
                    <p>Are you sure for delete this data?</p>
                    <div class="delete-action">
                        <p onclick="confirmDeleteOnCLick('${data.id}')">Yes</p>
                        <p onclick="cencelDeleteOnCLick('${data.id}')">No</p>
                    </div>
                </div>
            </div>
        </div>
    `;
};

const renderData = (data) => {
    // Fill table
    data.forEach((d) => {
        container.insertAdjacentHTML("beforeend", tableItemtemplate(d));
    });
    // Fill Chart
    data.reverse().forEach((d) => {
        chartAddData(chart, days(d.createdAt), d.responseTime);
    });
};

const dataLoader = async (url, cb) => {
    const data = await httpRequest({ url, method: "GET" });
    cb(data.data);
};

dataLoader("api/v1/logger/", renderData);
moreBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const lastId = lastCursorFinder(".table-item", "id");
    chart.data.labels = [];
    chart.data.datasets.data = [];
    console.log(chart.data.datasets);
    dataLoader(`api/v1/logger/?cursor=${lastId}`, renderData);
});

const deleteButtonOnCLick = (id) => {
    const container = document.getElementById(id);
    container.childNodes[9].childNodes[1].classList.add("hidden");
    container.childNodes[9].childNodes[3].classList.remove("hidden");
};

const cencelDeleteOnCLick = (id) => {
    const container = document.getElementById(id);
    container.childNodes[9].childNodes[1].classList.remove("hidden");
    container.childNodes[9].childNodes[3].classList.add("hidden");
};

const confirmDeleteOnCLick = async (id) => {
    const container = document.getElementById(id);
    const logId = container.getAttribute("data-id");
    const resp = await httpRequest({
        url: "/api/v1/logger/",
        method: "DELETE",
        body: {
            id: logId,
        },
    });
    if (resp.success) {
        container.remove();
    }
    if (!resp.success) {
        alert("Failed to delete log");
    }
};

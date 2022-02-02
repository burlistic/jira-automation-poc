window.onload = () => {
    init();
}

function init() {
    getDev();
}

function getDev() {
    const xhttp = new XMLHttpRequest();

    xhttp.onload = () => {
        if (xhttp.status == 200) {
            const responseText = JSON.parse(xhttp.responseText);
            updateTitle(responseText["message"]);
        }
        else {
            console.log(xhttp.status);
        }
    }

    xhttp.open("GET", "http://localhost:7071/api/environment");
    xhttp.send();
}

function updateTitle(message) {
    const titleHeading = document.getElementById("title");
    titleHeading.innerHTML = message;
}
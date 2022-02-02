window.onload = () => {
    init();
}


function init() {
    addGetBtnOnClick();
}

function addGetBtnOnClick() {
    const getButton = document.getElementById("get-btn");
    getButton.onclick = getDev;
}

function getDev() {
    const xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = () => {
        if(xhttp.readyState == XMLHttpRequest.DONE) {
            if (xhttp.status == 200) {
                const responseText = JSON.parse(xhttp.responseText);
                setTimeout(() => {
                    updateMessageText(responseText["message"]);
                    updateGetBtnText();
                }, 2000);
            }
            else {
                console.log(xhttp.status);
            }
        }
        else {
            updateMessageLoading();
            updateGetBtnLoading();
        }

    }

    xhttp.open("GET", "https://fa-prd-cicd-practice.azurewebsites.net/api/environment");
    xhttp.send();
}

function updateMessageText(message) {
    const titleMessage = document.getElementById("get-msg");
    titleMessage.innerHTML = message;
}

function updateMessageLoading() {
    const titleMessage = document.getElementById("get-msg");

    const spinnerDiv = document.createElement("div");
    spinnerDiv.classList.add("spinner-border", "text-primary");

    const spinnerSpan = document.createElement("span");
    spinnerSpan.classList.add("sr-only");

    spinnerDiv.appendChild(spinnerSpan);

    titleMessage.innerHTML = '';
    titleMessage.appendChild(spinnerDiv);
}

function updateGetBtnText() {
    const getButton = document.getElementById("get-btn");
    getButton.innerHTML = "GET";
}

function updateGetBtnLoading() {
    const getButton = document.getElementById("get-btn");

    const spinnerDiv = document.createElement("div");
    spinnerDiv.classList.add("spinner-grow", "spinner-grow-sm");

    const spinnerSpan = document.createElement("span");
    spinnerSpan.classList.add("sr-only");

    spinnerDiv.appendChild(spinnerSpan);

    getButton.innerHTML = '';
    getButton.appendChild(spinnerDiv);
}
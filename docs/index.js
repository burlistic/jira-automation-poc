isLoading = false;

window.onload = () => {
    init();
}

function init() {
    addGetBtnOnClick();
    addEnvSwitchOnChange();

    highlightSelectedEnvironment();
}


function addGetBtnOnClick() {
    const getButton = document.getElementById("get-btn");
    getButton.onclick = getEnvironment
}

function addEnvSwitchOnChange() {
    const envSwitch = document.getElementById("env-switch");
    envSwitch.onchange = highlightSelectedEnvironment
}

function highlightSelectedEnvironment() {
    const envSwitch = document.getElementById("env-switch");

    const labelIdPrefix = "switch-label-";
    let selectedEnv = "dev";
    let unusedEnv = "prd";

    if (envSwitch.checked) {
        selectedEnv = "prd";
        unusedEnv   = "dev";
    }

    const onSwitchLabel = document.getElementById(labelIdPrefix + selectedEnv);
    const offSwitchLabel = document.getElementById(labelIdPrefix + unusedEnv);

    emptyClassList(onSwitchLabel);
    emptyClassList(offSwitchLabel);

    onSwitchLabel.classList.add("text-warning");
    offSwitchLabel.classList.add("text-white");

}

function emptyClassList(element) {
    let classList = element.classList;
    while (classList.length > 0) {
        classList.remove(classList.item(0));
    }
}

function getEnvironment() {
    const xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = () => {
        if(xhttp.readyState == XMLHttpRequest.DONE) {
            if (xhttp.status == 200) {
                const responseText = JSON.parse(xhttp.responseText);
                setTimeout(() => {
                    updateMessageText(responseText["message"]);
                    updateGetBtnText();
                    isLoading = false;
                }, 500);
            }
            else {
                updateMessageText("Oops something went wrong...");
                updateGetBtnText();
                isLoading = false;
            }
        }
        else {
            if (!isLoading) {
                updateMessageLoading();
                updateGetBtnLoading();
                isLoading = true;
            }
        }

    }

    const environment = getEnvironmentChoice();

    const url = "https://fa-" + environment + "-cicd-practice.azurewebsites.net/api/environment";

    xhttp.open("GET", url);
    xhttp.send();
}

function getEnvironmentChoice() {
    const envSwitch = document.getElementById("env-switch");
    if (envSwitch.checked) {
        return "prd";
    }
    return "dev";
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
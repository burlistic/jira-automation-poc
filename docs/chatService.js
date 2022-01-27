window.onload = function() {
    init();
  
    setInterval(() => {
     getMessages(); 
    }, 5000);
  };
  
  
  function init() {
    constructPage();
  }
  
  
  function constructPage() {
    addInitialClasses();
    addHeading();
    addChatOutput();
    getPreviousChatMessages();
    addChatButtons();
  }
  
  function getMessages() {
    const xhttp = new XMLHttpRequest();
    
    xhttp.onload = () => {
      if (xhttp.status == 200) {
        const responseText = JSON.parse(xhttp.responseText);
        clearChatTable();
        addPreviousMessagesToTable(responseText["messages"]);
      }
      else {
        console.log(xhttp.status);
        return null;
      }
    };
  
    xhttp.open("GET", "https://fa-dev-bicep-practice.azurewebsites.net/api/messages");
    xhttp.send();
  }
  
  function clearChatTable() {
    console.log("Clearing table");
    const chatTable = document.getElementById("chatTable");
    const chatTableBody = document.getElementById("chatTableBody");
  
    chatTable.removeChild(chatTableBody);
  }
  
  
  function addInitialClasses() {
    document.body.classList.add("vh-100");
  }
  
  
  function addHeading() {
    const heading = document.createElement("header");
    heading.classList.add("p-3", "bg-dark", "text-white", "text-center");
    document.body.appendChild(heading);
  
    const headingImage = document.createElement("img");
    headingImage.src = "https://rac.com.au/assets/img/RAC-site-logo-mobile.png";
    heading.appendChild(headingImage);
  
    const headingText = document.createElement("h1");
    headingText.innerHTML = "Chat Service";
    heading.appendChild(headingText);
  }
  
  
  function addChatOutput() {
    const container = document.createElement("div");
    container.classList.add("container-fluid", "pt-3");
    document.body.appendChild(container);
  
    const chatOutputBox = document.createElement("div");
    chatOutputBox.id = "chatOutput";
    chatOutputBox.classList.add("container-fluid", "p-4");
    chatOutputBox.style.background = "black";
    container.appendChild(chatOutputBox);
  
    addChatOutputTable();
  }
  
  
  function addChatOutputTable() {
    const chatTableRow = document.createElement("div");
    chatTableRow.classList.add("row");
    chatTableRow.style.height = "500px";
    chatTableRow.style.overflowY = "auto";
    document.getElementById("chatOutput").appendChild(chatTableRow);
  
    const chatTable = document.createElement("table");
    chatTable.id = "chatTable";
    chatTable.classList.add("table","table-dark", "table-striped", "table-hover", "overflow-scroll", "table-borderless");
    chatTableRow.appendChild(chatTable);
  
    const chatThead = document.createElement("thead");
    chatTable.append(chatThead);
  
    const chatTrow = document.createElement("tr");
    chatTrow.id = "chatTableHeadingRow";
    chatThead.append(chatTrow);
  
    const headings = [
      {name : "id", width : "5%"}, 
      {name : "name", width : "10%"}, 
      {name : "message", width : "80%"},
      {name : "delete", width : "5%"}
    ];
    headings.forEach((heading) => {
      const chatTh  = document.createElement("th");
      chatTh.style.width = heading.width;
      chatTh.style.position = "sticky";
      chatTh.style.top = "0";
      chatTh.innerHTML = heading.name;
      chatTrow.append(chatTh);
    });
  
  
  }
  
  
  function getPreviousChatMessages() {
    const xhttp = new XMLHttpRequest();
    
    xhttp.onload = () => {
      if (xhttp.status == 200) {
        const responseText = JSON.parse(xhttp.responseText);
        addPreviousMessagesToTable(responseText["messages"]);
      }
      else {
        console.log(xhttp.status);
        return null;
      }
    };
  
    xhttp.open("GET", "https://fa-dev-bicep-practice.azurewebsites.net/api/messages");
    xhttp.send();
  }
  
  
  function addPreviousMessagesToTable(messages) {
    const chatTable = document.getElementById("chatTable");
    const chatTableBody = document.createElement("tbody");
    chatTableBody.id = "chatTableBody";
    chatTable.appendChild(chatTableBody);
  
    messages.forEach((msg) => {
      const newMessageRow = document.createElement("tr");
      chatTableBody.appendChild(newMessageRow);
  
      // Just filler, change to use actual values later
      const headings = [
        {name : "id", width : "5%"}, 
        {name : "name", width : "10%"}, 
        {name : "message", width : "80%"},
        {name : "delete", width : "5%"}
      ];
      headings.forEach((heading) => {
        const td = document.createElement("td");
        if (heading.name !== "delete")
        {
          td.style.width = msg[heading.width];
          td.innerHTML = msg[heading.name];
        }
        else {
          const deleteButton = document.createElement("button");
          deleteButton.classList.add("btn", "btn-danger");
          deleteButton.innerText = "x";
          deleteButton.onclick = deleteMessage;
          td.appendChild(deleteButton);
        }
        if (heading.name === "id") td.style.color = "rgb(58, 217, 249)";
        else if (heading.name === "name") td.style.color = "yellow";
        newMessageRow.appendChild(td);
      });
    });
  }
  
  function deleteMessage() {
    console.log("deleting message...");
    const messageId = this.parentNode.parentNode.firstChild.innerHTML;
    // Should probably do error checking on parseInt 
  
    const xhttp = new XMLHttpRequest();
    
    xhttp.onload = () => {
      if (xhttp.status == 200 || xhttp.status == 404) {
        console.log(JSON.parse(xhttp.responseText));
        getMessages();
      }
      else {
        console.log(xhttp.status);
      }
    };
  
    xhttp.open("DELETE", "https://fa-dev-bicep-practice.azurewebsites.net/api/message/" + messageId);
    xhttp.send();
  
  }
  
  function sendMessageRequest(name, message) {
    const requestBody = {name : name, message : message};
  
  
    const xhttp = new XMLHttpRequest();
  
    xhttp.onload = () => {
      if (xhttp.status == 200) {
        console.log("Message sent successfully");
        const messageInput = document.getElementById("inputMessage");
        messageInput.value = "";
      }
      else {
        console.log(xhttp.responseText);
      }
    };
  
    xhttp.open("POST", "https://fa-dev-bicep-practice.azurewebsites.net/api/messages/");
    xhttp.send(JSON.stringify(requestBody));
  }
  
  
  function sendMessage() {
    const inputName = document.getElementById("inputName").value;
    const inputMessage = document.getElementById("inputMessage").value;
  
    if ( inputName.length < 1 || inputMessage.length < 1 ) {
      // Handle Error
      console.log("You need to enter a name and a message");
    }
    else {
      sendMessageRequest(inputName, inputMessage);
    }
  }
  
  
  function addChatButtons() {
    const chatInputRow = document.createElement("div");
    chatInputRow.classList.add("row");
    document.getElementById("chatOutput").appendChild(chatInputRow);
  
    const inputGroup = document.createElement("div");
    inputGroup.id = "messageInput";
    inputGroup.classList.add("input-group", "p-3", "mb-3", "dark");
    chatInputRow.appendChild(inputGroup);
  
    const inputName = document.createElement("input");
    inputName.id = "inputName";
    inputName.type = "text";
    inputName.classList.add("form-control");
    inputName.style.width = "20%";
    inputName.placeholder = "Name";
    inputGroup.appendChild(inputName);
  
    const inputMessage = document.createElement("input");
    inputMessage.id = "inputMessage";
    inputMessage.type = "text";
    inputMessage.classList.add("form-control");
    inputMessage.style.width = "70%";
    inputMessage.placeholder = "Message";
    inputGroup.appendChild(inputMessage);
  
    const inputSend = document.createElement("button");
    inputSend.classList.add("btn", "btn-warning");
    inputSend.type = "button";
    inputSend.style.width = "10%";
    inputSend.style.color = "rgb(12, 71, 200)";
    inputSend.innerHTML = "Send";
    inputGroup.appendChild(inputSend);
  
    inputSend.onclick = sendMessage;
  }
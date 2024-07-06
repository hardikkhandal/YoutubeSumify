function addCustomButton() {
  console.log("Attempting to add custom button.");

  // Check if the button is already added
  if (document.querySelector("#custom-action-button")) {
    console.log("Custom button already exists.");
    return;
  }

  // Select the target node
  var targetNode = document.querySelector("#top-level-buttons-computed");
  console.log("Target node:", targetNode);

  if (targetNode) {
    var customButton = document.createElement("button");
    customButton.innerText = "Summarize Video";
    customButton.id = "custom-action-button";

    // Ensure the button is styled to be visible
    customButton.style.backgroundColor = "red";
    customButton.style.color = "white";
    customButton.style.border = "none";
    customButton.style.padding = "10px 20px";
    customButton.style.margin = "5px";
    customButton.style.cursor = "pointer";
    customButton.style.fontSize = "14px";
    customButton.style.zIndex = "9999";
    customButton.style.border = "1px solid red";
    customButton.style.borderRadius = "15px";

    customButton.onclick = function () {
      console.log(
        "Custom button clicked, sending message to background script."
      );
      const videoUrl = window.location.href;
      chrome.runtime.sendMessage(
        { action: "summarize", videoUrl: videoUrl },
        (response) => {
          console.log("Message sent to background script, response:", response);
        }
      );
    };

    // Append the custom button to the target node
    targetNode.appendChild(customButton);
    console.log("Custom button added.");
    console.log("Custom button HTML:", customButton.outerHTML);

    // Add the "Show Summary" button adjacent to the "Summarize Video" button
    var showSummaryButton = document.createElement("button");
    showSummaryButton.innerText = "Show Summary";
    showSummaryButton.id = "show-summary-button";
    showSummaryButton.style.backgroundColor = "blue";
    showSummaryButton.style.color = "white";
    showSummaryButton.style.border = "none";
    showSummaryButton.style.padding = "10px 20px";
    showSummaryButton.style.margin = "5px";
    showSummaryButton.style.cursor = "pointer";
    showSummaryButton.style.fontSize = "14px";
    showSummaryButton.style.zIndex = "9999";
    showSummaryButton.style.border = "1px solid #ccc";
    showSummaryButton.style.borderRadius = "15px";

    showSummaryButton.onclick = function () {
      console.log("Show Summary button clicked.");
      var summaryContainer = document.querySelector("#summary-container");
      if (summaryContainer) {
        summaryContainer.style.display = "block";
      }
    };

    // Append the "Show Summary" button to the target node
    targetNode.appendChild(showSummaryButton);
    console.log("Show Summary button added.");
    console.log("Show Summary button HTML:", showSummaryButton.outerHTML);
  } else {
    console.error("Target node not found!");
  }
}

// Function to add the summary container
function addSummaryContainer() {
  // Check if the summary container already exists
  if (document.querySelector("#summary-container")) {
    console.log("Summary container already exists.");
    return;
  }

  // Create the summary container
  var summaryContainer = document.createElement("div");
  summaryContainer.id = "summary-container";
  summaryContainer.style.position = "fixed";
  summaryContainer.style.top = "10px";
  summaryContainer.style.right = "10px";
  summaryContainer.style.width = "30%";
  summaryContainer.style.height = "55vh";
  summaryContainer.style.backgroundColor = "#202020"; // Dark background similar to YouTube
  summaryContainer.style.color = "#ffffff"; // White text color
  summaryContainer.style.overflowY = "auto";
  summaryContainer.style.padding = "10px";
  summaryContainer.style.border = "1px solid #ccc";
  summaryContainer.style.borderRadius = "15px"; // Rounded corners
  summaryContainer.style.zIndex = "9999";
  summaryContainer.style.display = "none"; // Initially hide the container

  // Create the close button
  var closeButton = document.createElement("button");
  closeButton.innerHTML = "&times;";
  closeButton.style.position = "absolute";
  closeButton.style.top = "10px";
  closeButton.style.right = "10px";
  closeButton.style.background = "transparent";
  closeButton.style.border = "none";
  closeButton.style.fontSize = "20px";
  closeButton.style.color = "#ffffff"; // White close button color
  closeButton.style.cursor = "pointer";
  summaryContainer.appendChild(closeButton);

  // Add event listener for the close button
  closeButton.addEventListener("click", function () {
    summaryContainer.style.display = "none";
  });

  // Create the summary content area
  var summaryContent = document.createElement("div");
  summaryContent.id = "summary-content";
  summaryContent.style.marginTop = "40px"; // Adjust margin to make room for close button
  summaryContent.style.color = "#ffffff"; // White text color
  summaryContainer.appendChild(summaryContent);

  // Create the chat area
  var chatContainer = document.createElement("div");
  chatContainer.id = "chat-container";
  chatContainer.style.marginTop = "20px";
  chatContainer.style.borderTop = "1px solid #ccc";
  chatContainer.style.paddingTop = "10px";
  chatContainer.style.color = "#000000"; // Black text color for chat messages
  chatContainer.style.backgroundColor = "#f9f9f9"; // Light gray background

  // Chat messages display area
  var chatMessages = document.createElement("div");
  chatMessages.id = "chat-messages";
  chatMessages.style.height = "30vh";
  chatMessages.style.overflowY = "auto";
  chatMessages.style.backgroundColor = "#ffffff"; // White background for messages
  chatMessages.style.padding = "10px";
  chatMessages.style.border = "1px solid #ccc";
  chatContainer.appendChild(chatMessages);

  // Chat input area
  var chatInputContainer = document.createElement("div");
  chatInputContainer.style.display = "flex";
  chatInputContainer.style.marginTop = "10px";

  var chatInput = document.createElement("input");
  chatInput.type = "text";
  chatInput.id = "chat-input";
  chatInput.style.flex = "1";
  chatInput.style.padding = "10px";
  chatInput.style.border = "1px solid #ccc";
  chatInput.style.backgroundColor = "#ffffff"; // White background for input
  chatInput.placeholder = "Type your message...";
  chatInputContainer.appendChild(chatInput);

  var chatSendButton = document.createElement("button");
  chatSendButton.id = "chat-send-button";
  chatSendButton.innerText = "Send";
  chatSendButton.style.padding = "10px";
  chatSendButton.style.border = "1px solid #ccc";
  chatSendButton.style.backgroundColor = "#007bff"; // Blue send button
  chatSendButton.style.color = "#fff"; // White text color
  chatSendButton.style.cursor = "pointer";
  chatInputContainer.appendChild(chatSendButton);

  chatContainer.appendChild(chatInputContainer);
  summaryContainer.appendChild(chatContainer);

  // Append the summary container to the body
  document.body.appendChild(summaryContainer);
  console.log("Summary container added.");

  // Add event listener for chat send button
  chatSendButton.addEventListener("click", function () {
    var message = chatInput.value.trim();
    console.log("User message:", message);

    if (message) {
      addChatMessage("User", message);
      chatInput.value = "";

      const videoUrl = window.location.href;

      // Send user message to background script
      chrome.runtime.sendMessage(
        { action: "userMessage", message: message, videoUrl: videoUrl },
        (response) => {
          console.log("Response from background script:", response);
          if (response) {
            addChatMessage("Bot", response.answer);
          } else {
            addChatMessage("Bot", "Error: No valid response from server.");
          }
        }
      );
    }
  });

  // Event listener for pressing Enter key in chat input
  chatInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      chatSendButton.click(); // Trigger send button click on Enter key press
    }
  });
}

// Function to show the summary in the container
function showSummary(summary) {
  var summaryContent = document.querySelector("#summary-content");
  if (summaryContent) {
    summaryContent.innerHTML = `<h3>Video Summary:</h3><p>${summary}</p>"`;
    var summaryContainer = document.querySelector("#summary-container");
    if (summaryContainer) {
      summaryContainer.style.display = "block";
    }
  }
}

// Function to handle sending messages to background.js
function sendMessageToBackground(message) {
  chrome.runtime.sendMessage(
    { action: "userMessage", message: message },
    (response) => {
      console.log("Message sent to background script:", message);
    }
  );
}

// Function to add a chat message
function addChatMessage(sender, message) {
  var chatMessages = document.querySelector("#chat-messages");
  if (chatMessages) {
    var messageElement = document.createElement("div");
    messageElement.style.marginBottom = "10px";
    if (sender === "User") {
      messageElement.style.textAlign = "right";
    } else {
      messageElement.style.textAlign = "left";
    }
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom
  }
}

// Create an observer to watch for changes in the DOM
const observer = new MutationObserver((mutations, observer) => {
  console.log("MutationObserver callback fired.");
  var targetNode = document.querySelector("#top-level-buttons-computed");
  console.log("Observer checking for target node:", targetNode);
  if (targetNode) {
    addCustomButton();
    addSummaryContainer(); // Add summary container once the button area is available
    observer.disconnect();
  }
});

// Start observing the document for changes
observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// Function to send user questions to backend and display response in summary box and chat
function sendQuestionToBackend(question) {
  fetch("http://localhost:3000/question", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question: question }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); // Parse response JSON
    })
    .then((data) => {
      console.log("Response from backend:", data);
      if (data && data.answer) {
        showSummary(data.answer); // Display answer in the summary box
        addChatMessage("Bot", data.answer); // Display bot's response in chat
      } else {
        throw new Error("Invalid response format from backend");
      }
    })
    .catch((error) => {
      console.error("Error sending question:", error.message);
      addChatMessage(
        "Bot",
        "Sorry, I couldn't process your question right now."
      );
    });
}

// Event listener for chat send button
var chatSendButton = document.getElementById("chat-send-button");
if (chatSendButton) {
  chatSendButton.addEventListener("click", function () {
    var message = document.getElementById("chat-input").value.trim();
    if (message) {
      addChatMessage("User", message); // Display user's message in chat
      sendMessageToBackground(message); // Send message to background.js
      sendQuestionToBackend(message); // Send question to backend API
      document.getElementById("chat-input").value = ""; // Clear input field
    }
  });
}

// Event listener for pressing Enter key in chat input
var chatInput = document.getElementById("chat-input");
if (chatInput) {
  chatInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      chatSendButton.click(); // Trigger send button click on Enter key press
    }
  });
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received from background script:", request);
  if (request.action === "displaySummary") {
    // Display the summary in the container
    showSummary(request.summary);

    // Ensure sendResponse is called synchronously
    sendResponse({ status: "success" });
    return true; // Return true to indicate you will respond asynchronously
  }
});

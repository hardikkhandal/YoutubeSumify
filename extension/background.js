chrome.runtime.onInstalled.addListener(() => {
  console.log("YouTube Enhancer extension installed.");
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received in background script:", request);

  // Handle different actions from content script
  if (request.action === "summarize") {
    console.log("Sending request to backend server for summarization.");

    // Send POST request to backend for summarization
    fetch("http://localhost:3000/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoUrl: request.videoUrl }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Response from backend server:", data);
        // Send the summary back to the content script
        chrome.tabs.sendMessage(
          sender.tab.id,
          { action: "displaySummary", summary: data.summary },
          (response) => {
            console.log("Summary sent to content script, response:", response);
          }
        );
      })
      .catch((error) => {
        console.error("Error:", error);
        sendResponse({ status: "error", message: error.message });
      });

    // return true; // Indicate that the response is sent asynchronously
  }
  if (request.action === "userMessage") {
    console.log(
      "Sending request to backend server for user message processing."
    );

    // Forward user's message to your backend for processing
    fetch("http://localhost:3000/question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "userMessage", // Identify as a user message
        message: request.message,
        videoUrl: request.videoUrl,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Response from backend for user message:", data);
        sendResponse(data); // Send response back to content script
      })
      .catch((error) => {
        console.error("Error sending user message to backend:", error);
        sendResponse({ status: "error", message: error.message });
      });

    return true; // Indicate that the response will be sent asynchronously
  }
});

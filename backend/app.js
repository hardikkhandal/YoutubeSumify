const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");
const { getTranscript } = require("youtube-transcript-api");
const Groq = require("groq-sdk");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Initialize Groq SDK with your API key
const groq = new Groq({
  apiKey: "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",
});

// Your existing routes...

// Route for generating text using Groq
app.post("/api/generate", async (req, res) => {
  const { model, prompt } = req.body;
  console.log("Received request to generate text:", { model, prompt });

  try {
    // Call Groq API to generate text
    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: model,
    });

    console.log("Response from Groq service:", response);

    // Extract the generated text from the response
    const generatedText = response.choices[0]?.message?.content || "";

    // Send the extracted generated text back to the client
    res.json({ generatedText: generatedText.trim() });
  } catch (error) {
    console.error("Error calling the Groq API:", error.message);
    res
      .status(500)
      .json({ error: "Failed to predict output", details: error.message });
  }
});

// Route for summarizing a video (using Groq for example purposes)
app.post("/summarize", async (req, res) => {
  console.log("Request body:", req.body);
  const { videoUrl } = req.body;
  console.log("Request received to summarize video:", videoUrl);
  const videoId = extractVideoId(videoUrl);
  // Simulate prompt creation for Groq (adjust as per your application's logic)
  // Get transcript for the video using YouTube Transcript API with custom timeout and IPv4
  const transcript = await getTranscript(videoId, { timeout: 60000 }); // 10 seconds timeout
  const transcriptText = transcript.map((entry) => entry.text).join(" ");
  console.log("Fetched transcript:", transcriptText);

  // Generate a prompt for LLM using the transcript text
  const prompt = `Summarize the video at the following URL: ${videoUrl}. Transcript: ${transcriptText} in few words`;

  // const prompt = "Summarize the video content";

  try {
    // Call Groq API to generate summary
    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-8b-8192", // Example model
    });

    console.log("Response from Groq service:", response);

    // Extract generated summary text from Groq response
    const summary = response.choices[0]?.message?.content || "";

    // Send the extracted generated summary back to the client
    res.json({ summary: summary.trim() });
  } catch (error) {
    console.error("Error summarizing video:", error.message);
    res.status(500).json({ error: "Failed to summarize video" });
  }
});

// Route for handling user questions using Groq
app.post("/question", async (req, res) => {
  const { message, videoUrl } = req.body;

  console.log("Received question:", message);

  try {
    const videoId = extractVideoId(videoUrl);
    const transcript = await getTranscript(videoId, { timeout: 60000 }); // 10 seconds timeout
    const transcriptText = transcript.map((entry) => entry.text).join(" ");
    // Create prompt for Groq
    const prompt = `Answer the following question: ${message} from the youtube url ${videoUrl} and having transcript ${transcriptText} also response should be like a bot user should not know that you know the transcript and videoUrl `;

    // Call Groq API to generate answer
    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-8b-8192", // Example model
    });

    console.log("Response from Groq service:", response);

    // Extract generated answer text from Groq response
    const answer = response.choices[0]?.message?.content || "";

    // Send the generated answer back to the client
    console.log(answer);
    res.json({ answer: answer.trim() });
  } catch (error) {
    console.error("Error generating answer:", error.message);
    res.status(500).json({ error: "Failed to generate answer" });
  }
});
// Helper function to extract video ID from YouTube URL (unchanged)
function extractVideoId(url) {
  const videoId = url.split("v=")[1];
  if (!videoId) {
    throw new Error("Invalid YouTube URL. Unable to extract video ID.");
  }
  const ampersandPosition = videoId.indexOf("&");
  if (ampersandPosition !== -1) {
    return videoId.substring(0, ampersandPosition);
  }
  return videoId;
}

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

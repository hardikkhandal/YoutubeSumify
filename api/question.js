const { getTranscript } = require("youtube-transcript-api");
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: "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",
});

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

module.exports = async (req, res) => {
  const { message, videoUrl } = req.body;
  console.log("Received question:", message);

  try {
    const videoId = extractVideoId(videoUrl);
    const transcript = await getTranscript(videoId, { timeout: 60000 });
    const transcriptText = transcript.map((entry) => entry.text).join(" ");
    const prompt = `Answer the following question: ${message} from the youtube url ${videoUrl} and having transcript ${transcriptText} also response should be like a bot user should not know that you know the transcript and videoUrl`;

    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-8b-8192",
    });

    console.log("Response from Groq service:", response);
    const answer = response.choices[0]?.message?.content || "";

    res.json({ answer: answer.trim() });
  } catch (error) {
    console.error("Error generating answer:", error.message);
    res.status(500).json({ error: "Failed to generate answer" });
  }
};

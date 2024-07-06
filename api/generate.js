const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: "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",
});

module.exports = async (req, res) => {
  const { model, prompt } = req.body;
  console.log("Received request to generate text:", { model, prompt });

  try {
    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: model,
    });

    console.log("Response from Groq service:", response);
    const generatedText = response.choices[0]?.message?.content || "";

    res.json({ generatedText: generatedText.trim() });
  } catch (error) {
    console.error("Error calling the Groq API:", error.message);
    res
      .status(500)
      .json({ error: "Failed to predict output", details: error.message });
  }
};

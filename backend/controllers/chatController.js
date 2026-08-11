const axios = require("axios");

const handleChat = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ reply: "Please provide a message." });
    }

    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ reply: "Mistral API key not configured on server." });
    }

    // Call Mistral API
    const response = await axios.post(
      "https://api.mistral.ai/v1/chat/completions",
      {
        model: "mistral-tiny",
        messages: [
          { role: "system", content: "You are a helpful and friendly food ordering assistant for FoodieHub. You help users find food, track orders, and recommend dishes. Keep responses short and conversational." },
          { role: "user", content: message }
        ],
        max_tokens: 150
      },
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    res.status(200).json({ reply });

  } catch (error) {
    console.error("Chatbot Error:", error?.response?.data || error.message);
    res.status(500).json({ reply: "Sorry, I am having trouble connecting to my brain right now." });
  }
};

module.exports = { handleChat };

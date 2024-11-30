const debug = require("debug")("development:mongoose");
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

const apiKey = "AIzaSyBPS0_ro3eq-wFeNq7XP_oXLXLMf0JFHmI";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run(prompt) {
  try {
    const chatSession = model.startChat({ generationConfig, history: [] });
    const result = await chatSession.sendMessage(prompt);
    const responseText = await result.response.text();

    const isATSPrompt = /Please provide/.test(responseText);
    // debug(`${responseText} response return`);
    
    return { responseText, AIError: isATSPrompt };
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw error;  
  }
}

module.exports = run;

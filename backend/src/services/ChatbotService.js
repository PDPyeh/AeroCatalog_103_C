const axios = require('axios');

// LM Studio API configuration
const LM_STUDIO_URL = 'http://localhost:1234/v1';

class ChatbotService {
  // Send message to LM Studio
  static async sendMessage(messages) {
    try {
      const response = await axios.post(`${LM_STUDIO_URL}/chat/completions`, {
        model: 'local-model',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1024,
        stream: false,
      });

      return {
        success: true,
        content: response.data.choices[0].message.content,
        tokens: response.data.usage.completion_tokens || 0,
      };
    } catch (error) {
      console.error('LM Studio Error:', error.message);
      return {
        success: false,
        error: 'Failed to get response from chatbot. Make sure LM Studio is running.',
      };
    }
  }

  // Build conversation history for context
  static buildMessages(previousMessages, userMessage) {
    const messages = [
      {
        role: 'system',
        content: `You are AeroCatalog Assistant, a specialized aviation knowledge expert.

STRICT RULES - YOU MUST FOLLOW THESE:
1. ONLY answer questions STRICTLY related to aviation topics:
   - Aircraft types, specifications, performance, models (Boeing, Airbus, Bombardier, Embraer, etc.)
   - Aviation regulations, safety procedures, maintenance standards, certifications
   - Airlines, airports, air traffic control, navigation systems
   - Avionics, engines, aircraft systems, aerodynamics, structures
   - Flight operations, crew training, pilot procedures, crew resource management
   - Aerospace engineering, design, manufacturing
   - Aviation history, famous aircraft, aviation accidents (for learning)
   - Tickets, bookings, routes are aviation-related - OK to answer

2. ABSOLUTELY REJECT any non-aviation questions:
   - Politics, religion, ideology, conspiracy theories
   - Medical, legal, financial advice
   - Entertainment, sports, cooking, relationships, hobbies
   - Current events unrelated to aviation
   - Science unrelated to aviation

3. Response for off-topic questions:
   "I'm designed specifically for aviation topics. Please ask me about aircraft, airlines, airports, aviation regulations, or other aviation-related subjects."

4. SUPPORT ALL LANGUAGES - respond in the user's language automatically

5. If you're unsure whether something is aviation-related, REJECT IT and redirect.
   Example: "Is that aviation-related? I only answer aviation questions."

6. Be factual, accurate, and concise.`,
      },
    ];

    messages.push(
      ...previousMessages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    );w

    messages.push({
      role: 'user',
      content: userMessage,
    });

    return messages;
  }
}

module.exports = ChatbotService;

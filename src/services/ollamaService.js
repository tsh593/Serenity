// src/services/ollamaService.js
class OllamaService {
  constructor() {
    this.baseURL = 'http://localhost:11434/api';
    this.isConnected = false;
  }

  async checkConnection() {
    try {
      const response = await fetch(`${this.baseURL}/tags`);
      this.isConnected = response.ok;
      return this.isConnected;
    } catch (error) {
      this.isConnected = false;
      return false;
    }
  }

  async getModels() {
    try {
      const response = await fetch(`${this.baseURL}/tags`);
      if (response.ok) {
        const data = await response.json();
        return data.models || [];
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch models:', error);
      return [];
    }
  }

  async chat(model, messages, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          stream: false,
          options: {
            temperature: options.temperature || 0.7,
            top_p: options.top_p || 0.9,
            top_k: options.top_k || 40,
            repeat_penalty: options.repeat_penalty || 1.1,
            ...options
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = await response.json();
      return data.message.content;
    } catch (error) {
      console.error('Ollama chat failed:', error);
      throw error;
    }
  }

  async generate(model, prompt, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          prompt: prompt,
          stream: false,
          options: {
            temperature: options.temperature || 0.7,
            top_p: options.top_p || 0.9,
            top_k: options.top_k || 40,
            repeat_penalty: options.repeat_penalty || 1.1,
            ...options
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Ollama generate failed:', error);
      throw error;
    }
  }
}

export default new OllamaService();
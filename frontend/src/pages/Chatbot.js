import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MessageContent from '../components/MessageContent';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/';

function Chatbot() {
  // eslint-disable-next-line no-unused-vars
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  
  // API Key State
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);
  const [apiKeyError, setApiKeyError] = useState('');
  const [apiKeyValidating, setApiKeyValidating] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [maxSessions, setMaxSessions] = useState(5);

  // Chat State
  const [currentSession, setCurrentSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessions, setSessions] = useState([]);
  const messagesEndRef = useRef(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  // Validate API Key
  const handleValidateApiKey = async () => {
    if (!apiKey.trim()) {
      setApiKeyError('Please enter an API key');
      return;
    }

    setApiKeyValidating(true);
    setApiKeyError('');

    try {
      // Test API key by fetching sessions
      const response = await axios.get(`${API_URL}/chatbot/sessions`, {
        headers: { 'x-api-key': apiKey },
      });

      setShowApiKeyInput(false);
      setSessions(response.data.sessions || []);
      setSessionCount(response.data.sessions?.length || 0);
      setMaxSessions(response.data.maxSessions || 5);
    } catch (err) {
      setApiKeyError(
        err.response?.data?.message || 'Invalid API key. Please try again.'
      );
    } finally {
      setApiKeyValidating(false);
    }
  };

  // Load chat sessions
  // eslint-disable-next-line no-unused-vars
  const loadSessions = async () => {
    try {
      const response = await axios.get(`${API_URL}/chatbot/sessions`, {
        headers: { 'x-api-key': apiKey },
      });
      setSessions(response.data.sessions || []);
      setSessionCount(response.data.sessions?.length || 0);
    } catch (err) {
      console.error('Failed to load sessions:', err);
    }
  };

  // Create new session
  const handleNewChat = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/chatbot/sessions`,
        { title: 'New Chat' },
        {
          headers: { 'x-api-key': apiKey },
        }
      );

      const newSession = response.data.session;
      setCurrentSession(newSession);
      setMessages([]);
      setSessions([newSession, ...sessions]);
      setSessionCount(prev => prev + 1);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to create new chat'
      );
    }
  };

  // Load session messages
  const handleLoadSession = async (sessionId) => {
    try {
      const response = await axios.get(`${API_URL}/chatbot/sessions/${sessionId}/messages`, {
        headers: { 'x-api-key': apiKey },
      });

      setCurrentSession(sessions.find((s) => s.id === sessionId));
      setMessages(response.data.messages || []);
      setError('');
    } catch (err) {
      setError('Failed to load chat messages');
    }
  };

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim() || !currentSession) return;

    const userMessage = { role: 'user', content: inputMessage };
    setMessages([...messages, userMessage]);
    setInputMessage('');
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${API_URL}/chatbot/chat`,
        {
          sessionId: currentSession.id,
          message: inputMessage,
        },
        {
          headers: { 'x-api-key': apiKey },
        }
      );

      const assistantMessage = {
        role: 'assistant',
        content: response.data.assistantMessage.content,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to get response from chatbot'
      );
      // Remove the user message if it failed
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isAuthenticated) {
    return null;
  }

  // API Key Input Screen
  if (showApiKeyInput) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Chatbot Access</h1>
            <p className="text-lg text-gray-600">Enter your API key to access the chatbot</p>
          </div>

          {apiKeyError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-base">
              {apiKeyError}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-base">
                API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              />
            </div>

            <button
              onClick={handleValidateApiKey}
              disabled={apiKeyValidating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 text-base"
            >
              {apiKeyValidating ? 'Validating...' : 'Access Chatbot'}
            </button>
          </div>

          <p className="text-base text-gray-500 mt-6 text-center">
            Don't have an API key? Ask your administrator to generate one.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 space-y-2">
          <button
            onClick={handleNewChat}
            disabled={sessionCount >= maxSessions}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>+ New Chat</span>
          </button>
          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
            <div>Chats: {sessionCount}/{maxSessions}</div>
            {sessionCount >= maxSessions && (
              <div className="text-red-600 mt-1">Limit reached! Delete a chat to create more.</div>
            )}
          </div>
          <button
            onClick={() => {
              setShowApiKeyInput(true);
              setApiKey('');
              setSessions([]);
              setCurrentSession(null);
              setMessages([]);
            }}
            className="w-full text-sm text-gray-600 hover:text-gray-800 py-2"
          >
            Change API Key
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => handleLoadSession(session.id)}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${
                currentSession?.id === session.id
                  ? 'bg-blue-100 text-blue-900 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="truncate text-sm">{session.title}</div>
              <div className="text-xs text-gray-500">
                {new Date(session.createdAt).toLocaleDateString()}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        {currentSession ? (
          <div className="bg-white border-b border-gray-200 p-5">
            <h1 className="text-2xl font-bold text-gray-800">{currentSession.title}</h1>
            <p className="text-base text-gray-600 mt-1">
              Chatbot powered by Qwen 3 4B
            </p>
          </div>
        ) : (
          <div className="bg-white border-b border-gray-200 p-5 flex items-center justify-center">
            <p className="text-lg text-gray-600">Select a chat or create a new one to start</p>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-gray-50">
          {messages.length === 0 && currentSession && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <p className="text-2xl font-semibold mb-2">Start a conversation</p>
                <p className="text-lg">Type your message below to begin chatting</p>
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-2xl px-5 py-4 rounded-lg shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                }`}
              >
                <MessageContent content={msg.content} isUser={msg.role === 'user'} />
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 border border-gray-200 px-4 py-3 rounded-lg rounded-bl-none">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-center">
              <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-lg text-base">
                {error}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {currentSession && (
          <div className="bg-white border-t border-gray-200 p-5">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={loading}
                className="flex-1 px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-base"
              />
              <button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition disabled:opacity-50 text-base"
              >
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chatbot;

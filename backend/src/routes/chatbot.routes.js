const express = require('express');
const { ChatSession, ChatMessage, User } = require('../models');
const ChatbotService = require('../services/ChatbotService');
const { apiKeyAuth } = require('../middleware/apiKeyAuth');
const router = express.Router();

// Create a new chat session
router.post('/sessions', apiKeyAuth, async (req, res, next) => {
  try {
    const { title } = req.body;
    
    // Check if user has reached max sessions limit (5 per API key)
    const sessionCount = await ChatSession.count({
      where: { userId: req.user.id },
    });

    if (sessionCount >= 5) {
      return res.status(400).json({
        success: false,
        message: 'You have reached the maximum limit of 5 chat sessions per API key. Delete some sessions to create new ones.',
        currentCount: sessionCount,
        maxLimit: 5,
      });
    }

    const session = await ChatSession.create({
      userId: req.user.id,
      title: title || 'New Chat',
    });

    res.status(201).json({
      success: true,
      session,
    });
  } catch (error) {
    next(error);
  }
});

// Get user's chat sessions
router.get('/sessions', apiKeyAuth, async (req, res, next) => {
  try {
    const sessions = await ChatSession.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      sessions,
      sessionCount: sessions.length,
      maxSessions: 5,
    });
  } catch (error) {
    next(error);
  }
});

// Get chat messages for a session
router.get('/sessions/:sessionId/messages', apiKeyAuth, async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const session = await ChatSession.findOne({
      where: { id: sessionId, userId: req.user.id },
      include: {
        association: 'messages',
        attributes: ['id', 'role', 'content', 'createdAt'],
      },
    });

    if (!session) {
      return res.status(404).json({ message: 'Chat session not found' });
    }

    res.json({
      success: true,
      messages: session.messages,
    });
  } catch (error) {
    next(error);
  }
});

// Send message to chatbot
router.post('/chat', apiKeyAuth, async (req, res, next) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({ message: 'sessionId and message are required' });
    }

    // Verify session belongs to user
    const session = await ChatSession.findOne({
      where: { id: sessionId, userId: req.user.id },
    });

    if (!session) {
      return res.status(404).json({ message: 'Chat session not found' });
    }

    // Get previous messages for context
    const previousMessages = await ChatMessage.findAll({
      where: { sessionId },
      attributes: ['role', 'content'],
      order: [['createdAt', 'ASC']],
    });

    // Build messages array for LM Studio
    const messages = ChatbotService.buildMessages(previousMessages, message);

    // Get response from LM Studio
    const response = await ChatbotService.sendMessage(messages);

    if (!response.success) {
      return res.status(500).json({
        success: false,
        message: response.error,
      });
    }

    // Save user message
    const userMsg = await ChatMessage.create({
      sessionId,
      role: 'user',
      content: message,
    });

    // Save assistant response
    const assistantMsg = await ChatMessage.create({
      sessionId,
      role: 'assistant',
      content: response.content,
      tokens: response.tokens,
    });

    // Update session title if first message
    if (previousMessages.length === 0) {
      const titlePreview = message.substring(0, 50);
      await session.update({ title: titlePreview });
    }

    res.json({
      success: true,
      userMessage: userMsg,
      assistantMessage: assistantMsg,
    });
  } catch (error) {
    next(error);
  }
});

// Delete chat session
router.delete('/sessions/:sessionId', apiKeyAuth, async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const session = await ChatSession.findOne({
      where: { id: sessionId, userId: req.user.id },
    });

    if (!session) {
      return res.status(404).json({ message: 'Chat session not found' });
    }

    // Delete all messages first
    await ChatMessage.destroy({ where: { sessionId } });

    // Delete session
    await session.destroy();

    res.json({
      success: true,
      message: 'Chat session deleted',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

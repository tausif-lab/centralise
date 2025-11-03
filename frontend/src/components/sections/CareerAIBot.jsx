// src/components/sections/CareerAIBot.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, StopCircle, RefreshCw, Download } from 'lucide-react';
import '../../styles/sections/career-bot.css';

const CareerAIBot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hello! I\'m your Career AI Assistant. I can help you with career guidance, skill suggestions, and personalized recommendations. What would you like to know about?'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [suggestions, setSuggestions] = useState({
    skills: ['React', 'Node.js', 'TypeScript', 'System Design', 'Docker'],
    careers: [
      { title: 'Senior Frontend Developer', match: '92%' },
      { title: 'Full Stack Developer', match: '88%' },
      { title: 'Tech Lead', match: '85%' }
    ],
    courses: [
      { name: 'Advanced React Patterns', provider: 'Frontend Masters', duration: '12 weeks' },
      { name: 'Microservices Architecture', provider: 'Udemy', duration: '8 weeks' }
    ]
  });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const userMessage = {
        id: messages.length + 1,
        type: 'user',
        text: inputValue
      };
      
      setMessages([...messages, userMessage]);
      setInputValue('');

      // Simulate bot response
      setTimeout(() => {
        const botMessage = {
          id: messages.length + 2,
          type: 'bot',
          text: generateBotResponse(inputValue)
        };
        setMessages(prev => [...prev, botMessage]);
      }, 800);
    }
  };

  const generateBotResponse = (query) => {
    const responses = [
      'Based on your profile, I recommend focusing on advanced React patterns and system design. These will help you transition to a Senior Developer role.',
      'Your skills are strong! Consider exploring microservices and cloud technologies like Docker and Kubernetes to stay competitive.',
      'I see you have experience with web development. Have you considered specializing in either backend development or DevOps?',
      'Your CGPA and projects are impressive! You\'re well-positioned for internships at top tech companies.',
      'I recommend taking courses on system design and distributed systems to strengthen your fundamentals.'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
  };

  const handleClearChat = () => {
    setMessages([{
      id: 1,
      type: 'bot',
      text: 'Hello! I\'m your Career AI Assistant. I can help you with career guidance, skill suggestions, and personalized recommendations. What would you like to know about?'
    }]);
  };

  return (
    <div className="career-bot-section">
      <div className="section-header">
        <h2>Career AI Assistant</h2>
        <p>Get personalized career guidance and skill recommendations</p>
      </div>

      <div className="bot-tabs">
        <button
          className={`tab ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          💬 Chat
        </button>
        <button
          className={`tab ${activeTab === 'suggestions' ? 'active' : ''}`}
          onClick={() => setActiveTab('suggestions')}
        >
          ⭐ Suggestions
        </button>
      </div>

      {activeTab === 'chat' && (
        <div className="chat-container">
          <div className="messages-area">
            {messages.map(message => (
              <div key={message.id} className={`message ${message.type}`}>
                <div className={`message-content ${message.type}`}>
                  {message.type === 'bot' && (
                    <div className="bot-avatar">🤖</div>
                  )}
                  <p>{message.text}</p>
                  {message.type === 'user' && (
                    <div className="user-avatar">You</div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            <div className="input-wrapper">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me about careers, skills, or growth opportunities..."
              />
              <button 
                className={`voice-btn ${isListening ? 'active' : ''}`}
                onClick={handleVoiceInput}
              >
                {isListening ? <StopCircle size={20} /> : <Mic size={20} />}
              </button>
              <button className="send-btn" onClick={handleSendMessage}>
                <Send size={20} />
              </button>
            </div>
            <div className="chat-actions">
              <button className="clear-btn" onClick={handleClearChat}>
                <RefreshCw size={16} />
                Clear Chat
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'suggestions' && (
        <div className="suggestions-container">
          <div className="suggestion-section">
            <h3>🎯 Recommended Skills</h3>
            <div className="skills-grid">
              {suggestions.skills.map((skill, idx) => (
                <div key={idx} className="skill-item">
                  <span className="skill-badge">{skill}</span>
                  <button className="learn-btn">Learn</button>
                </div>
              ))}
            </div>
          </div>

          <div className="suggestion-section">
            <h3>💼 Career Paths</h3>
            <div className="careers-list">
              {suggestions.careers.map((career, idx) => (
                <div key={idx} className="career-item">
                  <div className="career-info">
                    <h4>{career.title}</h4>
                    <div className="match-bar">
                      <div className="match-fill" style={{width: career.match}}></div>
                    </div>
                  </div>
                  <span className="match-percentage">{career.match}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="suggestion-section">
            <h3>📚 Recommended Courses</h3>
            <div className="courses-list">
              {suggestions.courses.map((course, idx) => (
                <div key={idx} className="course-item">
                  <div className="course-header">
                    <h4>{course.name}</h4>
                    <span className="provider">{course.provider}</span>
                  </div>
                  <p className="duration">⏱️ {course.duration}</p>
                  <button className="enroll-btn">
                    <Download size={16} />
                    Enroll Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerAIBot;
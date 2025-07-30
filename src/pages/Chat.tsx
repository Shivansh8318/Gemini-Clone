import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { 
  Menu, 
  Search,
  Plus,
  Copy, 
  RefreshCw,
  Sparkles,
  Mic,
  Image,
  Settings,
  ChevronDown,
  Moon,
  Sun
} from 'lucide-react'
import { useStore } from '../store/useStore'

// Typing indicator component
const TypingIndicator = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <div className="flex items-start space-x-3 mb-6">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 via-blue-500 to-blue-600 flex items-center justify-center shadow-md">
      <Sparkles className="w-4 h-4 text-white" />
    </div>
    <div className="flex-1">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-2xl px-4 py-3 max-w-fit`}>
        <div className="flex items-center space-x-1">
          <div className={`typing-dot ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'}`} style={{ '--delay': 0 } as any}></div>
          <div className={`typing-dot ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'}`} style={{ '--delay': 1 } as any}></div>
          <div className={`typing-dot ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'}`} style={{ '--delay': 2 } as any}></div>
        </div>
      </div>
      <div className="mt-2">
        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-medium`}>Gemini is thinking...</span>
      </div>
    </div>
  </div>
)

// Message component - This component needs access to isDarkMode
const MessageBubble = ({ message, onCopy, isDarkMode }: { message: any, onCopy: (text: string) => void, isDarkMode: boolean }) => {
  const [showCopy, setShowCopy] = useState(false)

  const formatTime = (date: Date | string) => {
    const targetDate = date instanceof Date ? date : new Date(date)
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(targetDate)
  }

  return (
    <div
      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-6 group`}
      onMouseEnter={() => setShowCopy(true)}
      onMouseLeave={() => setShowCopy(false)}
    >
      <div className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl relative ${message.isUser ? '' : 'flex items-start space-x-3'}`}>
        {/* Gemini Avatar */}
        {!message.isUser && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 via-blue-500 to-blue-600 flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        )}
        
        <div className={message.isUser ? '' : 'flex-1'}>
          <div
            className={`rounded-3xl px-5 py-3 ${
              message.isUser
                ? isDarkMode 
                  ? 'bg-gray-700 text-white border border-gray-600 shadow-sm'
                  : 'bg-gray-200 text-gray-900 border border-gray-300 shadow-sm'
                : isDarkMode
                  ? 'bg-transparent text-white'
                  : 'bg-transparent text-gray-900'
            } chat-message`}
          >
            {message.image && (
              <div className="mb-3">
                <img
                  src={message.image}
                  alt="Uploaded"
                  className="rounded-2xl max-w-full h-auto shadow-md"
                  style={{ maxHeight: '300px' }}
                />
              </div>
            )}
            <div className={`${!message.isUser ? isDarkMode ? 'prose prose-invert max-w-none' : 'prose prose-gray max-w-none' : ''}`}>
              <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed m-0">
                {message.content}
              </p>
            </div>
          </div>
          
          <div className={`flex items-center mt-2 space-x-2 ${message.isUser ? 'justify-end' : 'justify-start'}`}>
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-medium`}>
              {formatTime(message.timestamp)}
            </span>
            {showCopy && (
              <button
                onClick={() => onCopy(message.content)}
                className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                title="Copy message"
              >
                <Copy className={`w-3.5 h-3.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}



export default function Chat() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true)

  const {
    user,
    chatrooms,
    addMessage,
    setCurrentChatroom,
    isTyping,
    setIsTyping,
    loadMoreMessages,
    isDarkMode,
    toggleDarkMode,
  } = useStore()

  const currentChatroom = chatrooms.find(room => room.id === id)

  const scrollToBottom = useCallback(() => {
    if (shouldScrollToBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [shouldScrollToBottom])

  useEffect(() => {
    scrollToBottom()
  }, [currentChatroom?.messages, scrollToBottom])

  // AI response simulation with throttling
  const simulateAIResponse = useCallback((userMessage: string) => {
    setIsTyping(true)
    
    // Simulate AI thinking time (2-4 seconds)
    const thinkingTime = Math.random() * 2000 + 2000
    
    setTimeout(() => {
      setIsTyping(false)
      
      // Generate AI response based on user message
      let aiResponse = ''
      const lowerMessage = userMessage.toLowerCase()
      
      if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        aiResponse = "Hello! I'm Gemini, your AI assistant. How can I help you today?"
      } else if (lowerMessage.includes('weather')) {
        aiResponse = "I'd be happy to help with weather information! However, I don't have access to real-time weather data in this demo. You can check your local weather service for current conditions."
      } else if (lowerMessage.includes('code') || lowerMessage.includes('programming')) {
        aiResponse = "I'd love to help you with coding! Whether you need help with debugging, learning new concepts, or writing code, feel free to ask me specific questions."
      } else if (lowerMessage.includes('image') || lowerMessage.includes('photo')) {
        aiResponse = "I can see you mentioned images! I can help analyze and discuss images you share with me. Feel free to upload an image using the image button."
      } else {
        const responses = [
          "That's an interesting point! Can you tell me more about what you're thinking?",
          "I understand what you're saying. Here's my perspective on that...",
          "Thanks for sharing that with me. Let me help you explore this further.",
          "That's a great question! Let me break this down for you.",
          "I appreciate you bringing this up. Here's what I think about it...",
        ]
        aiResponse = responses[Math.floor(Math.random() * responses.length)]
      }
      
      if (id) {
        addMessage(id, aiResponse, false)
      }
    }, thinkingTime)
  }, [id, addMessage, setIsTyping])

  const handleSendMessage = () => {
    if ((!message.trim() && !selectedImage) || !id) return

    const messageContent = message.trim() || (selectedImage ? '[Image]' : '')
    
    // Add user message
    addMessage(id, messageContent, true, selectedImage || undefined)
    
    // Clear form
    setMessage('')
    setSelectedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    // Simulate AI response
    simulateAIResponse(messageContent)
    
    toast.success('Message sent!')
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size must be less than 5MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Message copied to clipboard!')
    }).catch(() => {
      toast.error('Failed to copy message')
    })
  }

  const handleLoadMore = () => {
    if (id && !isLoadingMore) {
      setIsLoadingMore(true)
      setShouldScrollToBottom(false)
      
      setTimeout(() => {
        loadMoreMessages(id)
        setIsLoadingMore(false)
      }, 1000) // Simulate loading delay
    }
  }

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
      const isAtBottom = scrollHeight - scrollTop === clientHeight
      setShouldScrollToBottom(isAtBottom)
      
      // Load more messages when scrolled to top
      if (scrollTop === 0 && !isLoadingMore) {
        handleLoadMore()
      }
    }
  }

  if (!currentChatroom) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Chatroom not found
          </h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const handleNewChat = () => {
    navigate('/chat')
  }

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-200 ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'} border-r flex flex-col overflow-hidden`}>
        {/* Sidebar Header */}
        <div className={`p-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'} rounded-lg transition-colors`}
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={toggleDarkMode}
              className={`p-2 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'} rounded-lg transition-colors`}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-yellow-500" />
              ) : (
                <Moon className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </div>
          
          <div className="flex items-center space-x-2 mb-4">
            <h1 className="text-xl font-normal">Gemini</h1>
            <div className={`flex items-center space-x-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <span>2.5 Pro</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className={`w-full flex items-center space-x-3 p-3 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'} rounded-lg transition-colors text-left`}
          >
            <Plus className="w-5 h-5" />
            <span>New chat</span>
          </button>
        </div>

        {/* Recent Chats */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h2 className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>Recent</h2>
            <div className="space-y-1">
              {chatrooms.map((chatroom) => (
                <button
                  key={chatroom.id}
                  onClick={() => {
                    setCurrentChatroom(chatroom.id)
                    navigate(`/chat/${chatroom.id}`)
                  }}
                  className={`w-full text-left p-3 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'} transition-colors ${
                    currentChatroom?.id === chatroom.id 
                      ? isDarkMode ? 'bg-gray-800' : 'bg-gray-200' 
                      : ''
                  }`}
                >
                  <div className="text-sm truncate">{chatroom.title}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className={`p-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-t`}>
          <button className={`w-full flex items-center space-x-3 p-3 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'} rounded-lg transition-colors text-left`}>
            <Settings className="w-5 h-5" />
            <span>Settings and help</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <div className={`h-16 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-b flex items-center justify-between px-6`}>
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className={`p-2 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'} rounded-lg transition-colors`}
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          
          <div className="flex items-center space-x-4 ml-auto">
            <button className={`p-2 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'} rounded-lg transition-colors`}>
              <Search className="w-5 h-5" />
            </button>
            <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors text-white">
              <Sparkles className="w-4 h-4" />
              <span>Upgrade</span>
            </button>
            <div className={`w-8 h-8 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded-full flex items-center justify-center`}>
              <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>{user?.phone?.slice(-1) || 'U'}</span>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages or Welcome */}
          <div className="flex-1 overflow-y-auto" ref={messagesContainerRef} onScroll={handleScroll}>
            {!currentChatroom || currentChatroom.messages.length === 0 ? (
              // Welcome Screen
              <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto px-6">
                <h1 className="text-4xl font-normal mb-12 text-blue-500">
                  Hello, {user?.phone ? user.phone.split(' ')[1] || 'User' : 'Shivansh'}
                </h1>
              </div>
            ) : (
              // Messages
              <div className="max-w-4xl mx-auto w-full px-6 py-8">
                {/* Load more indicator */}
                {isLoadingMore && (
                  <div className="flex justify-center mb-4">
                    <div className={`flex items-center space-x-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Loading more messages...</span>
                    </div>
                  </div>
                )}

                {currentChatroom.messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    onCopy={handleCopyMessage}
                    isDarkMode={isDarkMode}
                  />
                ))}

                {/* Typing indicator */}
                {isTyping && <TypingIndicator isDarkMode={isDarkMode} />}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6">
            {/* Image preview */}
            {selectedImage && (
              <div className="mb-4 max-w-4xl mx-auto">
                <div className="relative inline-block">
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className={`rounded-2xl max-h-32 border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className={`absolute -top-2 -right-2 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-800 hover:bg-gray-700'} text-white rounded-full w-6 h-6 flex items-center justify-center text-sm transition-colors`}
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            <div className="max-w-4xl mx-auto">
              <div className={`relative ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-100 border-gray-300'} rounded-3xl border p-4`}>
                <div className="flex items-end space-x-3">
                  {/* Plus Button */}
                  <button className={`p-2 ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'} rounded-full transition-colors`}>
                    <Plus className="w-5 h-5" />
                  </button>

                  {/* Text Input */}
                  <div className="flex-1 min-w-0">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                      placeholder="Ask Gemini"
                      rows={1}
                      className={`w-full bg-transparent ${isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'} border-0 focus:ring-0 focus:outline-none resize-none text-base`}
                      style={{ minHeight: '24px', maxHeight: '120px' }}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className={`flex items-center space-x-1 p-2 ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'} rounded-lg transition-colors`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 19l3.5-4.5 2.5 3.01L14.5 12l4.5 7H5z"/>
                      </svg>
                      <span className="text-sm">Canvas</span>
                    </button>
                    
                    <button className={`flex items-center space-x-1 p-2 ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'} rounded-lg transition-colors`}>
                      <Image className="w-5 h-5" />
                      <span className="text-sm">Image</span>
                    </button>

                    <button className={`p-2 ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'} rounded-full transition-colors`}>
                      <Mic className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
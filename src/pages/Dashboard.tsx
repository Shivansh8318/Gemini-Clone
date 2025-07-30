import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { 
  Plus, 
  Search, 
  MessageCircle, 
  Trash2, 
  LogOut, 
  Moon, 
  Sun,
  User,
  Clock,
  Sparkles
} from 'lucide-react'
import { useStore } from '../store/useStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const createChatroomSchema = z.object({
  title: z.string().min(1, 'Title is required').max(50, 'Title must be less than 50 characters'),
})

type CreateChatroomForm = z.infer<typeof createChatroomSchema>

export default function Dashboard() {
  const navigate = useNavigate()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  
  const {
    user,
    chatrooms,
    searchQuery,
    addChatroom,
    deleteChatroom,
    setCurrentChatroom,
    setSearchQuery,
    logout,
    isDarkMode,
    toggleDarkMode,
  } = useStore()

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateChatroomForm>({
    resolver: zodResolver(createChatroomSchema),
  })

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchInput, setSearchQuery])

  // Filtered chatrooms
  const filteredChatrooms = useMemo(() => {
    if (!searchQuery.trim()) return chatrooms
    return chatrooms.filter(room =>
      room.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [chatrooms, searchQuery])

  const onCreateChatroom = (data: CreateChatroomForm) => {
    addChatroom(data.title)
    setShowCreateModal(false)
    reset()
    toast.success('Chatroom created successfully!')
  }

  const handleDeleteChatroom = (id: string, title: string) => {
    if (deleteConfirm === id) {
      deleteChatroom(id)
      setDeleteConfirm(null)
      toast.success(`"${title}" deleted successfully!`)
    } else {
      setDeleteConfirm(id)
      setTimeout(() => setDeleteConfirm(null), 3000) // Auto-cancel after 3s
    }
  }

  const handleChatroomClick = (id: string) => {
    setCurrentChatroom(id)
    navigate(`/chat/${id}`)
  }

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully!')
  }

  const formatTime = (date: Date | string) => {
    const now = new Date()
    const targetDate = date instanceof Date ? date : new Date(date)
    const diff = now.getTime() - targetDate.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return targetDate.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 via-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-medium text-gray-900 dark:text-white">
                Gemini Chat
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <User className="w-4 h-4" />
                <span>{user?.countryCode} {user?.phone}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Create Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search chatrooms..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              <span>New Chat</span>
            </button>
          </div>
        </div>

        {/* Chatrooms Grid */}
        {filteredChatrooms.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              {searchQuery ? 'No chatrooms found' : 'No chatrooms yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery 
                ? 'Try adjusting your search terms' 
                : 'Create your first chatroom to get started'
              }
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                Create Chatroom
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChatrooms.map((chatroom) => (
              <div
                key={chatroom.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 overflow-hidden group"
              >
                <div
                  onClick={() => handleChatroomClick(chatroom.id)}
                  className="p-6 cursor-pointer flex-1"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
                    {chatroom.title}
                  </h3>
                  
                  {chatroom.lastMessage && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {chatroom.lastMessage.isUser ? 'You: ' : 'Gemini: '}
                        {chatroom.lastMessage.content}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(chatroom.createdAt)}</span>
                    </div>
                    <span>{chatroom.messages.length} messages</span>
                  </div>
                </div>
                
                <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteChatroom(chatroom.id, chatroom.title)
                    }}
                    className={`flex items-center space-x-2 text-sm transition-colors ${
                      deleteConfirm === chatroom.id
                        ? 'text-red-600 hover:text-red-700 dark:text-red-400'
                        : 'text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>
                      {deleteConfirm === chatroom.id ? 'Click again to confirm' : 'Delete'}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Chatroom Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Create New Chatroom
              </h2>
              
              <form onSubmit={handleSubmit(onCreateChatroom)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Chatroom Title
                  </label>
                  <input
                    {...register('title')}
                    type="text"
                    placeholder="Enter chatroom title"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    autoFocus
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.title.message}
                    </p>
                  )}
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false)
                      reset()
                    }}
                    className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
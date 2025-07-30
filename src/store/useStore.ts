import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  phone: string
  countryCode: string
  isAuthenticated: boolean
}

export interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
  image?: string
}

export interface Chatroom {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  lastMessage?: Message
}

export interface Country {
  name: {
    common: string
  }
  cca2: string
  idd: {
    root: string
    suffixes: string[]
  }
  flag: string
}

interface AppState {
  // Theme
  isDarkMode: boolean
  toggleDarkMode: () => void

  // Auth
  user: User | null
  countries: Country[]
  setUser: (user: User | null) => void
  setCountries: (countries: Country[]) => void
  logout: () => void

  // Chatrooms
  chatrooms: Chatroom[]
  currentChatroomId: string | null
  searchQuery: string
  addChatroom: (title: string) => void
  deleteChatroom: (id: string) => void
  setCurrentChatroom: (id: string) => void
  setSearchQuery: (query: string) => void

  // Messages
  addMessage: (chatroomId: string, content: string, isUser: boolean, image?: string) => void
  isTyping: boolean
  setIsTyping: (typing: boolean) => void

  // Pagination
  messagePages: Record<string, number>
  loadMoreMessages: (chatroomId: string) => void
}

const generateId = () => Math.random().toString(36).substr(2, 9)

const generateDummyMessages = (count: number): Message[] => {
  const messages: Message[] = []
  const now = new Date()
  
  for (let i = 0; i < count; i++) {
    messages.push({
      id: generateId(),
      content: `This is a sample message ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
      isUser: i % 2 === 0,
      timestamp: new Date(now.getTime() - (count - i) * 60000), // 1 minute apart
    })
  }
  
  return messages
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme
      isDarkMode: false,
      toggleDarkMode: () => {
        set((state) => ({ isDarkMode: !state.isDarkMode }))
        const root = document.documentElement
        if (get().isDarkMode) {
          root.classList.add('dark')
          root.style.setProperty('--toast-bg', '#374151')
          root.style.setProperty('--toast-color', '#f9fafb')
        } else {
          root.classList.remove('dark')
          root.style.setProperty('--toast-bg', '#ffffff')
          root.style.setProperty('--toast-color', '#111827')
        }
      },

      // Auth
      user: null,
      countries: [],
      setUser: (user) => set({ user }),
      setCountries: (countries) => set({ countries }),
      logout: () => set({ user: null, chatrooms: [], currentChatroomId: null }),

      // Chatrooms
      chatrooms: [],
      currentChatroomId: null,
      searchQuery: '',
      addChatroom: (title) => {
        const newChatroom: Chatroom = {
          id: generateId(),
          title,
          messages: generateDummyMessages(20), // Start with some dummy messages
          createdAt: new Date(),
        }
        newChatroom.lastMessage = newChatroom.messages[newChatroom.messages.length - 1]
        
        set((state) => ({
          chatrooms: [newChatroom, ...state.chatrooms],
          messagePages: { ...state.messagePages, [newChatroom.id]: 1 }
        }))
      },
      deleteChatroom: (id) => {
        set((state) => ({
          chatrooms: state.chatrooms.filter(room => room.id !== id),
          currentChatroomId: state.currentChatroomId === id ? null : state.currentChatroomId,
          messagePages: Object.fromEntries(
            Object.entries(state.messagePages).filter(([key]) => key !== id)
          )
        }))
      },
      setCurrentChatroom: (id) => set({ currentChatroomId: id }),
      setSearchQuery: (query) => set({ searchQuery: query }),

      // Messages
      addMessage: (chatroomId, content, isUser, image) => {
        const newMessage: Message = {
          id: generateId(),
          content,
          isUser,
          timestamp: new Date(),
          image,
        }

        set((state) => ({
          chatrooms: state.chatrooms.map(room =>
            room.id === chatroomId
              ? {
                  ...room,
                  messages: [...room.messages, newMessage],
                  lastMessage: newMessage,
                }
              : room
          ),
        }))
      },
      isTyping: false,
      setIsTyping: (typing) => set({ isTyping: typing }),

      // Pagination
      messagePages: {},
      loadMoreMessages: (chatroomId) => {
        const state = get()
        const currentPage = state.messagePages[chatroomId] || 1
        const newMessages = generateDummyMessages(20)
        
        set((state) => ({
          chatrooms: state.chatrooms.map(room =>
            room.id === chatroomId
              ? {
                  ...room,
                  messages: [...newMessages, ...room.messages],
                }
              : room
          ),
          messagePages: {
            ...state.messagePages,
            [chatroomId]: currentPage + 1
          }
        }))
      },
    }),
    {
      name: 'gemini-chat-storage',
      partialize: (state) => ({
        user: state.user,
        chatrooms: state.chatrooms,
        isDarkMode: state.isDarkMode,
        messagePages: state.messagePages,
      }),
    }
  )
)
// Conversations =========================================================================================================================

export interface ParticipantUser {
  id: string;
  name: string;
  email: string;
}

export interface ConversationParticipant {
  userId: string;
  conversationId: string;
  joinedAt: string; 
  user: ParticipantUser;
}

export interface Conversation {
  id: string;
  title: string | null;
  createdAt: string;
  isGroup: boolean;
  users: ConversationParticipant[];
}

export interface ConversationReturn {
  userId: string;
  joinedAt: string;
  conversation: Conversation;
}

export interface ConversationMessagesResponseDto {
  data: MessageDto[]
  userId: string
  conversationId:string
  limit: string
  oldestMessageDate?: string
}

export interface MessageDto {
  _id?:any
  conversationId:string
  userId:string
  userName:string
  content:string
  createdAt:Date
  updatedAt:Date
}

export interface ConversationMessagesRequestDto {
  conversationId:string
  limit: string
  oldestMessageDate?: string
}


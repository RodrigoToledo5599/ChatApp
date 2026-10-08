import type { Conversation } from "../../lib/types/conversations.types"

// o back devolve em `users` apenas os outros participantes
export function getConversationName(conversation: Conversation): string {
  if (conversation.isGroup) return conversation.title ?? "Grupo"
  return conversation.users[0]?.user?.name ?? "Usuário"
}

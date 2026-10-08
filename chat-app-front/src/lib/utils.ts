import axios from "axios"


// extrai a mensagem de erro do back (o ValidationPipe devolve uma lista de mensagens)
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message
    if (Array.isArray(message) && message.length > 0) return message.join("\n")
    if (typeof message === "string" && message) return message
  }
  return fallback
}

export default function UTCtoNormalVisualDate(dateStr: string){
  if (!dateStr) return ""

  const date = new Date(dateStr)

  if (isNaN(date.getTime())) {
    return ""
  }

  const formatter = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour12: false
  })

  const formattedParts = formatter.format(date).split(' ')
  const dayMonthYear = formattedParts[0]
  const hourMinuteSecond = formattedParts[1]

  return `${hourMinuteSecond} - ${dayMonthYear}`
}

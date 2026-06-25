


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
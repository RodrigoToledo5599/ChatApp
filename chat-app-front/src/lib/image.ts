// mesmo limite do back
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024
const MAX_DIMENSION = 1600
const JPEG_QUALITY = 0.82

export interface PreparedImage {
  blob: Blob
  width: number
  height: number
}

// como no WhatsApp: toda imagem é redimensionada e reencodada em JPEG antes do envio.
// além de deixar o arquivo bem menor, isso descarta os metadados EXIF (localização GPS, modelo do celular...)
export async function prepareImage(file: File): Promise<PreparedImage> {
  // SVG pode carregar scripts; o resto o browser decodifica (inclusive formatos que o back não aceita, como GIF)
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml")
    throw new Error("Formato de imagem não suportado")

  let bitmap: ImageBitmap
  try {
    // já aplica a rotação indicada no EXIF, então a foto não fica deitada depois que os metadados somem
    bitmap = await createImageBitmap(file)
  } catch {
    throw new Error("Não foi possível ler esta imagem")
  }

  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))

  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext("2d")!
  // JPEG não tem transparência: sem fundo, as áreas transparentes de um PNG ficariam pretas
  context.fillStyle = "#ffffff"
  context.fillRect(0, 0, width, height)
  context.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY))
  if (!blob)
    throw new Error("Não foi possível processar a imagem")
  if (blob.size > MAX_UPLOAD_SIZE)
    throw new Error("A imagem é grande demais")

  return { blob, width, height }
}

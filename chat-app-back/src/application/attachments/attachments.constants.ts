export const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024
export const MAX_IMAGE_DIMENSION = 10_000

// uploads que não viraram mensagem dentro deste prazo são apagados pela limpeza
export const PENDING_ATTACHMENT_TTL_MS = 60 * 60 * 1000

// assinatura binária (magic bytes) de cada tipo aceito. Nada de SVG: pode carregar JavaScript
const IMAGE_SIGNATURES: Record<string, (bytes: Uint8Array) => boolean> = {
  'image/jpeg': (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  'image/png': (b) => [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((v, i) => b[i] === v),
  'image/webp': (b) => ascii(b, 0, 4) === 'RIFF' && ascii(b, 8, 12) === 'WEBP',
}

export const ALLOWED_IMAGE_TYPES = Object.keys(IMAGE_SIGNATURES)
export const SIGNATURE_BYTES = 12

function ascii(bytes: Uint8Array, start: number, end: number) {
  return String.fromCharCode(...bytes.slice(start, end))
}

// o content-type é declarado pelo cliente; o conteúdo real é o que vale
export function matchesImageSignature(mimeType: string, bytes: Uint8Array): boolean {
  return IMAGE_SIGNATURES[mimeType]?.(bytes) ?? false
}

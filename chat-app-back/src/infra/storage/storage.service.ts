export type StoredObjectInfo = {
  size: number
  contentType?: string
}

// abstração do bucket de arquivos; os usecases não sabem se por trás é R2, S3 ou MinIO
export abstract class StorageService {
  // url assinada para o browser enviar o arquivo direto ao bucket (PUT)
  abstract createUploadUrl(key: string, contentType: string, size: number): Promise<string>
  // url assinada de leitura; o bucket é privado
  abstract createDownloadUrl(key: string): Promise<string>
  // null quando o objeto não existe
  abstract getObjectInfo(key: string): Promise<StoredObjectInfo | null>
  abstract readFirstBytes(key: string, length: number): Promise<Uint8Array>
  abstract delete(key: string): Promise<void>
}

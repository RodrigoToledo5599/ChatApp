import 'dotenv/config'
import { Injectable } from '@nestjs/common'
import { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, NotFound, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { StorageService, StoredObjectInfo } from './storage.service'

const UPLOAD_URL_EXPIRES_IN = 5 * 60

// as urls de leitura são assinadas com o horário arredondado para esta janela: dentro dela a url
// gerada é sempre a mesma, então o browser reaproveita a imagem do cache em vez de baixar de novo
const DOWNLOAD_SIGNING_WINDOW_MS = 30 * 60 * 1000
// validade a partir do início da janela: a url entregue vale sempre entre 1h e 1h30
const DOWNLOAD_URL_EXPIRES_IN = 90 * 60

// implementação para qualquer storage compatível com S3 (Cloudflare R2 em produção, MinIO no docker local)
@Injectable()
export class S3StorageService extends StorageService {
  private readonly client: S3Client
  private readonly bucket: string

  constructor() {
    super()
    this.bucket = process.env.STORAGE_BUCKET!
    this.client = new S3Client({
      endpoint: process.env.STORAGE_ENDPOINT,
      region: process.env.STORAGE_REGION ?? 'auto',
      // o MinIO exige o bucket no caminho (http://host/bucket/key) em vez de subdomínio
      forcePathStyle: process.env.STORAGE_FORCE_PATH_STYLE === 'true',
      credentials: {
        accessKeyId: process.env.STORAGE_ACCESS_KEY_ID!,
        secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY!,
      },
    })
  }

  async createUploadUrl(key: string, contentType: string, size: number): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
      ContentLength: size,
    })
    // tipo e tamanho entram na assinatura: o upload só passa se o browser mandar exatamente o que foi declarado
    return getSignedUrl(this.client, command, {
      expiresIn: UPLOAD_URL_EXPIRES_IN,
      signableHeaders: new Set(['content-type', 'content-length']),
    })
  }

  async createDownloadUrl(key: string): Promise<string> {
    const windowStart = Math.floor(Date.now() / DOWNLOAD_SIGNING_WINDOW_MS) * DOWNLOAD_SIGNING_WINDOW_MS
    const command = new GetObjectCommand({ Bucket: this.bucket, Key: key })
    return getSignedUrl(this.client, command, {
      expiresIn: DOWNLOAD_URL_EXPIRES_IN,
      signingDate: new Date(windowStart),
    })
  }

  async getObjectInfo(key: string): Promise<StoredObjectInfo | null> {
    try {
      const head = await this.client.send(new HeadObjectCommand({ Bucket: this.bucket, Key: key }))
      return { size: head.ContentLength ?? 0, contentType: head.ContentType }
    } catch (e) {
      if (e instanceof NotFound || (e as any)?.$metadata?.httpStatusCode === 404)
        return null
      throw e
    }
  }

  async readFirstBytes(key: string, length: number): Promise<Uint8Array> {
    const object = await this.client.send(new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Range: `bytes=0-${length - 1}`,
    }))
    return object.Body ? await object.Body.transformToByteArray() : new Uint8Array()
  }

  async delete(key: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }))
  }
}

// cria o bucket (se não existir) e libera o CORS para o front enviar/ler arquivos direto nele.
// roda igual no storage local (RustFS) e no Cloudflare R2: npm run storage:setup
import 'dotenv/config'
import { CreateBucketCommand, HeadBucketCommand, PutBucketCorsCommand, S3Client } from '@aws-sdk/client-s3'

async function main() {
  const bucket = process.env.STORAGE_BUCKET!
  const client = new S3Client({
    endpoint: process.env.STORAGE_ENDPOINT,
    region: process.env.STORAGE_REGION ?? 'auto',
    forcePathStyle: process.env.STORAGE_FORCE_PATH_STYLE === 'true',
    credentials: {
      accessKeyId: process.env.STORAGE_ACCESS_KEY_ID!,
      secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY!,
    },
  })

  try {
    await client.send(new HeadBucketCommand({ Bucket: bucket }))
    console.log(`Bucket "${bucket}" já existe`)
  } catch {
    await client.send(new CreateBucketCommand({ Bucket: bucket }))
    console.log(`Bucket "${bucket}" criado`)
  }

  // só a origem do front; o browser manda o upload (PUT) e lê as imagens (GET) direto do bucket
  await client.send(new PutBucketCorsCommand({
    Bucket: bucket,
    CORSConfiguration: {
      CORSRules: [{
        AllowedOrigins: [process.env.FRONT_END_URL!],
        AllowedMethods: ['PUT', 'GET'],
        AllowedHeaders: ['content-type'],
        MaxAgeSeconds: 3600,
      }],
    },
  }))
  console.log(`CORS liberado para ${process.env.FRONT_END_URL}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

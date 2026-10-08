import axios from "axios"
import type { UploadUrlRequestDto, UploadUrlResponseDto } from "../../lib/types/conversations.types"
import { http } from "../http"


const ENDPOINT = "/attachments"

export const attachmentService = {

    requestUploadUrl: async (params: UploadUrlRequestDto): Promise<UploadUrlResponseDto> => {
        const { data } = await http.post<UploadUrlResponseDto>(ENDPOINT + "/upload-url", params)
        return data
    },

    // vai direto para o bucket, não para a API: usa axios puro (sem cookies nem interceptor de refresh).
    // o Content-Type tem que ser o mesmo declarado no requestUploadUrl, senão a assinatura não bate
    uploadToStorage: async (uploadUrl: string, file: Blob, onProgress?: (percent: number) => void) => {
        await axios.put(uploadUrl, file, {
            headers: { "Content-Type": file.type },
            onUploadProgress: (event) => {
                if (event.total) onProgress?.(Math.round((event.loaded / event.total) * 100))
            },
        })
    },
}

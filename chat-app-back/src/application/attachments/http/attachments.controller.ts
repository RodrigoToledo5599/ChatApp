import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthGuard } from '../../../middleware/guards/auth.guard';
import { User } from '../../../middleware/decorators/user.decorator';
import { RequestUploadUrlUsecase } from '../usecases/request-upload-url.usecase';
import { UploadUrlRequestDto, UploadUrlResponseDto } from '../dto/upload-url.dto';


@UseGuards(AuthGuard)
@Controller('attachments')
export class AttachmentsController {

    constructor(
        private requestUploadUrlUsecase: RequestUploadUrlUsecase,
    ){}

    @ApiOkResponse({ type: UploadUrlResponseDto })
    @ApiBody({ type: UploadUrlRequestDto })
    @Throttle({ default: { limit: 30, ttl: 60_000 } })
    @Post('upload-url')
    async requestUploadUrl(
        @User() user,
        @Body() body: UploadUrlRequestDto
    ): Promise<UploadUrlResponseDto> {
        return await this.requestUploadUrlUsecase.execute(user.id, body)
    }

}

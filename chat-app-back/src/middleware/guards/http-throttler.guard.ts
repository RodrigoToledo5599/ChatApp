import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';


// o ThrottlerGuard padrão espera uma request HTTP; como guard global ele também roda nos handlers do websocket
@Injectable()
export class HttpThrottlerGuard extends ThrottlerGuard {

    async canActivate(context: ExecutionContext): Promise<boolean> {
        if (context.getType() !== 'http')
            return true;
        return super.canActivate(context);
    }

}

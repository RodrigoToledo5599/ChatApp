import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {  
    const request = ctx.switchToHttp().getRequest();

    const user = request.user;
    if(!user)
      throw new UnauthorizedException('User session not found');
  
    return data ? user?.[data] : user;
  },
);
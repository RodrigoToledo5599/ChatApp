import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { jwtDecode } from "jwt-decode";

export const User = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // const accessToken: string | undefined = request.cookie.accessToken;
    const accessToken: string | undefined = request.headers.cookie?.split('=')[1]
    if(!accessToken)
      throw new InternalServerErrorException('Internal server error');
    const user = jwtDecode<any>(accessToken);
    return data ? user?.[data] : user;
  },
);
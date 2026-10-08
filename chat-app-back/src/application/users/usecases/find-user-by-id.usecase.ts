import { Injectable, NotFoundException } from "@nestjs/common";
import { UsersRepository } from "../repository/users.repository";
import { UserDto } from "../dto/user.dto";



@Injectable()
export class FindUserByIdUsecase{

    constructor(
        private userRepo: UsersRepository
    ){}

    async execute(id: string): Promise<UserDto>{
        const user = await this.userRepo.findUserById(id);
        if(!user)
            throw new NotFoundException('Não foi possível encontrar o usuário')

        return new UserDto(user)
    }
}

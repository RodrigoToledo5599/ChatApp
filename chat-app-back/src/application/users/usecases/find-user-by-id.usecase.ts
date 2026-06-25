import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { UsersRepository } from "../repository/users.repository";
import { UserDto } from "../dto/user.dto";





@Injectable()
export class FindUserByIdUsecase{

    constructor(
        private userRepo: UsersRepository
    ){}

    async execute(id: string): Promise<UserDto>{
        if(!id)
            throw new BadRequestException("Preencha o campo obrigatório")
        try{
            const user = await this.userRepo.findUserById(id);
            if(!user)
                throw new NotFoundException('Não foi possível encontrar o usuário')

            const result = new UserDto(user)
            return result

        }catch(e){
            throw new InternalServerErrorException('Não foi possível encontrar o usuário');
        }     
    }
}
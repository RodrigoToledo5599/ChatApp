import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { UsersRepository } from "../repository/users.repository";
import { UserDto } from "../dto/user.dto";







@Injectable()
export class FindUserByNameUsecase{
    constructor(
        private userRepo: UsersRepository
    ){}

    async execute(name: string): Promise<UserDto[]>{
        if(!name)
            throw new BadRequestException("Preencha o campo obrigatório")
        try{
            const usersResult = await this.userRepo.findUsersbyName(name);
            if(!usersResult)
                throw new NotFoundException('Não foi possível encontrar o usuário')
            const result: UserDto[] = usersResult.map((c)=> new UserDto(c))
            return result
            
            }catch(e){
                throw new InternalServerErrorException('Não foi possível encontrar o usuário');
            }     
        }
}
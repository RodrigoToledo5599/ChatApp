import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersRepository } from "../repository/users.repository";
import { UserDto } from "../dto/user.dto";



@Injectable()
export class SearchUsersUsecase{
    constructor(
        private userRepo: UsersRepository
    ){}

    // com '@' busca o e-mail exato (evita listar e-mails por trecho); sem '@' busca por parte do nome
    async execute(currentUserId: string, query: string): Promise<UserDto[]>{
        const term = query?.trim()
        if(!term || term.length < 2)
            throw new BadRequestException("Digite pelo menos 2 caracteres")

        const users = term.includes('@')
            ? await this.userRepo.findUsersByExactEmail(term.toLowerCase(), currentUserId)
            : await this.userRepo.findUsersByName(term, currentUserId)

        return users.map((u) => new UserDto(u))
    }
}

import { Module } from "@nestjs/common";
import { AccountController } from "./http/account.controller";
import { CreateAccountUsecase } from "./usecases/create-account.usecase";
import { AccountRepository } from "./repository/account.repository";
import { UsersController } from "./http/users.controller";
import { FindUserByIdUsecase } from "./usecases/find-user-by-id.usecase";
import { UsersRepository } from "./repository/users.repository";
import { SearchUsersUsecase } from "./usecases/search-users.usecase";

@Module({
    controllers:[
        AccountController,
        UsersController
    ],
    providers:[
        CreateAccountUsecase,
        FindUserByIdUsecase,
        SearchUsersUsecase,
        AccountRepository,
        UsersRepository,
    ]
})
export class UsersModule{}

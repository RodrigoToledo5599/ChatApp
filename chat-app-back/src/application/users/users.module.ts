import { Module } from "@nestjs/common";
import { AccountController } from "./http/account.controller";
import { CreateAccountUsecase } from "./usecases/create-account.usecase";
import { AccountRepository } from "./repository/account.repository";
import { UsersController } from "./http/users.controller";
import { FindUserByIdUsecase } from "./usecases/find-user-by-id.usecase";
import { UsersRepository } from "./repository/users.repository";
import { FindUserByEmailUsecase } from "./usecases/find-user-by-email.usecase";
import { FindUserByNameUsecase } from "./usecases/find-user-by-name.usecase";

@Module({
    controllers:[
        AccountController,
        UsersController
    ],
    providers:[
        CreateAccountUsecase,
        FindUserByIdUsecase,
        FindUserByEmailUsecase,
        FindUserByNameUsecase,
        AccountRepository,
        UsersRepository,
    ]
})
export class UsersModule{}
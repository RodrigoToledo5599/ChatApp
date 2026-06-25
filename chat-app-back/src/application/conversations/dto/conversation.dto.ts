import { Prisma } from "@prisma/client";

type ConversationFromPrisma = Prisma.UsersOnConversationsGetPayload<{
    include: {
        conversation: {
            include: {
                users: {
                    include: { 
                        user: { select: 
                            {
                                id: true; 
                                name: true; 
                                email: true; 
                            } 
                        } 
                    }
                }
            }
        }
    }
}>;

export class User {
    id: string;
    name: string;
    email: string;

    constructor(
        id: string,
        name: string, 
        email: string,
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
}

export class UserDto {
    userId: string;
    conversationId: string;
    joinedAt: Date; 
    user: User;

    constructor(userId: string, conversationId: string, joinedAt: Date, user: User) {
        this.userId = userId;
        this.conversationId = conversationId;
        this.joinedAt = joinedAt;
        this.user = user;
    }
}

export class Conversation {
    id: string;
    title: string | null;
    isGroup: boolean;
    createdAt: Date;
    users: UserDto[];

    constructor(id: string, title: string | null, isGroup: boolean,createdAt: Date, users: UserDto[]) {
        this.id = id;
        this.title = title;
        this.isGroup = isGroup;
        this.createdAt = createdAt;
        this.users = users;
    }
}

export class ConversationDto {
    userId: string;
    joinedAt: Date;
    conversation: Conversation;

    constructor(userOnConversations: ConversationFromPrisma) {
        this.userId = userOnConversations.userId;
        this.joinedAt = userOnConversations.joinedAt;

        const dbConversation = userOnConversations.conversation;

        const mappedUsers = dbConversation.users.map((pivotUser) => {
            const userInstance = new User(
                pivotUser.user.id,
                pivotUser.user.name, 
                pivotUser.user.email
            );
            
            return new UserDto(
                pivotUser.userId,
                pivotUser.conversationId,
                pivotUser.joinedAt,
                userInstance
            );
        });

        this.conversation = new Conversation(
            dbConversation.id,
            dbConversation.title,
            dbConversation.isGroup,
            dbConversation.createdAt,
            mappedUsers
        );
    }
}
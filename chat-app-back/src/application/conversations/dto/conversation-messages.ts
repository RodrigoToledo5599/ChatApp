export class MessageDto {
  _id?: any
  conversationId: string  
  userId:string
  userName:string
  content:string
  createdAt:Date
  updatedAt:Date

  constructor(
    conversationId: string,
    userId:string,
    userName:string,
    content:string,
    createdAt:Date,
    updatedAt:Date, 
    _id?: any
  ){
    this.conversationId = conversationId
    this.userId = userId
    this.userName = userName
    this.content = content
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this._id = _id
  }
  
}


export class ConversationMessagesRequestDto {
    conversationId:string
    limit: string
    oldestMessageDate?: string

    constructor(
        conversationId:string,
        limit: string,
        oldestMessageDate?: string,
    ){
        this.conversationId = conversationId;
        this.limit = limit;
        this.oldestMessageDate = oldestMessageDate;
    }
}



export class ConversationMessagesResponseDto {
    data: MessageDto[]
    userId: string
    conversationId:string
    limit: string
    oldestMessageDate?: string

    constructor(
        data: MessageDto[],
        userId: string,
        conversationId:string,
        limit: string,
        oldestMessageDate?: string
    ){
        this.data = data
        this.userId = userId;
        this.conversationId = conversationId;
        this.limit = limit;
        this.oldestMessageDate = oldestMessageDate
    }
}
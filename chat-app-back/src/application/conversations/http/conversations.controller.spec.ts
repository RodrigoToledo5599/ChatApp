import { Test, TestingModule } from '@nestjs/testing';
import { ConversationsController } from './conversations.controller';

describe('ConversationsController', () => {
  let controller: ConversationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConversationsController],
    })
      // use cases e guard são substituídos por objetos vazios: aqui só importa que o controller seja montado
      .useMocker(() => ({}))
      .compile();

    controller = module.get<ConversationsController>(ConversationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

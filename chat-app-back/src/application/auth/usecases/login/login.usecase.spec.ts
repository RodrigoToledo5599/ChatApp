import { Test, TestingModule } from '@nestjs/testing';
import { LoginUseCase } from './login.usecase';
import { AuthRepository } from '../../repository/auth.repository';
import { GenerateTokenUtils } from '../../../../utils/jwt/generate-token-utils';
import { LoginRequestDto } from '../../dto/login-request.dto';

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;
  let authRepositoryMock: AuthRepository;
  let tokenUtilsMock: GenerateTokenUtils;

  beforeEach(async () => {
    const mockAuthRepository = {
      findUserByEmail: jest.fn(),
      findAdminByEmail: jest.fn(),
      saveRefreshToken: jest.fn(),
    };

    const mockTokenUtils = {
      generateAccessToken: jest.fn(),
      generateRefreshToken: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        {
          provide: AuthRepository,
          useValue: mockAuthRepository,
        },
        {
          provide: GenerateTokenUtils,
          useValue: mockTokenUtils,
        },
      ],
    }).compile();

    loginUseCase = moduleRef.get<LoginUseCase>(LoginUseCase);
    authRepositoryMock = moduleRef.get<AuthRepository>(AuthRepository);
    tokenUtilsMock = moduleRef.get<GenerateTokenUtils>(GenerateTokenUtils);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });



  describe('execute', () => {
    it('Deve retornar os dados do usuário e os tokens se as credenciais forem válidas', async () => {

      const mockedParams = { email: 'rod@gmail.com', password: '123' };      

      const params = new LoginRequestDto(mockedParams.email, mockedParams.password);
      const result = await loginUseCase.execute(params);

      expect(result.user).toEqual({
        user: {
          id: "afcc40d2-ed37-4f7e-8748-723b8adb9b54",
          email: 'rod@gmail.com',
          name: 'Rodrigo Toledo',
          role: 'DONO',
          clinicId: 'b7f4f8d4-6d6d-4f6f-9b44-2a7d5d8c3e91'
        },
      });

    });
  });




});
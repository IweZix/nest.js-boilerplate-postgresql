import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from 'src/modules/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from 'src/services/jwt.service';
import { BcryptService } from 'src/services/bcrypt.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Role } from 'src/common/enums/role.enum';
import { UserDTO } from 'src/modules/users/DTO/user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  const mockUser: UserDTO = {
    id: 1,
    firstname: 'John',
    lastname: 'Doe',
    email: 'john@doe.com',
    role: Role.USER,
  };

  const mockRepo = {
    find: jest.fn().mockResolvedValue([mockUser]),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    signToken: jest.fn().mockReturnValue('fake.jwt.token'),
  };

  const mockBcryptService = {
    hashPassword: jest.fn().mockResolvedValue('hashedPassword'),
    comparePasswords: jest.fn(),
  };

  const mockMapper = {
    map: jest.fn((user) => user),
    mapArray: jest.fn((users) => users),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockRepo },
        { provide: JwtService, useValue: mockJwtService },
        { provide: BcryptService, useValue: mockBcryptService },
        { provide: 'automapper:nestjs:default', useValue: mockMapper },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  /**
   * Should be defined test
   */
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /**
   * Tests for register function
   */
  it('should throw ConflictException if user already exists', async () => {
    mockRepo.findOne.mockResolvedValueOnce(mockUser);

    await expect(
      service.register({
        id: 1,
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@doe.com',
        password: '1234',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should return the created user', async () => {
    mockRepo.findOne.mockResolvedValueOnce(null);
    mockRepo.save.mockResolvedValueOnce(mockUser);

    const result = await service.register({
      id: 1,
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@doe.com',
      password: '1234',
    });

    expect(mockBcryptService.hashPassword).toHaveBeenCalledWith('1234');
    expect(result).toEqual({
      id: 1,
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@doe.com',
      password: 'hashedPassword',
      role: Role.USER,
      token: 'fake.jwt.token',
    });
  });

  /**
   * Tests for login function
   */
  it('should throw NotFoundException if user does not exist', async () => {
    mockRepo.findOne.mockResolvedValueOnce(null);

    await expect(
      service.login({
        email: 'john@doe.com',
        password: '1234',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException for invalid password', async () => {
    mockRepo.findOne.mockResolvedValueOnce(mockUser);
    mockBcryptService.comparePasswords.mockResolvedValueOnce(false);

    await expect(
      service.login({
        email: 'john@doe.com',
        password: '1234',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should return the logged user', async () => {
    mockRepo.findOne.mockResolvedValueOnce(mockUser);
    mockBcryptService.comparePasswords.mockResolvedValueOnce(true);

    const result = await service.login({
      email: 'john@doe.com',
      password: '1234',
    });

    console.log(result);

    expect(result).toEqual({
      id: 1,
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@doe.com',
      role: Role.USER,
      token: 'fake.jwt.token',
    });
  });

  /**
   * Tests for getMe function
   */
  it('should throw NotFoundException if user not found', async () => {
    mockRepo.findOne.mockResolvedValueOnce(null);

    await expect(service.getMe(1)).rejects.toThrow(NotFoundException);
  });

  it('should return the user data', async () => {
    mockRepo.findOne.mockResolvedValueOnce(mockUser);

    const result = await service.getMe(1);

    expect(result).toEqual({
      id: 1,
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@doe.com',
      role: Role.USER,
      token: 'fake.jwt.token',
    });
  });

  /**
   * Tests for getAllUsers function
   */
  it('should return all users', async () => {
    const users = await service.getAllUsers();
    expect(users).toHaveLength(1);
    expect(repo.find).toHaveBeenCalled();
  });
});

import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ReceivedUserDTO } from './DTO/receivedUser.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ReturnedUserDTO } from './DTO/returnedUser.dto';
import { LoginUserDTO } from './DTO/loginUser.dto';
import { config } from 'src/utils/config';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  private readonly SALT_ROUNDS: number = config.saltRounds;
  private readonly JWT_SECRET: string = config.jwtSecret;
  private readonly JWT_LIFETIME: number = config.jwtLifetime;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Registers a new user by hashing the password and saving the user to the database.
   * @param {ReceivedUserDTO} userDTO - The user data transfer object containing user details.
   * @return {Promise<ReturnedUserDTO>} - A promise that resolves to the returned user DTO containing user details and a JWT token.
   * @throws {ConflictException} - If a user with the same email already exists.
   * @throws {Error} - If there is an error during the function.
   */
  async register(userDTO: ReceivedUserDTO): Promise<ReturnedUserDTO> {
    this.logger.log(`entered in [${this.register.name}] function`);

    try {
      const existingUser = await this.userRepository.findOne({
        where: { email: userDTO.email },
      });
      if (existingUser) {
        throw new ConflictException('User already exists');
      }

      const hashedPassword = await bcrypt.hash(
        userDTO.password,
        this.SALT_ROUNDS,
      );
      const userToSave: User = {
        ...userDTO,
        password: hashedPassword,
      };

      await this.userRepository.save(userToSave);

      const returnedUser: ReturnedUserDTO = {
        id: userToSave.id,
        firstname: userToSave.firstname,
        lastname: userToSave.lastname,
        email: userToSave.email,
        token: jwt.sign({ id: userToSave.id }, this.JWT_SECRET, {
          expiresIn: this.JWT_LIFETIME,
        }),
      };

      return returnedUser;
    } catch (error) {
      this.logger.error(`Error hashing password: ${error.message}`);
      throw error;
    }
  }

  /**
   * Logs in an existing user by verifying the email and password, and returns a JWT token.
   * @param {LoginUserDTO} loginUserDTO - The login data transfer object containing email and password.
   * @return {Promise<ReturnedUserDTO>} - A promise that resolves to the returned
   * @throws {NotFoundException} - If the email or password is incorrect.
   */
  async login(loginUserDTO: LoginUserDTO): Promise<ReturnedUserDTO> {
    this.logger.log(`entered in [${this.login.name}] function`);

    const user = await this.userRepository.findOne({
      where: { email: loginUserDTO.email },
    });

    if (!user) {
      throw new NotFoundException('Email or password is incorrect');
    }

    const isPasswordValid = await bcrypt.compare(
      loginUserDTO.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new NotFoundException('Email or password is incorrect');
    }

    const token = jwt.sign({ id: user.id }, this.JWT_SECRET, {
      expiresIn: this.JWT_LIFETIME,
    });

    return {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      token,
    };
  }

  async getMe(userId: number): Promise<ReturnedUserDTO> {
    this.logger.log(
      `entered in [${this.getMe.name}] function with userId: ${userId}`,
    );

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      token: jwt.sign({ id: user.id }, this.JWT_SECRET, {
        expiresIn: this.JWT_LIFETIME,
      }),
    };
  }
}

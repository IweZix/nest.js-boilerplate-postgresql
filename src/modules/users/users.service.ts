import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AddUserDTO } from './DTO/add/add-user.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDTO } from './DTO/user.dto';
import { LoginUserDTO } from './DTO/other/login-user.dto';
import { config } from 'src/utils/config';
import { Role } from 'src/common/enums/role.enum';
import { JwtService } from 'src/services/jwt.service';
import { BcryptService } from 'src/services/bcrypt.service';
// import { MailService } from '../mails/mail.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  private readonly SALT_ROUNDS: number = config.saltRounds;

  // private readonly mailService: MailService;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly bcryptService: BcryptService,
    // mailService: MailService,
  ) {
    // this.mailService = mailService;
  }

  /**
   * Registers a new user by hashing the password and saving the user to the database.
   * @param {AddUserDTO} userDTO - The user data transfer object containing user details.
   * @return {Promise<ReturnedUserDTO>} - A promise that resolves to the returned user DTO containing user details and a JWT token.
   * @throws {ConflictException} - If a user with the same email already exists.
   * @throws {Error} - If there is an error during the function.
   */
  async register(userDTO: AddUserDTO): Promise<UserDTO> {
    this.logger.log(`entered in [${this.register.name}] function`);

    try {
      const existingUser = await this.userRepository.findOne({
        where: { email: userDTO.email },
      });
      if (existingUser) {
        throw new ConflictException('User already exists');
      }

      const userToSave: User = {
        ...userDTO,
        password: await this.bcryptService.hashPassword(userDTO.password),
        role: Role.USER,
      };

      await this.userRepository.save(userToSave);

      const returnedUser: UserDTO = {
        id: userToSave.id,
        firstname: userToSave.firstname,
        lastname: userToSave.lastname,
        email: userToSave.email,
        token: await this.jwtService.signToken(userToSave.id, userToSave.role),
      };

      // this.mailService.sendWelcomeEmail(userToSave.email);

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
  async login(loginUserDTO: LoginUserDTO): Promise<UserDTO> {
    this.logger.log(`entered in [${this.login.name}] function`);

    const user = await this.userRepository.findOne({
      where: { email: loginUserDTO.email },
    });

    if (!user) {
      throw new NotFoundException('Email or password is incorrect');
    }

    const isPasswordValid = await this.bcryptService.comparePasswords(
      loginUserDTO.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new NotFoundException('Email or password is incorrect');
    }

    const token = await this.jwtService.signToken(user.id, user.role);

    return {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      token,
    };
  }

  async getMe(userId: number): Promise<UserDTO> {
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
      token: await this.jwtService.signToken(user.id, user.role),
    };
  }

  async getAllUsers(): Promise<UserDTO[]> {
    this.logger.log(`entered in [${this.getAllUsers.name}] function`);

    const users = await this.userRepository.find();

    return users.map((user) => ({
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    }));
  }
}

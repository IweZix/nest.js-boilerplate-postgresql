import {
  Controller,
  Logger,
  Post,
  HttpCode,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ReceivedUserDTO } from './DTO/receivedUser.dto';
import { ReturnedUserDTO } from './DTO/returnedUser.dto';
import { LoginUserDTO } from './DTO/loginUser.dto';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  private readonly usersService: UsersService;

  constructor(usersService: UsersService) {
    this.usersService = usersService;
  }

  /**
   * Registers a new user by validating the received user data and returning a JWT token.
   * @param {ReceivedUserDTO} userDTO - The user data transfer object containing user details.
   * @throws {ConflictException} - If a user with the same email already exists.
   * @throws {Error} - If there is an error during the function.
   * @returns {Promise<ReturnedUserDTO>} - A promise that resolves to the returned user DTO containing user details and a JWT token.
   */
  @Post('register')
  @HttpCode(201)
  async register(
    @Body(new ValidationPipe()) userDTO: ReceivedUserDTO,
  ): Promise<ReturnedUserDTO> {
    this.logger.log(`entered in [${this.register.name}] function`);
    return await this.usersService.register(userDTO);
  }

  /**
   * Logs in a user by verifying the email and password, and returns a JWT token.
   * @param {LoginUserDTO} userDTO - The user data transfer object containing email and password.
   * @returns {Promise<ReturnedUserDTO>} - A promise that resolves to the returned user DTO containing user details and a JWT token.
   * @throws {NotFoundException} - If the user is not found.
   */
  @Post('login')
  @HttpCode(200)
  async login(
    @Body(new ValidationPipe()) userDTO: LoginUserDTO,
  ): Promise<ReturnedUserDTO> {
    this.logger.log(`entered in [${this.login.name}] function`);
    return await this.usersService.login(userDTO);
  }
}

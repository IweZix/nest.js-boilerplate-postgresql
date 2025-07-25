import {
  Controller,
  Logger,
  Post,
  HttpCode,
  Body,
  ValidationPipe,
  UseGuards,
  Get,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ReceivedUserDTO } from './DTO/receivedUser.dto';
import { ReturnedUserDTO } from './DTO/returnedUser.dto';
import { LoginUserDTO } from './DTO/loginUser.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { User } from 'src/common/decorators/user.decorator';

@ApiTags('Users')
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
  @ApiOperation({
    summary: 'Registers a new user by validating the received user data',
  })
  @ApiBody({
    type: ReceivedUserDTO,
    description: 'User data transfer object containing user details',
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'return a ReturnedUserDTO',
    type: ReturnedUserDTO,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict: User with the same email already exists',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
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
  @ApiOperation({
    summary: 'Logs in a user by verifying the email and password',
  })
  @ApiBody({
    type: LoginUserDTO,
    description: 'User data transfer object containing email and password',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'return a ReturnedUserDTO',
    type: ReturnedUserDTO,
  })
  @ApiResponse({ status: 404, description: 'Not Found: User not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async login(
    @Body(new ValidationPipe()) userDTO: LoginUserDTO,
  ): Promise<ReturnedUserDTO> {
    this.logger.log(`entered in [${this.login.name}] function`);
    return await this.usersService.login(userDTO);
  }

  /**
   * Retrieves the current user's information.
   * @returns {Promise<ReturnedUserDTO>} - A promise that resolves to the returned user DTO containing user details.
   * @throws {UnauthorizedException} - If the user is not authenticated.
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @HttpCode(200)
  @ApiOperation({ summary: "Retrieves the current user's information" })
  @ApiResponse({
    status: 200,
    description: 'return a ReturnedUserDTO',
    type: ReturnedUserDTO,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized: User not authenticated',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getMe(@User('id') userId: number): Promise<ReturnedUserDTO> {
    this.logger.log(`entered in [${this.getMe.name}] function`);
    return await this.usersService.getMe(userId);
  }
}

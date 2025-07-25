# Nest.js boilerplate - postgresql

This boilerplate is a starting point for building RESTful APIs with Nest.js and PostgreSQL. It includes essential features such as user authentication, validation, and database integration.

A swagger file is generated at each start of the server to be used with orval or other tools.

## Features

- User registration and login and a getMe route
- JWT authentication
- Validation using class-validator
- Swagger documentation
- PostgreSQL database integration

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd nest.js-boilerplate-postgresql
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file based on the `.env.example` file and configure your environment variables, especially the database connection settings.
5. Run the application:
   ```bash
   npm run start:dev
   ```

## Usage

| URI             | Méthode | Body            | Authorization | Action                       |
| :-------------- | :------ | :-------------- | :------------ | :--------------------------- |
| /users/login    | POST    | ReceivedUserDTO | N/A           | LOGIN : login a user         |
| /users/register | POST    | LoginUserDTO    | N/A           | CREATE ONE : add one user    |
| /users/me       | GET     | N/A             | JwtAuthGuard  | VERIFY : verify a user token |

## New module ?

Create an empty module with the following command:

```bash
npm run generate-module <module_name>
```

```
src
└── modules
    └── <module_name>
        ├── DTO
        │   ├── received<DTO_name>.dto.ts
        │   └── returned<DTO_name>.dto.ts
        ├── <module_name>.entity.ts
        ├── <module_name>.controller.ts
        ├── <module_name>.service.ts
        └── <module_name>.module.ts
```

In the <module_name>.module.ts file : 
1. Import the <module_name>.entity.ts, DatabaseModule and TypeOrmModule
2. Add and import array :
```typescript
import { DatabaseModule } from '../database/db.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { <module_name> } from './<module_name>.entity';

@Module({
  imports: [
   TypeOrmModule.forFeature([<module_name>]),
   DatabaseModule
  ],
  controllers: [<module_name>Controller],
  providers: [<module_name>Service],
})
```

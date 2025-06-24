import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '../../utils/config';
import { User } from 'src/modules/users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.host,
      port: config.port,
      username: config.postgres, // Remplacez avec votre nom d'utilisateur DB
      password: config.password, // Remplacez avec votre mot de passe DB
      database: config.database, // Remplacez avec le nom de votre base de données
      entities: [User], // Recherche les entités dans tout le projet
      synchronize: true, // Ne jamais utiliser en production !
      // logging: true,
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [],
})
export class DatabaseModule {}

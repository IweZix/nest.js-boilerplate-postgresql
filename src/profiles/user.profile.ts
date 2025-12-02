import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, type Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/users/entities/user.entity';
import { UserDTO } from 'src/modules/users/DTO/user.dto';

@Injectable()
export class UserProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        User,
        UserDTO,
        forMember(
          (d) => d.id,
          mapFrom((s) => s.id),
        ),
        forMember(
          (d) => d.firstname,
          mapFrom((s) => s.firstname),
        ),
        forMember(
          (d) => d.lastname,
          mapFrom((s) => s.lastname),
        ),
        forMember(
          (d) => d.email,
          mapFrom((s) => s.email),
        ),
        forMember(
          (d) => d.token,
          mapFrom(() => undefined), // Token will be set separately
        ),
        forMember(
          (d) => d.createdAt,
          mapFrom((s) => s.createdAt),
        ),
        forMember(
          (d) => d.createdBy,
          mapFrom((s) => s.createdBy),
        ),
        forMember(
          (d) => d.updatedAt,
          mapFrom((s) => s.updatedAt),
        ),
        forMember(
          (d) => d.updatedBy,
          mapFrom((s) => s.updatedBy),
        ),
      );
    };
  }
}

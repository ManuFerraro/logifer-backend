import { UseGuards, applyDecorators } from "@nestjs/common";
import { ValidRoles } from "../interfaces/valid-roles";
import { AuthGuard } from "@nestjs/passport";
import { RoleProtected } from "./role-protected.decorator";
import { UserRoleGuard } from "../guards/user-role.guard";





export function Auth(...roles: ValidRoles[]) {

    return applyDecorators(
      RoleProtected(...roles),
      // SetMetadata('roles', roles),
      UseGuards(AuthGuard(), UserRoleGuard),
    );
  }
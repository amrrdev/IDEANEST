import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateOrganizationDto } from './create-organization.dto';

export class UpdateOrganizationDto extends PartialType(
  PickType(CreateOrganizationDto, ['name', 'description']),
) {}

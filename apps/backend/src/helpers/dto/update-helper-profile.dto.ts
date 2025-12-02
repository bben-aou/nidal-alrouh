import { PartialType } from '@nestjs/mapped-types';

import { CreateHelperProfileDto } from './create-helper-profile.dto';

export class UpdateHelperProfileDto extends PartialType(
  CreateHelperProfileDto
) {}

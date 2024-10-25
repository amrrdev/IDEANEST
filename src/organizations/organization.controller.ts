import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { OrganizationsService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InviteUserToOrganizationDto } from './dto/invite-user-to-organization.dto';

@Controller('organization')
export class OrganizationsController {
  constructor(private readonly organizationService: OrganizationsService) {}

  @Post()
  createOrganization(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationService.createOrganization(createOrganizationDto);
  }

  @Get(':organizationId')
  readOrganization(@Param('organizationId') organizationId: string) {
    return this.organizationService.readOrganization(organizationId);
  }

  @Get()
  readAllOrganization() {
    return this.organizationService.readAllOrganization();
  }

  @Patch(':organizationId')
  updateOrganization(
    @Param('organizationId') organizationId: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationService.updateOrganization(organizationId, updateOrganizationDto);
  }

  @Delete(':organizationId')
  organizationMembers(@Param('organizationId') organizationId: string) {
    return this.organizationService.deleteOrganization(organizationId);
  }

  @Post(':organizationId/invite')
  inviteUserToOrganization(
    @Param('organizationId') organizationId: string,
    @Body() inviteUserToOrganizationDto: InviteUserToOrganizationDto,
  ) {
    return this.organizationService.inviteUserToOrganization(
      organizationId,
      inviteUserToOrganizationDto,
    );
  }
}

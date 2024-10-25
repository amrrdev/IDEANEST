import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Organization } from './schemas/organization.schema';
import { Model } from 'mongoose';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { User } from '../users/schemas/user.schema';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InviteUserToOrganizationDto } from './dto/invite-user-to-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(Organization.name) private readonly organizationModel: Model<Organization>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createOrganization(createOrganizationDto: CreateOrganizationDto) {
    const organization = await this.organizationModel.create(createOrganizationDto);
    return { organization_id: organization.id };
  }

  async readOrganization(organizationId: string) {
    const organization = await this.organizationModel
      .findById(organizationId)
      .populate({
        path: 'organizationMembers',
        select: 'name email access_level -_id',
      })
      .select('-__v');

    if (!organization) {
      throw new BadRequestException(`There's not Organization with that ID ${organizationId}`);
    }

    const organizationMembers = await this.organizationMembers(organizationId);
    return { organization, organization_members: organizationMembers };
  }

  async readAllOrganization() {
    const organization = await this.organizationModel
      .find({})
      .populate({
        path: 'organizationMembers',
        select: 'name email access_level -_id',
      })
      .select('-__v')
      .exec();
    return organization;
  }

  async updateOrganization(
    organizationId: string,
    updateOrganizationDto: UpdateOrganizationDto,
  ) {
    const organization = await this.organizationModel
      .findByIdAndUpdate(organizationId, updateOrganizationDto)
      .select('-organizationMembers -__v');

    if (!organization) {
      return new NotFoundException("There's not organization with that ID");
    }
    return organization;
  }

  async deleteOrganization(organizationId: string) {
    const organization = await this.organizationModel.findByIdAndDelete(organizationId);
    if (!organization) {
      return new NotFoundException("There's not organization with that ID");
    }
    return { message: 'Deleted Successfully!' };
  }

  async inviteUserToOrganization(
    organizationId: string,
    inviteUserToOrganizationDto: InviteUserToOrganizationDto,
  ) {
    const organization = await this.organizationModel.findById(organizationId);

    if (!organization) {
      return new NotFoundException("There's not organization with that ID");
    }
    const user = await this.userModel.findOne({ email: inviteUserToOrganizationDto.email });
    if (!user) {
      return new NotFoundException("There's not user with that email");
    }

    if (organization.organizationMembers.includes(user.id)) {
      return { message: 'User is already a member of this organization.' };
    }

    organization.organizationMembers.push(user.id);
    await organization.save();
    return { message: 'User has been successfully invited to the organization.' };
  }

  private async organizationMembers(organizationId?: string) {
    return await this.userModel.find({ organizations: organizationId });
  }
}

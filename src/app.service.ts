import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { config } from 'dotenv';
import { google } from 'googleapis'
import axios from 'axios'
import { MemberService } from './modules/member/member.service';
import { SpaceService } from './modules/space/space.service';
import { getMembersInSpace, getSpaces } from 'src/google-chat-apis/google-chat-apis';
import { MemberInSpaceEntity } from './modules/member-in-space/member-in-space.entity';
import { MemberInSpaceService } from './modules/member-in-space/member-in-space.service';
import { SpaceEntity } from './modules/space/space.entity';


config()
@Injectable()
export class AppService {

  constructor(
    @Inject(forwardRef(() => MemberService)) private memberService: MemberService,
    @Inject(forwardRef(() => SpaceService)) private spaceService: SpaceService,
    @Inject(forwardRef(() => MemberInSpaceService)) private memberInSpaceService: MemberInSpaceService,
  ) { }

  async handleEvents(body: any) {
    if (body['type'] === 'ADDED_TO_SPACE') {
      return await this.handEventAddToSpace(body);
    } else if (body['type'] === 'MESSAGE') {
      console.log(await getMembersInSpace('spaces/AAAAPBhiEBE'))
      // return await this.handleEventReceivedMessage(body);
    } else if (body['type'] === 'REMOVED_FROM_SPACE') {
      await this.handleEventRemoveFromSpace(body);
    }
  }

  async handEventAddToSpace(data: any) {
    const isAdded = await this.spaceService.findByName(data.space.name);
    if (isAdded) {
      await this.spaceService.updateSpaceStatus(isAdded, true);
      return { text: `Thank for adding me to space ${data['space']['displayName']}` };
    } else {
      const space = await this.spaceService.addSpace(data.space.name, data.space.displayName);
      const listMember = await getMembersInSpace(space.name);
      //   const member = await this.memberService.findByEmail(data.user.email);
      for (let member of listMember) {
        if (data.user.name == member.member.name) {
          await this.addMemberToSpace(space, data.user.displayName, data.user.name, 'owner');
        }else{
          await this.addMemberToSpace(space, member.member.displayName, member.member.name, 'member');
        }
      }
      // if (member == null) {
      //   const newMember = await this.memberService.addMember(data.user.email, data.user.displayName, data.user.avatarUrl, null, data.user.name);
      //   await this.memberInSpaceService.addMemberToSpace(space, newMember, 'owner');
      // } else {
      //   await this.memberService.updateMemberName(member, data.user.name);
      //   await this.memberInSpaceService.addMemberToSpace(space, member, 'owner');
      // }
       return { text: `Thank for adding me to space ${data['space']['displayName']}` };
    }
  }

  async handleEventReceivedMessage(data: any) {
    const message = data.message.argumentText.trim() as string;
    const space = await this.spaceService.findByName(data.space.name);
    const member = await this.memberService.findByEmail(data.user.email);
    if (message == 'join') {
      if (member == null) {
        const newMember = await this.memberService.addMember(data.user.email, data.user.displayName, data.user.avatarUrl, null, data.user.name);
        await this.memberInSpaceService.addMemberToSpace(space, newMember, 'member');
      } else {
        await this.memberService.updateMemberName(member, data.user.name);
        const result = await this.memberInSpaceService.addMemberToSpace(space, member, 'member');
        if (result == null) {
          return { text: `${data.user.displayName} bạn đã tham gia trước đó` };
        } else {
          return { text: `${data.user.displayName} yêu cầu tham gia thành công` };
        }
      }
    }
  }

  async handleEventRemoveFromSpace(data: any) {
    const space = await this.spaceService.findByName(data.space.name);
    const result = await this.spaceService.updateSpaceStatus(space, false);
  }

  async addMemberToSpace(space: SpaceEntity, memberDisplayName: string, memberName: string, role: string) {
    const member = await this.memberService.findByName(memberName);
    if (member == null) {
      const newMember = await this.memberService.addMember(null, memberDisplayName, null, null, memberName);
      await this.memberInSpaceService.addMemberToSpace(space, newMember, role);
    } else {
      await this.memberService.updateMemberName(member, memberName);
      await this.memberInSpaceService.addMemberToSpace(space, member, role);
    }
  }


}

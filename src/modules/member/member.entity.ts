import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MemberInSpaceEntity } from "../member-in-space/member-in-space.entity";
import { ReceivedMessageEntity } from "../received-message/received-message.entity";
import { SendToEntity } from "../send-to/send-to.entity";
import { TaggedMemberEntity } from "../tagged-member/tagged-member.entity";

@Entity('member')
export class MemberEntity {

    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ type: 'nvarchar' })
    name: string

    @Column({ type: 'varchar' })
    mail: string

    @OneToMany(type => MemberInSpaceEntity, memberInSpace => memberInSpace.member)
    memberInSpace: MemberInSpaceEntity[];

    @OneToMany(type => ReceivedMessageEntity, receivedMessage => receivedMessage.member)
    receivedMessage: ReceivedMessageEntity[];

    @OneToMany(type => SendToEntity, sendTo => sendTo.member)
    sendTo: SendToEntity[];

    @OneToMany(type => TaggedMemberEntity, taggedMember => taggedMember.member)
    taggedMember: TaggedMemberEntity[];
}
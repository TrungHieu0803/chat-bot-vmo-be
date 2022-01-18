import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MemberEntity } from "../member/member.entity";
import { SpaceEntity } from "../space/space.entity";

@Entity('member_in_space')
export class MemberInSpaceEntity {

    @PrimaryGeneratedColumn('increment')
    id: number

    @ManyToOne(type => MemberEntity, member => member.memberInSpace)
    member: MemberEntity;

    @ManyToOne(type => SpaceEntity, space => space.memberInSpace)
    space: SpaceEntity;
} 
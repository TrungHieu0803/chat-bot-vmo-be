import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MemberEntity } from "../member/member.entity";
import { SpaceEntity } from "../space/space.entity";


@Entity('received_message')
export class ReceivedMessageEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'nvarchar' })
    content: string;

    @Column({ name: 'received_at', type: 'datetime' })
    receivedAt: Date;

    @ManyToOne(type => SpaceEntity, space => space.receivedMessage)
    space: SpaceEntity;

    @ManyToOne(type => MemberEntity, member => member.receivedMessage)
    member: MemberEntity;
}
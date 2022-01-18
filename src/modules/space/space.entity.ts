import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MemberInSpaceEntity } from "../member-in-space/member-in-space.entity";
import { NotificationEntity } from "../notification/notification.entity";
import { ReceivedMessageEntity } from "../received-message/received-message.entity";

@Entity('space')
export class SpaceEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'nvarchar' })
    name: string;

    @OneToMany(type => NotificationEntity, notification => notification.space)
    notification: NotificationEntity[];

    @OneToMany(type => MemberInSpaceEntity, memberInSpace => memberInSpace.space)
    memberInSpace: MemberInSpaceEntity[];

    @OneToMany(type => ReceivedMessageEntity, receivedMessage => receivedMessage.space)
    receivedMessage: ReceivedMessageEntity[];
}
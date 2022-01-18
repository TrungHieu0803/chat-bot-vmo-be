import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MemberEntity } from "../member/member.entity";
import { NotificationHistoryEntity } from "../notification-history/notification-history.entity";

@Entity('send_to')
export class SendToEntity{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(type => MemberEntity, member => member.sendTo)
    member: MemberEntity;

    @ManyToOne(type => NotificationHistoryEntity, notificationHistory => notificationHistory.sendTo)
    notificationHistory: NotificationHistoryEntity;
}
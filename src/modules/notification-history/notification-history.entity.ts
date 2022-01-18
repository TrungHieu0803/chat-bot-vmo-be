import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { NotificationEntity } from "../notification/notification.entity";
import { SendToEntity } from "../send-to/send-to.entity";

@Entity('notification_history')
export class NotificationHistoryEntity{

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({name: 'created_at', type: 'datetime'})
    createdAt: Date;

    @ManyToOne(type => NotificationEntity, notification => notification.notificationHistory)
    notification: NotificationEntity;

    @OneToMany(type => SendToEntity, sendTo => sendTo.notificationHistory)
    sendTo: SendToEntity[];
}
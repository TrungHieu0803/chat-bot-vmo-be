import { Column, ColumnTypeUndefinedError, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { NotificationHistoryEntity } from "../notification-history/notification-history.entity";
import { SpaceEntity } from "../space/space.entity";
import { TaggedMemberEntity } from "../tagged-member/tagged-member.entity";

@Entity('notification')
export class NotificationEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'nvarchar' })
    content: string;

    @Column({ name: 'created_by', type: 'nvarchar' })
    createdBy: string;

    @Column({ name: 'send_at_minute', type: 'varchar' })
    sendAtMinute: string;

    @Column({ name: 'send_at_hour', type: 'varchar' })
    sendAtHour: string;

    @Column({ name: 'send_at_dat_of_week', type: 'varchar' })
    sendAtDayOfWeek: string;

    @Column({ name: 'send_at_month', type: 'varchar' })
    sendAtMonth: string;

    @Column({ name: 'send_at_day_of_month', type: 'varchar' })
    sendAtDayOfMonth: string;

    @ManyToOne(type => SpaceEntity, space => space.notification)
    space: SpaceEntity;

    @OneToMany(type => TaggedMemberEntity, taggedMember => taggedMember.notification)
    taggedMember: TaggedMemberEntity;

    @OneToMany(type => NotificationHistoryEntity, notificationHistory => notificationHistory.notification)
    notificationHistory: NotificationHistoryEntity[];
}
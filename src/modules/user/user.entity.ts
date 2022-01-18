import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('user')
export class UserEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'nvarchar', nullable: false })
    name: string;

    @Column({ type: 'varchar', nullable: false })
    email: string

    @Column({ type: 'varchar', nullable: false })
    password: string  

}
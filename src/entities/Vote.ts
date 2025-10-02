import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';

@Entity('votes')
@Index(['ipAddress', 'ideaId'], { unique: true }) // Один голос с IP на идею
export class Vote {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    ipAddress!: string;

    @Column()
    ideaId!: number;

    @Column({ default: 1 })
    voteValue!: number; // 1 для голоса "за", -1 для "против" (если понадобится)

    @CreateDateColumn()
    createdAt!: Date;

    // Связь с идеей
    @ManyToOne('Idea', 'votes', { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'ideaId' })
    idea!: any;
}

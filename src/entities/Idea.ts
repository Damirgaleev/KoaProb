import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('ideas')
export class Idea {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	title!: string;

	@Column('text')
	description!: string;

	@Column({ default: 0 })
	votesCount!: number;

	@Column({ default: true })
	isActive!: boolean;

	@CreateDateColumn()
	createdAt!: Date;

	@UpdateDateColumn()
	updatedAt!: Date;

	// Связь с голосами
	@OneToMany('Vote', 'idea')
	votes!: any[];
}

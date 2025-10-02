import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('vote_limits')
@Index(['ipAddress'], { unique: true })
export class VoteLimit {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	ipAddress!: string;

	@Column({ default: 0 })
	votesUsed!: number;

	@Column({ default: 10 })
	maxVotes!: number;

	@CreateDateColumn()
	createdAt!: Date;

	@UpdateDateColumn()
	updatedAt!: Date;

	// Метод для проверки, можно ли голосовать
	canVote(): boolean {
			return this.votesUsed < this.maxVotes;
	}

	// Метод для добавления голоса
	addVote(): void {
			if (this.canVote()) {
					this.votesUsed += 1;
			}
	}

	// Метод для удаления голоса
	removeVote(): void {
			if (this.votesUsed > 0) {
					this.votesUsed -= 1;
			}
	}
}

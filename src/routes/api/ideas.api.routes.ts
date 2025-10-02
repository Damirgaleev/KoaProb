import Router from '@koa/router';
import { Context } from 'koa';
import { Idea } from '../../entities/Idea';
import { Vote } from '../../entities/Vote';
import { AppDataSource } from '../../config/database';
import { VoteLimit } from '../../entities/VoteLimit';

const router = new Router({ prefix: '/api/ideas' });

// Получить все идеи с пагинацией и сортировкой
router.get('/', async (ctx: Context) => {
	try {
		const ideaRepository = AppDataSource.getRepository(Idea);
		
		const page = parseInt(ctx.query.page as string) || 1;
		const limit = parseInt(ctx.query.limit as string) || 20;
		const sortBy = ctx.query.sortBy as string || 'votesCount';
		const sortOrder = ctx.query.sortOrder as string || 'DESC';
		const search = ctx.query.search as string;

		const queryBuilder = ideaRepository.createQueryBuilder('idea')
			.where('idea.isActive = :isActive', { isActive: true });


		// Поиск по названию и описанию
		if (search) {
			queryBuilder.andWhere(
				'(idea.title ILIKE :search OR idea.description ILIKE :search)',
				{ search: `%${search}%` }
			);
		}

		// Сортировка
		const validSortFields = ['votesCount', 'createdAt', 'title'];
		const sortField = validSortFields.includes(sortBy) ? sortBy : 'votesCount';
		const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
		
		queryBuilder.orderBy(`idea.${sortField}`, order);

		// Пагинация
		const offset = (page - 1) * limit;
		queryBuilder.skip(offset).take(limit);

		const [ideas, total] = await queryBuilder.getManyAndCount();

		ctx.body = {
			success: true,
			data: {
				ideas,
				pagination: {
						page,
						limit,
						total,
						totalPages: Math.ceil(total / limit)
				}
			}
		};
	} catch (error) {
		console.error('Ошибка при получении идей:', error);
		ctx.status = 500;
		ctx.body = {
			success: false,
			message: 'Ошибка при получении идей'
		};
	}
});

// Проголосовать за идею
router.post('/:id/vote', async (ctx: Context) => {
	const transactionManager = AppDataSource.manager;

	try {
		const ideaId = parseInt(ctx.params.id);
		const ipAddress = ctx.state.clientIp || ctx.ip;

		if (isNaN(ideaId)) {
			ctx.status = 400;
			ctx.body = {
					success: false,
					message: 'Неверный ID идеи'
			};
			return;
		}

			await transactionManager.transaction(async (manager) => {
				const ideaRepository = manager.getRepository(Idea);
				const voteRepository = manager.getRepository(Vote);
				const voteLimitRepository = manager.getRepository(VoteLimit);

				// Проверяем существование идеи
				const idea = await ideaRepository.findOne({
						where: { id: ideaId, isActive: true }
				});

				if (!idea) {
					ctx.status = 404;
					ctx.body = {
						success: false,
						message: 'Идея не найдена'
					};
					return;
				}

				// Проверяем, не голосовал ли уже этот IP за эту идею
				const existingVote = await voteRepository.findOne({
					where: { ipAddress, ideaId }
				});

				if (existingVote) {
					ctx.status = 409;
					ctx.body = {
						success: false,
						message: 'Вы уже голосовали за эту идею',
						error: 'VOTE_ALREADY_EXISTS'
					};
					return;
				}

				// Получаем или создаем лимит голосов для IP
				let voteLimit = await voteLimitRepository.findOne({
					where: { ipAddress }
				});

				if (!voteLimit) {
					voteLimit = voteLimitRepository.create({
						ipAddress,
						votesUsed: 0,
						maxVotes: 10
					});
				}

				// Проверяем лимит голосов
				if (!voteLimit.canVote()) {
					ctx.status = 409;
					ctx.body = {
						success: false,
						message: `Превышен лимит голосов. Максимум ${voteLimit.maxVotes} голосов с одного IP-адреса`,
						error: 'VOTE_LIMIT_EXCEEDED',
						data: {
							votesUsed: voteLimit.votesUsed,
							maxVotes: voteLimit.maxVotes,
							votesRemaining: 0
						}
					};
					return;
				}

					// Создаем голос
				const vote = voteRepository.create({
					ipAddress,
					ideaId,
					voteValue: 1
				});

				await voteRepository.save(vote);

				// Обновляем лимит голосов
				voteLimit.addVote();
				await voteLimitRepository.save(voteLimit);

				// Обновляем счетчик голосов идеи
				const newVoteCount = await voteRepository.count({ where: { ideaId } });
				await ideaRepository.update(ideaId, { votesCount: newVoteCount });

				ctx.body = {
					success: true,
					message: 'Голос успешно засчитан',
					data: {
						ideaId,
						votesCount: newVoteCount,
						votesRemaining: voteLimit.maxVotes - voteLimit.votesUsed
					}
				};
			});

	} catch (error) {
		console.error('Ошибка при голосовании:', error);
		ctx.status = 500;
		ctx.body = {
			success: false,
			message: 'Ошибка при голосовании'
		};
	}
});

// Получить статистику голосов для IP
router.get('/stats/votes', async (ctx: Context) => {
	try {
		const ipAddress = ctx.state.clientIp || ctx.ip;
		const voteLimitRepository = AppDataSource.getRepository(VoteLimit);
		const voteRepository = AppDataSource.getRepository(Vote);

		// Получаем лимит голосов
		let voteLimit = await voteLimitRepository.findOne({
			where: { ipAddress }
		});

		if (!voteLimit) {
			voteLimit = {
				id: 0,
				ipAddress,
				votesUsed: 0,
				maxVotes: 10,
				createdAt: new Date(),
				updatedAt: new Date(),
				canVote: () => true,
				addVote: () => {},
				removeVote: () => {}
			} as VoteLimit;
		}

		// Получаем голоса пользователя
		const userVotes = await voteRepository.find({
			where: { ipAddress },
			relations: ['idea'],
			order: { createdAt: 'DESC' }
		});

		ctx.body = {
			success: true,
			data: {
				voteLimit: {
					votesUsed: voteLimit.votesUsed,
					maxVotes: voteLimit.maxVotes,
					votesRemaining: voteLimit.maxVotes - voteLimit.votesUsed
				},
				userVotes: userVotes.map(vote => ({
					id: vote.id,
					ideaId: vote.ideaId,
					ideaTitle: vote.idea?.title,
					createdAt: vote.createdAt
				}))
			}
		};
	} catch (error) {
		console.error('Ошибка при получении статистики:', error);
		ctx.status = 500;
		ctx.body = {
			success: false,
			message: 'Ошибка при получении статистики'
		};
	}
});


export { router as ideasRouter };

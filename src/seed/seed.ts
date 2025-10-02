import { AppDataSource } from '../config/database';
import { config } from 'dotenv';
import { Idea } from '../entities/Idea';
import { Vote } from '../entities/Vote';
import { VoteLimit } from '../entities/VoteLimit';

config();

// Данные для заполнения
const seedIdeas = [
    {
        title: 'Мобильное приложение',
        description: 'Создать мобильное приложение для iOS и Android с полным функционалом веб-версии. Включить push-уведомления и офлайн-режим.',
        votesCount: 0
    },
    {
        title: 'Система аналитики',
        description: 'Добавить детальную аналитику использования продукта: метрики, графики, отчеты по пользователям и функциям.',
        votesCount: 0
    },
    {
        title: 'API для интеграций',
        description: 'Разработать RESTful API для интеграции с внешними сервисами. Поддержка webhook и OAuth аутентификации.',
        votesCount: 0
    },
    {
        title: 'Темная тема',
        description: 'Добавить поддержку темной темы интерфейса с автоматическим переключением по времени суток.',
        votesCount: 0
    },
    {
        title: 'Система уведомлений',
        description: 'Реализовать систему уведомлений: email, SMS, push. Настраиваемые триггеры и шаблоны сообщений.',
        votesCount: 0
    },
    {
        title: 'Многоязычность',
        description: 'Добавить поддержку нескольких языков интерфейса: английский, испанский, французский, немецкий.',
        votesCount: 0
    },
    {
        title: 'Система ролей',
        description: 'Внедрить систему ролей и разрешений для разных типов пользователей: админ, модератор, пользователь.',
        votesCount: 0
    },
    {
        title: 'Экспорт данных',
        description: 'Добавить возможность экспорта данных в различных форматах: CSV, Excel, PDF, JSON.',
        votesCount: 0
    },
    {
        title: 'Чат поддержки',
        description: 'Интегрировать чат поддержки с возможностью обмена файлами и видео-звонками.',
        votesCount: 0
    },
    {
        title: 'Автоматизация тестирования',
        description: 'Настроить CI/CD пайплайн с автоматическим тестированием, деплоем и мониторингом.',
        votesCount: 0
    },
    {
        title: 'Система рекомендаций',
        description: 'Внедрить алгоритм машинного обучения для персонализированных рекомендаций контента и функций на основе поведения пользователей.',
        votesCount: 0
    }
];

export const runSeed = async (): Promise<void> => {
    try {
        console.log('🌱 Начинаем заполнение базы данных...');

        // Инициализируем подключение
        await AppDataSource.initialize();

        // Получаем репозитории
        const ideaRepository = AppDataSource.getRepository(Idea);
        const voteRepository = AppDataSource.getRepository(Vote);
        const voteLimitRepository = AppDataSource.getRepository(VoteLimit);

        // Очищаем существующие данные (в правильном порядке из-за внешних ключей)
        console.log('🧹 Очищаем существующие данные...');
        await AppDataSource.query('DELETE FROM votes');
        await AppDataSource.query('DELETE FROM vote_limits');
        await AppDataSource.query('DELETE FROM ideas');

        // Создаем идеи
        console.log('💡 Создаем идеи для развития продукта...');
        const ideas = await ideaRepository.save(seedIdeas);
        console.log(`✅ Создано ${ideas.length} идей`);

        // Создаем несколько тестовых голосов для демонстрации
        console.log('🗳️ Создаем тестовые голоса...');
        const testVotes = [
            { ipAddress: '192.168.1.1', ideaId: ideas[0].id },
            { ipAddress: '192.168.1.1', ideaId: ideas[1].id },
            { ipAddress: '192.168.1.2', ideaId: ideas[0].id },
            { ipAddress: '192.168.1.3', ideaId: ideas[2].id },
            { ipAddress: '192.168.1.3', ideaId: ideas[3].id },
            { ipAddress: '192.168.1.4', ideaId: ideas[10].id }, // Голос за новую идею "Система рекомендаций"
        ];

        const votes = await voteRepository.save(testVotes);
        console.log(`✅ Создано ${votes.length} тестовых голосов`);

        // Обновляем счетчики голосов для идей
        console.log('📊 Обновляем счетчики голосов...');
        for (const idea of ideas) {
            const voteCount = await voteRepository.count({ where: { ideaId: idea.id } });
            await ideaRepository.update(idea.id, { votesCount: voteCount });
        }

        // Создаем тестовые лимиты голосов
        console.log('🔒 Создаем тестовые лимиты голосов...');
        const testLimits = [
            { ipAddress: '192.168.1.1', votesUsed: 2, maxVotes: 10 },
            { ipAddress: '192.168.1.2', votesUsed: 1, maxVotes: 10 },
            { ipAddress: '192.168.1.3', votesUsed: 2, maxVotes: 10 },
            { ipAddress: '192.168.1.4', votesUsed: 1, maxVotes: 10 },
        ];

        const voteLimits = await voteLimitRepository.save(testLimits);
        console.log(`✅ Создано ${voteLimits.length} лимитов голосов`);

        console.log('🎉 База данных успешно заполнена!');
        console.log('\n📊 Созданные данные:');
        console.log(`💡 Идеи: ${ideas.length}`);
        console.log(`🗳️ Голоса: ${votes.length}`);
        console.log(`🔒 Лимиты: ${voteLimits.length}`);

        console.log('\n🌟 Топ-3 идеи по голосам:');
        const topIdeas = await ideaRepository.find({
            order: { votesCount: 'DESC' },
            take: 3
        });
        
        topIdeas.forEach((idea, index) => {
            console.log(`${index + 1}. "${idea.title}" - ${idea.votesCount} голосов`);
        });

    } catch (error) {
        console.error('❌ Ошибка при заполнении базы данных:', error);
        throw error;
    } finally {
        // Закрываем подключение
        await AppDataSource.destroy();
    }
};

// Запуск seed скрипта, если файл выполняется напрямую
if (require.main === module) {
    runSeed()
        .then(() => {
            console.log('✅ Seed скрипт завершен успешно');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Seed скрипт завершился с ошибкой:', error);
            process.exit(1);
        });
}

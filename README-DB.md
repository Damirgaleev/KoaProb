# Настройка базы данных PostgreSQL

## 🚀 Быстрый старт

### Один скрипт для всего

```bash
# Запустить БД, заполнить данными и запустить сервер
npm run quickstart
```

Эта команда автоматически:
1. Запустит PostgreSQL в Docker
2. Подождет 5 секунд для инициализации БД
3. Заполнит базу тестовыми данными
4. Запустит сервер в режиме разработки

### Пошаговый запуск

#### 1. Запуск локальной PostgreSQL

```bash
# Запустить PostgreSQL в Docker
npm run db:start

# Или запустить с pgAdmin (веб-интерфейс для управления БД)
npm run pgadmin
```

#### 2. Заполнение базы данных тестовыми данными

```bash
# Заполнить БД seed данными
npm run db:seed
```

#### 3. Запуск сервера

```bash
# Запустить сервер в режиме разработки
npm run dev
```

#### 4. Полный сброс базы данных

```bash
# Остановить, удалить данные, запустить заново и заполнить
npm run db:reset
```

## Доступные команды

| Команда | Описание |
|---------|----------|
| `npm run quickstart` | **🚀 Быстрый старт**: БД + данные + сервер |
| `npm run dev` | Запустить сервер в режиме разработки |
| `npm run start` | Запустить сервер в продакшн режиме |
| `npm run build` | Скомпилировать TypeScript |
| `npm run db:start` | Запустить PostgreSQL в Docker |
| `npm run db:stop` | Остановить все контейнеры |
| `npm run db:restart` | Перезапустить PostgreSQL |
| `npm run db:seed` | Заполнить БД тестовыми данными |
| `npm run db:reset` | Полный сброс БД с пересозданием |
| `npm run db:logs` | Показать логи PostgreSQL |
| `npm run pgadmin` | Запустить pgAdmin (веб-интерфейс) |

## Подключение к базе данных

### Параметры подключения:
- **Хост**: localhost
- **Порт**: 5432
- **База данных**: testpr_db
- **Пользователь**: postgres
- **Пароль**: password

### pgAdmin (веб-интерфейс):
- **URL**: http://localhost:8080
- **Email**: admin@example.com
- **Пароль**: admin

## Структура проекта

```
src/
├── config/
│   └── database.ts          # Конфигурация TypeORM
├── seed/
│   └── seed.ts             # Скрипт для заполнения БД
├── entities/               # Сущности TypeORM (создайте здесь свои)
└── migrations/             # Миграции (если нужны)
```

## Создание собственных сущностей

1. Создайте файл в папке `src/entities/`
2. Используйте декораторы TypeORM для определения структуры
3. Добавьте сущность в конфигурацию `src/config/database.ts`

Пример:
```typescript
// src/entities/MyEntity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('my_table')
export class MyEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}
```

## Переменные окружения

Скопируйте `env.example` в `.env` и настройте под свои нужды:

```bash
cp env.example .env
```

## Troubleshooting

### Проблема с портом 5432
Если порт 5432 занят, измените порт в `docker-compose.yml`:
```yaml
ports:
  - "5433:5432"  # Используйте другой порт
```

И обновите `.env`:
```
DB_PORT=5433
```

### Проблемы с правами доступа
```bash
# Очистить все данные Docker
docker-compose down -v
docker system prune -a

# Запустить заново
npm run db:start
npm run db:seed
```

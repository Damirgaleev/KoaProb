# 🚀 TestPr - API для голосования за идеи

Система для сбора и голосования за идеи развития продукта с ограничением по IP-адресам.

Для простоты тестов скрытые переменные подставляются автоматом
сам файл .env не закидываю в gitignore

## ⚡ Быстрый старт

### Один скрипт для всего

```bash
# Клонируйте репозиторий
git clone <repository-url>
cd testPr

# Установите зависимости
npm install

# Запустите БД, заполните данными и запустите сервер
npm run quickstart
```

**Готово!** 🎉 

Сервер будет доступен по адресу: http://localhost:3500

### Что делает `npm run quickstart`:

1. 🐘 Запускает PostgreSQL в Docker
2. ⏱️ Ждет 5 секунд для инициализации БД
3. 🌱 Заполняет базу тестовыми данными (11 идей)
4. 🚀 Запускает сервер в режиме разработки

## 📋 Доступные команды

| Команда | Описание |
|---------|----------|
| `npm run quickstart` | **🚀 Быстрый старт**: БД + данные + сервер |
| `npm run dev` | Запустить сервер в режиме разработки |
| `npm run start` | Запустить сервер в продакшн режиме |
| `npm run build` | Скомпилировать TypeScript |
| `npm run db:start` | Запустить PostgreSQL в Docker |
| `npm run db:stop` | Остановить все контейнеры |
| `npm run db:seed` | Заполнить БД тестовыми данными |
| `npm run db:reset` | Полный сброс БД с пересозданием |

## 🔗 API Endpoints

### Основные маршруты

- **GET** `/` - Информация о сервере
- **GET** `/api/ideas` - Список идей с пагинацией
- **GET** `/api/ideas/:id` - Детали конкретной идеи
- **POST** `/api/ideas/:id/vote` - Проголосовать за идею
- **DELETE** `/api/ideas/:id/vote` - Отменить голос
- **GET** `/api/ideas/stats/votes` - Статистика голосования

### Авторизация

Все API endpoints требуют базовую авторизацию:
- **Username**: `admin`
- **Password**: `secret`

### Примеры запросов

```bash
# Получить список идей
curl -u admin:secret "http://localhost:3500/api/ideas"

# Проголосовать за идею
curl -u admin:secret -X POST "http://localhost:3500/api/ideas/1/vote"

# Получить статистику
curl -u admin:secret "http://localhost:3500/api/ideas/stats/votes"
```

## 🗄️ База данных

### Структура

- **ideas** - Идеи для развития продукта
- **votes** - Голоса пользователей (связаны с IP)
- **vote_limits** - Лимиты голосов по IP-адресам

### Ограничения

- С одного IP-адреса можно проголосовать максимум за **10 разных идей**
- За одну идею с одного IP можно проголосовать только **один раз**
- При превышении лимита возвращается ошибка **409 Conflict**

## 🛠️ Технологии

- **Backend**: Node.js + Koa.js + TypeScript
- **База данных**: PostgreSQL + TypeORM
- **Контейнеризация**: Docker + Docker Compose
- **Авторизация**: Basic Auth

## 📁 Структура проекта

```
src/
├── config/
│   └── database.ts          # Конфигурация TypeORM
├── entities/               # Сущности базы данных
│   ├── Idea.ts            # Модель идеи
│   ├── Vote.ts            # Модель голоса
│   └── VoteLimit.ts       # Модель лимита голосов
├── routes/                # API маршруты
│   ├── routes.ts          # Основной роутер
│   └── api/
│       └── ideas.api.routes.ts  # Маршруты для идей
├── middlewares/           # Middleware функции
│   ├── client-ip.middleware.ts  # Определение IP клиента
│   └── errors.middlewares.ts    # Обработка ошибок
├── seed/                  # Скрипты для заполнения БД
│   └── seed.ts           # Seed скрипт
└── index.ts              # Точка входа приложения
```

## 🔧 Настройка

### Переменные окружения

Скопируйте `env.example` в `.env`:

```bash
cp env.example .env
```

Основные настройки:
- `PORT=3500` - Порт сервера
- `BASIC_AUTH_API=admin` - Логин для API
- `BASIC_AUTH_API_PASSWORD=secret` - Пароль для API
- `DB_*` - Настройки базы данных

### База данных

Подробная документация по настройке БД: [README-DB.md](./README-DB.md)

## 📚 Документация

- [API Documentation](./API-DOCS.md) - Подробное описание API
- [Database Setup](./README-DB.md) - Настройка базы данных

## 🐛 Troubleshooting

### Проблемы с портом 5432
Если порт PostgreSQL занят, измените порт в `docker-compose.yml` и `.env`

### Проблемы с авторизацией
Убедитесь, что файл `.env` создан и содержит правильные настройки Basic Auth

### Полный сброс
```bash
npm run db:reset  # Полностью пересоздать БД
```

## 📄 Лицензия

ISC

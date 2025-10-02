# API Документация - Система голосования за идеи

## Обзор

API для публичной страницы голосования за идеи развития продукта с ограничением голосов по IP-адресу.

## Базовый URL
```
http://localhost:3500/api/ideas
```

## Аутентификация
Все запросы требуют Basic Auth:
- Username: `admin` (или из переменной `BASIC_AUTH_API`)
- Password: `secret` (или из переменной `BASIC_AUTH_API_PASSWORD`)

## Endpoints

### 1. Получить список идей

**GET** `/api/ideas`

#### Параметры запроса:
- `page` (number, optional) - Номер страницы (по умолчанию: 1)
- `limit` (number, optional) - Количество идей на странице (по умолчанию: 10)
- `sortBy` (string, optional) - Поле для сортировки: `votesCount`, `createdAt`, `title` (по умолчанию: `votesCount`)
- `sortOrder` (string, optional) - Порядок сортировки: `ASC`, `DESC` (по умолчанию: `DESC`)
- `search` (string, optional) - Поиск по названию и описанию

#### Пример запроса:
```bash
curl -u admin:secret "http://localhost:3500/api/ideas?page=1&limit=5&sortBy=votesCount&sortOrder=DESC"
```

#### Ответ:
```json
{
  "success": true,
  "data": {
    "ideas": [
      {
        "id": 1,
        "title": "Мобильное приложение",
        "description": "Создать мобильное приложение для iOS и Android...",
        "votesCount": 2,
        "isActive": true,
        "createdAt": "2024-01-15T10:00:00.000Z",
        "updatedAt": "2024-01-15T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 5,
      "total": 10,
      "totalPages": 2
    }
  }
}
```

### 2. Проголосовать за идею

**POST** `/api/ideas/:id/vote`

#### Пример запроса:
```bash
curl -u admin:secret -X POST "http://localhost:3500/api/ideas/1/vote"
```

#### Ответ при успехе:
```json
{
  "success": true,
  "message": "Голос успешно засчитан",
  "data": {
    "ideaId": 1,
    "votesCount": 3,
    "votesRemaining": 7
  }
}
```

#### Ответ при ошибке (уже голосовал):
```json
{
  "success": false,
  "message": "Вы уже голосовали за эту идею",
  "error": "VOTE_ALREADY_EXISTS"
}
```

#### Ответ при ошибке (превышен лимит):
```json
{
  "success": false,
  "message": "Превышен лимит голосов. Максимум 10 голосов с одного IP-адреса",
  "error": "VOTE_LIMIT_EXCEEDED",
  "data": {
    "votesUsed": 10,
    "maxVotes": 10,
    "votesRemaining": 0
  }
}
```

### 4. Получить статистику голосов для IP

**GET** `/api/ideas/stats/votes`

#### Пример запроса:
```bash
curl -u admin:secret "http://localhost:3500/api/ideas/stats/votes"
```

#### Ответ:
```json
{
  "success": true,
  "data": {
    "voteLimit": {
      "votesUsed": 2,
      "maxVotes": 10,
      "votesRemaining": 8
    },
    "userVotes": [
      {
        "id": 1,
        "ideaId": 1,
        "ideaTitle": "Мобильное приложение",
        "createdAt": "2024-01-15T10:05:00.000Z"
      },
      {
        "id": 2,
        "ideaId": 3,
        "ideaTitle": "API для интеграций",
        "createdAt": "2024-01-15T10:10:00.000Z"
      }
    ]
  }
}
```

## Коды ошибок

- `400` - Неверные параметры запроса
- `404` - Идея не найдена
- `409` - Конфликт (уже голосовал или превышен лимит голосов)
- `500` - Внутренняя ошибка сервера

## Ограничения

1. **Лимит голосов**: Максимум 10 голосов с одного IP-адреса
2. **Уникальность голоса**: Один голос с IP-адреса на одну идею
3. **Активные идеи**: Отображаются только активные идеи (`isActive = true`)

## Примеры использования

### JavaScript (fetch)
```javascript
// Получить список идей
const response = await fetch('http://localhost:3500/api/ideas', {
  headers: {
    'Authorization': 'Basic ' + btoa('admin:secret')
  }
});
const data = await response.json();

// Проголосовать за идею
const voteResponse = await fetch('http://localhost:3500/api/ideas/1/vote', {
  method: 'POST',
  headers: {
    'Authorization': 'Basic ' + btoa('admin:secret')
  }
});
const voteData = await voteResponse.json();
```

### cURL
```bash
# Получить топ-5 идей
curl -u admin:secret "http://localhost:3500/api/ideas?limit=5&sortBy=votesCount&sortOrder=DESC"

# Поиск по ключевому слову
curl -u admin:secret "http://localhost:3500/api/ideas?search=мобильное"

# Фильтр по категории
curl -u admin:secret "http://localhost:3500/api/ideas?category=UI/UX"
```

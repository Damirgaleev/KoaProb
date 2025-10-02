-- Инициализационный скрипт для PostgreSQL
-- Этот файл выполняется при первом запуске контейнера

-- Создание расширений (если нужны)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Создание дополнительных ролей (если нужны)
-- CREATE ROLE app_user WITH LOGIN PASSWORD 'app_password';
-- GRANT CONNECT ON DATABASE testpr_db TO app_user;

-- Настройка прав доступа
GRANT ALL PRIVILEGES ON DATABASE testpr_db TO postgres;

-- Комментарий для информации
COMMENT ON DATABASE testpr_db IS 'База данных для проекта testPr';

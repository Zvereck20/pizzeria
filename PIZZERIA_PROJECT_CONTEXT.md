# Pizzeria Project Context

## Описание проекта

Pizzeria — интернет-магазин доставки еды с поддержкой нескольких заведений.

Пользователь может:

- просматривать каталог продуктов
- настраивать ингредиенты
- добавлять товары в корзину
- оформлять заказ
- выбирать доставку или самовывоз
- вводить адрес доставки
- автоматически выбирать ближайшее заведение

---

# Технологический стек

## Frontend

- React
- Vite
- TypeScript
- Redux Toolkit
- RTK Query
- scss

## Admin Panel

- React
- MUI

## Backend

- Node.js
- Express

## Database

- MongoDB

## Инфраструктура

- Docker
- docker-compose
- volumes для hot reload

## Работа с файлами

- Multer

## Валидация

- Joi

## Карты

- Yandex Maps API

---

# Архитектура проекта

/client
/admin
/server

client — пользовательское приложение  
admin — админ панель  
server — backend API

---

# Основные сущности

## Product

id
name
description
price
imageUrl
category
ingredients[]

Категории:

'pizza'
'combo'
'salad'
'soup'
'paste'
'appetizers'
'rolls'
'dessert'
'drink'

---

## Ingredient

id
name
image
price
available

---

## Store

id
name
address
isActive

---

## Order

id
items[]
orderType
address
storeId
createdAt
updatedAt

orderType:

delivery | pickup

address — optional

---

# Основной функционал

## Каталог

- отображение продуктов
- фильтрация по категориям

## Карточка товара

- отображение ингредиентов
- возможность добавлять ингредиенты

## Корзина

- добавление товаров
- изменение количества
- удаление

## Оформление заказа

- ввод адреса
- выбор типа заказа
- выбор заведения

---

# Особенности проекта

### Мульти-заведения

Система поддерживает несколько заведений.

Заведение выбирается:

- автоматически по адресу пользователя
- либо вручную

---

### Карты

Используется Yandex Maps API:

- ввод адреса
- геокодинг
- определение координат
- поиск ближайшего заведения

---

# Архитектурные принципы

- разделение UI и бизнес-логики
- использование RTK Query для API
- типизация TypeScript
- модульная структура
- минимизация дублирования

---

# Dev правила

- зависимости устанавливаются только внутри Docker
- MongoDB работает в контейнере
- hot reload через volumes

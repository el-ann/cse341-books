# Books API Spec

## Purpose
Create a basic web service that returns book data.

## Data Model
Book fields:
- id: string
- author: string
- title: string
- publicationDate: string

## Endpoints
1. GET /books
- Return all books.
- Response status: 200 on success.

2. GET /books/:id
- Returns one book with matching id.
- Response status: 200 on success.
- If no match: 404

## Initial assumptions
- Data is stored in MongoDB collection named books.
- API returns JSON.
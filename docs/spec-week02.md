# Books API Week 02 Spec - Version 1

## Feature 1: Book CRUD Operations and Author References

### Goal
Update the existing Week 01 book API so book documents include a reference to an author and the API supports all CRUD operations for books. Every book route must be documented and testable in Swagger.

### Data Model
Book documents will be stored in the `books` collection.

Required book fields:
- `id`: string, required, custom id such as `b1`
- `authorId`: string, required, references the `id` field of an author document
- `title`: string, required
- `publicationDate`: string, required

Books will continue to use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Authors
Each book will identify its author with an `authorId` field. The value of `authorId` must match the custom `id` value of an existing author document.

When creating or updating a book, the API should reject the request with a `400` status code if the submitted `authorId` does not match an existing author.

### Routes

#### GET /books
Purpose: Return all books.

Success:
- Status code: `200`
- Response body: an array of book objects

Errors:
- `500` if an unexpected server or database error occurs

#### GET /books/:id
Purpose: Return one book by its custom id.

Success:
- Status code: `200`
- Response body: the matching book object

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### POST /books
Purpose: Create a new book.

Request body:

    {
      "id": "b4",
      "authorId": "a1",
      "title": "Example Book Title",
      "publicationDate": "2026-01-15"
    }

Success:
- Status code: `201`
- Response body: the newly created book object

Errors:
- `400` if a required field is missing
- `400` if the `id` already exists
- `400` if the `authorId` does not match an existing author
- `500` if an unexpected server or database error occurs

#### PUT /books/:id
Purpose: Update an existing book.

Request body:

    {
      "authorId": "a2",
      "title": "Updated Book Title",
      "publicationDate": "2026-02-20"
    }

Success:
- Status code: `200`
- Response body: the updated book object

Errors:
- `400` if a required field is missing
- `400` if the `authorId` does not match an existing author
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /books/:id
Purpose: Delete an existing book.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

### Swagger Documentation
Swagger must document every book route.

### Deployment Expectations
After implementation, the book routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every book route from the browser.

## Feature 2: Author CRUD Operations

### Goal
Add an authors collection to the API and provide all CRUD operations for authors. Every author route must be documented and testable in Swagger.

### Data Model
Author documents will be stored in the `authors` collection.

Required author fields:
- `id`: string, required, custom id such as `a1`
- `name`: string, required, the author's full name
- `birthYear`: number, required, a whole number such as `1975`

Authors will use custom string ids instead of MongoDB `_id` values for route parameters.

Example author document:

```json
{
  "id": "a1",
  "name": "John Smith",
  "birthYear": 1975
}
```

### Relationship to Books
Books reference authors through the `authorId` field. An author cannot be deleted while any book still references it.

### Routes

#### GET /authors
Purpose: Return all authors.

Success:
- Status code: `200`
- Response body: an array of author objects

Errors:
- `500` if an unexpected server or database error occurs: `{ "message": "Internal server error" }`

#### GET /authors/:id
Purpose: Return one author by their custom id.

Success:
- Status code: `200`
- Response body: the matching author object

Errors:
- `404` if no author exists with that id: `{ "message": "Author not found" }`
- `500` if an unexpected server or database error occurs: `{ "message": "Internal server error" }`

#### POST /authors
Purpose: Create a new author.

Request body:

```json
{
  "id": "a1",
  "name": "John Smith",
  "birthYear": 1975
}
```

Success:
- Status code: `201`
- Response body: the newly created author object

Errors:
- `400` if a required field is missing or invalid, including a `birthYear` that is not a whole number: `{ "message": "Missing or invalid required fields" }`
- `400` if the `id` already exists: `{ "message": "Author ID already exists" }`
- `500` if an unexpected server or database error occurs: `{ "message": "Internal server error" }`

#### PUT /authors/:id
Purpose: Update an existing author. The id comes from the URL and is not sent in the body.

Request body:

```json
{
  "name": "John Smith",
  "birthYear": 1976
}
```

Success:
- Status code: `200`
- Response body: the updated author object

Errors:
- `400` if a required field is missing or invalid, including a `birthYear` that is not a whole number: `{ "message": "Missing or invalid required fields" }`
- `404` if no author exists with that id: `{ "message": "Author not found" }`
- `500` if an unexpected server or database error occurs: `{ "message": "Internal server error" }`

#### DELETE /authors/:id
Purpose: Delete an existing author.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no author exists with that id: `{ "message": "Author not found" }`
- `409` if books still reference the author: `{ "message": "Cannot delete author because books are still linked to this author" }`
- `500` if an unexpected server or database error occurs: `{ "message": "Internal server error" }`

### Swagger Documentation
Swagger must document every author route.

### Deployment Expectations
After implementation, the author routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every author route from the browser.


---

# Books API Week 02 Spec - Version 2

## Shared Rules (apply to books and authors)

### Validation
- Required string fields (`id`, `authorId`, `title`, `name`, `publicationDate`) must be strings and must not be empty or only whitespace.
- `birthYear` must be a whole number.
- `publicationDate` must be an ISO 8601 date in the format `YYYY-MM-DD` (for example, `2026-01-15`) and must be a real calendar date.
- The API saves only the fields defined in the data model. Any extra fields in a request body are ignored.

### Responses
- API responses include only the custom fields from the data model. MongoDB's `_id` is not returned.
- All error responses use the shape `{ "message": "..." }`.
- Error messages never include stack traces, database details, or other internal information. Real errors are logged on the server only.

### Indexes
- Unique index on `id` in the `books` collection.
- Unique index on `id` in the `authors` collection.
- Index on `authorId` in the `books` collection.
- If a unique index rejects an insert because of a duplicate id (a race between two requests), the API returns the same `400` response as a normal duplicate id check.

### Known limits
- `GET /books` and `GET /authors` return all records. Pagination is not included in Week 02.

## Feature 1: Book CRUD Operations and Author References

### Data Model
Book documents are stored in the `books` collection.

- `id`: string, required, unique custom id such as `b1`
- `authorId`: string, required, must match the `id` of an existing author
- `title`: string, required
- `publicationDate`: string, required, ISO 8601 date (`YYYY-MM-DD`)

Example book:

```json
{
  "id": "b1",
  "authorId": "a1",
  "title": "Patterns of Light",
  "publicationDate": "2021-08-17"
}
```

### Routes

#### GET /books
- `200`: an array of book objects (empty array if there are none)
- `500`: `{ "message": "Internal server error" }`

#### GET /books/:id
- `200`: the matching book object
- `404`: `{ "message": "Book not found" }`
- `500`: `{ "message": "Internal server error" }`

#### POST /books
Request body: `id`, `authorId`, `title`, `publicationDate`.

Checks run in this order:
1. Required fields and types are valid, otherwise `400`.
2. The `id` does not already exist, otherwise `400`.
3. The `authorId` matches an existing author, otherwise `400`.

Responses:
- `201`: the newly created book object

```json
{
  "id": "b4",
  "authorId": "a1",
  "title": "Example Book Title",
  "publicationDate": "2026-01-15"
}
```

- `400`: `{ "message": "Missing or invalid required fields" }`
- `400`: `{ "message": "Book ID already exists" }`
- `400`: `{ "message": "Author does not exist" }`
- `500`: `{ "message": "Internal server error" }`

#### PUT /books/:id
Request body: `authorId`, `title`, `publicationDate`. The id comes from the URL. If the body includes an `id`, it is ignored.

Checks run in this order:
1. The book exists, otherwise `404`.
2. Required fields and types are valid, otherwise `400`.
3. The `authorId` matches an existing author, otherwise `400`.

A successful update returns `200` even if the submitted values are identical to the stored values.

Responses:
- `200`: the updated book object

```json
{
  "id": "b4",
  "authorId": "a2",
  "title": "Updated Book Title",
  "publicationDate": "2026-02-20"
}
```

- `404`: `{ "message": "Book not found" }`
- `400`: `{ "message": "Missing or invalid required fields" }`
- `400`: `{ "message": "Author does not exist" }`
- `500`: `{ "message": "Internal server error" }`

#### DELETE /books/:id
- `204`: book deleted, no response body
- `404`: `{ "message": "Book not found" }`
- `500`: `{ "message": "Internal server error" }`

### Swagger Documentation
Every book route is documented in Swagger, including request bodies, examples, and all response status codes listed above.

### Deployment Expectations
The book routes work locally and on Render, and every book route can be tested from the deployed `/api-docs` page.


## Feature 2: Author CRUD Operations

### Data Model
Author documents are stored in the `authors` collection.

- `id`: string, required, unique custom id such as `a1`
- `name`: string, required, the author's full name
- `birthYear`: number, required, a whole number such as `1975`

Example author:

```json
{
  "id": "a1",
  "name": "John Smith",
  "birthYear": 1975
}
```

### Relationship to Books
Books reference authors through the `authorId` field. To decide whether an author can be deleted, the API checks whether any book has an `authorId` equal to that author's `id`.

### Routes

#### GET /authors
- `200`: an array of author objects (empty array if there are none)
- `500`: `{ "message": "Internal server error" }`

#### GET /authors/:id
- `200`: the matching author object
- `404`: `{ "message": "Author not found" }`
- `500`: `{ "message": "Internal server error" }`

#### POST /authors
Request body: `id`, `name`, `birthYear`.

Checks run in this order:
1. Required fields and types are valid (`birthYear` must be a whole number), otherwise `400`.
2. The `id` does not already exist, otherwise `400`.

Responses:
- `201`: the newly created author object

```json
{
  "id": "a4",
  "name": "Example Author",
  "birthYear": 1980
}
```

- `400`: `{ "message": "Missing or invalid required fields" }`
- `400`: `{ "message": "Author ID already exists" }`
- `500`: `{ "message": "Internal server error" }`

#### PUT /authors/:id
Request body: `name`, `birthYear`. The id comes from the URL. If the body includes an `id`, it is ignored.

Checks run in this order:
1. The author exists, otherwise `404`.
2. Required fields and types are valid, otherwise `400`.

A successful update returns `200` even if the submitted values are identical to the stored values.

Responses:
- `200`: the updated author object

```json
{
  "id": "a4",
  "name": "Example Author",
  "birthYear": 1981
}
```

- `404`: `{ "message": "Author not found" }`
- `400`: `{ "message": "Missing or invalid required fields" }`
- `500`: `{ "message": "Internal server error" }`

#### DELETE /authors/:id
Checks run in this order:
1. The author exists, otherwise `404`.
2. No book references the author, otherwise `409`.

Responses:
- `204`: author deleted, no response body
- `404`: `{ "message": "Author not found" }`
- `409`: `{ "message": "Cannot delete author because books are still linked to this author" }`
- `500`: `{ "message": "Internal server error" }`

### Swagger Documentation
Every author route is documented in Swagger, including request bodies, examples, and all response status codes listed above.

### Deployment Expectations
The author routes work locally and on Render, and every author route can be tested from the deployed `/api-docs` page.
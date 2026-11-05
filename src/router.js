import express from 'express';
import { getBooksHandler, getBookByIdHandler } from './controllers/books.js';
import { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor } from './controllers/authors.js';

const router = express.Router();

/**
 * @openapi
 * /books:
 *   get:
 *     summary: Get all books
 *     tags:
 *       - Books
 *     responses:
 *       200:
 *         description: A list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   id:
 *                     type: string
 *                   author:
 *                     type: string
 *                   title:
 *                     type: string
 *                   publicationDate:
 *                     type: string
 *             example:
 *               - _id: 6ae3e9b969a65477e68717ac
 *                 id: b1
 *                 author: Maya Rivera
 *                 title: Patterns of Light
 *                 publicationDate: "2021-08-17"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */
router.get('/books', getBooksHandler);

/**
 * @openapi
 * /books/{id}:
 *   get:
 *     summary: Get one book by id
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: b1
 *     responses:
 *       200:
 *         description: The requested book
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 id:
 *                   type: string
 *                 author:
 *                   type: string
 *                 title:
 *                   type: string
 *                 publicationDate:
 *                   type: string
 *             example:
 *               _id: 6ae3e9b969a65477e68717ac
 *               id: b1
 *               author: Maya Rivera
 *               title: Patterns of Light
 *               publicationDate: "2021-08-17"
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             example:
 *               message: Book not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */
router.get('/books/:id', getBookByIdHandler);

/**
 * @openapi
 * /authors:
 *   get:
 *     summary: Get all authors
 *     tags:
 *       - Authors
 *     responses:
 *       200:
 *         description: A list of authors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   birthYear:
 *                     type: integer
 *             example:
 *               - id: a1
 *                 name: Maya Rivera
 *                 birthYear: 1980
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */
router.get('/authors', getAllAuthors);

/**
 * @openapi
 * /authors/{id}:
 *   get:
 *     summary: Get one author by id
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: a1
 *     responses:
 *       200:
 *         description: The requested author
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 birthYear:
 *                   type: integer
 *             example:
 *               id: a1
 *               name: Maya Rivera
 *               birthYear: 1980
 *       404:
 *         description: Author not found
 *         content:
 *           application/json:
 *             example:
 *               message: Author not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */
router.get('/authors/:id', getAuthorById);

/**
 * @openapi
 * /authors:
 *   post:
 *     summary: Create a new author
 *     tags:
 *       - Authors
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *               - birthYear
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               birthYear:
 *                 type: integer
 *           example:
 *             id: a4
 *             name: Example Author
 *             birthYear: 1980
 *     responses:
 *       201:
 *         description: Author created successfully
 *         content:
 *           application/json:
 *             example:
 *               id: a4
 *               name: Example Author
 *               birthYear: 1980
 *       400:
 *         description: Missing or invalid fields, or the author id already exists
 *         content:
 *           application/json:
 *             examples:
 *               invalidFields:
 *                 value:
 *                   message: Missing or invalid required fields
 *               duplicateId:
 *                 value:
 *                   message: Author ID already exists
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */
router.post('/authors', createAuthor);

/**
 * @openapi
 * /authors/{id}:
 *   put:
 *     summary: Update an existing author
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: a4
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - birthYear
 *             properties:
 *               name:
 *                 type: string
 *               birthYear:
 *                 type: integer
 *           example:
 *             name: Example Author
 *             birthYear: 1981
 *     responses:
 *       200:
 *         description: Author updated successfully
 *         content:
 *           application/json:
 *             example:
 *               id: a4
 *               name: Example Author
 *               birthYear: 1981
 *       400:
 *         description: Missing or invalid fields
 *         content:
 *           application/json:
 *             example:
 *               message: Missing or invalid required fields
 *       404:
 *         description: Author not found
 *         content:
 *           application/json:
 *             example:
 *               message: Author not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */
router.put('/authors/:id', updateAuthor);

/**
 * @openapi
 * /authors/{id}:
 *   delete:
 *     summary: Delete an author
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: a4
 *     responses:
 *       204:
 *         description: Author deleted successfully (no response body)
 *       404:
 *         description: Author not found
 *         content:
 *           application/json:
 *             example:
 *               message: Author not found
 *       409:
 *         description: Books are still linked to this author
 *         content:
 *           application/json:
 *             example:
 *               message: Cannot delete author because books are still linked to this author
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */
router.delete('/authors/:id', deleteAuthor);

export default router;
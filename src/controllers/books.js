import { getAllBooks, getBookById, bookExists, authorExists, createBook, updateBook, deleteBook } from '../models/books.js';

const isValidDate = (date) => {
    if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return false;
    }

    const parsedDate = new Date(`${date}T00:00:00.000Z`);

    return !Number.isNaN(parsedDate.getTime()) &&
        parsedDate.toISOString().slice(0, 10) === date;
};

const isValidBookData = (data, includeId = false) => {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        return false;
    }

    const requiredFields = includeId
        ? ['id', 'authorId', 'title', 'publicationDate']
        : ['authorId', 'title', 'publicationDate'];

    const validStrings = requiredFields.every((field) => {
        return typeof data[field] === 'string' && data[field].trim() !== '';
    });

    return validStrings && isValidDate(data.publicationDate);
};

const getBooksHandler = async (req, res) => {
    try {
        const books = await getAllBooks();
        return res.status(200).json(books);
    } catch (error) {
        console.error('GET /books failed:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getBookByIdHandler = async (req, res) => {
    const requestedId = req.params.id;

    try {
        const book = await getBookById(requestedId);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        return res.status(200).json(book);
    } catch (error) {
        console.error('GET /books/:id failed:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const createBookHandler = async (req, res) => {
    try {
        const bookData = req.body;

        if (!isValidBookData(bookData, true)) {
            return res.status(400).json({ message: 'Missing or invalid required fields' });
        }

        if (await bookExists(bookData.id)) {
            return res.status(400).json({ message: 'Book ID already exists' });
        }

        if (!await authorExists(bookData.authorId)) {
            return res.status(400).json({ message: 'Author does not exist' });
        }

        const newBook = await createBook(bookData);

        return res.status(201).json({
            id: newBook.id,
            authorId: newBook.authorId,
            title: newBook.title,
            publicationDate: newBook.publicationDate
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Book ID already exists' });
        }

        console.error('POST /books failed:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const updateBookHandler = async (req, res) => {
    try {
        const requestedId = req.params.id;

        if (!await bookExists(requestedId)) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (!isValidBookData(req.body)) {
            return res.status(400).json({ message: 'Missing or invalid required fields' });
        }

        if (!await authorExists(req.body.authorId)) {
            return res.status(400).json({ message: 'Author does not exist' });
        }

        const updatedBook = await updateBook(requestedId, req.body);
        return res.status(200).json(updatedBook);
    } catch (error) {
        console.error('PUT /books/:id failed:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteBookHandler = async (req, res) => {
    try {
        const result = await deleteBook(req.params.id);

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }

        return res.status(204).send();
    } catch (error) {
        console.error('DELETE /books/:id failed:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export { getBooksHandler, getBookByIdHandler, createBookHandler, updateBookHandler, deleteBookHandler };
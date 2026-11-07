import { getDb } from '../db/connect.js';

const getAllBooks = async () => {
    const db = getDb();
    const collection = db.collection('books');

    return await collection.find({}, { projection: { _id: 0 } }).toArray();
};

const getBookById = async (bookId) => {
    const db = getDb();
    const collection = db.collection('books');

    return await collection.findOne(
        { id: bookId },
        { projection: { _id: 0 } }
    );
};

const bookExists = async (bookId) => {
    const db = getDb();
    const collection = db.collection('books');

    return await collection.findOne(
        { id: bookId },
        { projection: { _id: 1 } }
    );
};

const authorExists = async (authorId) => {
    const db = getDb();
    const collection = db.collection('authors');

    return await collection.findOne(
        { id: authorId },
        { projection: { _id: 1 } }
    );
};

const createBook = async (bookData) => {
    const db = getDb();
    const collection = db.collection('books');

    const newBook = {
        id: bookData.id,
        authorId: bookData.authorId,
        title: bookData.title,
        publicationDate: bookData.publicationDate
    };

    await collection.insertOne(newBook);

    return newBook;
};

const updateBook = async (bookId, bookData) => {
    const db = getDb();
    const collection = db.collection('books');

    await collection.updateOne(
        { id: bookId },
        {
            $set: {
                authorId: bookData.authorId,
                title: bookData.title,
                publicationDate: bookData.publicationDate
            }
        }
    );

    return await getBookById(bookId);
};

const deleteBook = async (bookId) => {
    const db = getDb();
    const collection = db.collection('books');

    return await collection.deleteOne({ id: bookId });
};

export { getAllBooks, getBookById, bookExists, authorExists, createBook, updateBook, deleteBook };
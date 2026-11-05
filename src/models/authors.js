import { getDb } from '../db/connect.js';

const getAllAuthors = async () => {
    const db = getDb();
    const collection = db.collection('authors');
    const authors = await collection.find({}, { projection: { _id: 0 } }).toArray();

    return authors;
};

const getAuthorById = async (authorId) => {
    const db = getDb();
    const collection = db.collection('authors');
    const author = await collection.findOne({ id: authorId }, { projection: { _id: 0 } });

    return author;
};

const createAuthor = async (author) => {
    const db = getDb();
    const collection = db.collection('authors');
    const newAuthor = {
        id: author.id,
        name: author.name,
        birthYear: author.birthYear
    };

    await collection.insertOne({ ...newAuthor });

    return newAuthor;
};

const updateAuthor = async (authorId, author) => {
    const db = getDb();
    const collection = db.collection('authors');
    const result = await collection.updateOne(
        { id: authorId },
        { $set: { name: author.name, birthYear: author.birthYear } }
    );

    return result;
};

const deleteAuthor = async (authorId) => {
    const db = getDb();
    const collection = db.collection('authors');
    const result = await collection.deleteOne({ id: authorId });

    return result;
};

const authorHasBooks = async (authorId) => {
    const db = getDb();
    const collection = db.collection('books');
    const bookCount = await collection.countDocuments({ authorId }, { limit: 1 });

    return bookCount > 0;
};

export { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor, authorHasBooks };
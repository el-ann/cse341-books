import { getAllAuthors as getAllAuthorsFromDb, getAuthorById as getAuthorByIdFromDb, createAuthor as createAuthorInDb, updateAuthor as updateAuthorInDb, deleteAuthor as deleteAuthorInDb, authorHasBooks } from '../models/authors.js';

const isNonEmptyString = (value) => {
    return typeof value === 'string' && value.trim() !== '';
};

const isValidAuthorData = (data) => {
    return isNonEmptyString(data.name) && Number.isInteger(data.birthYear);
};

const getAllAuthors = async (req, res) => {
    try {
        const authors = await getAllAuthorsFromDb();
        return res.status(200).json(authors);
    } catch (error) {
        console.error("Failed to fetch authors:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getAuthorById = async (req, res) => {
    try {
        const requestedId = req.params.id;
        const author = await getAuthorByIdFromDb(requestedId);

        if (!author) {
            return res.status(404).json({ message: "Author not found" });
        }

        return res.status(200).json(author);
    } catch (error) {
        console.error("Failed to fetch author:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const createAuthor = async (req, res) => {
    try {
        const body = req.body ?? {};

        if (!isNonEmptyString(body.id) || !isValidAuthorData(body)) {
            return res.status(400).json({ message: "Missing or invalid required fields" });
        }

        const existingAuthor = await getAuthorByIdFromDb(body.id);

        if (existingAuthor) {
            return res.status(400).json({ message: "Author ID already exists" });
        }

        const newAuthor = await createAuthorInDb(body);

        return res.status(201).json(newAuthor);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Author ID already exists" });
        }

        console.error("Failed to create author:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const updateAuthor = async (req, res) => {
    try {
        const requestedId = req.params.id;
        const body = req.body ?? {};

        const existingAuthor = await getAuthorByIdFromDb(requestedId);

        if (!existingAuthor) {
            return res.status(404).json({ message: "Author not found" });
        }

        if (!isValidAuthorData(body)) {
            return res.status(400).json({ message: "Missing or invalid required fields" });
        }

        await updateAuthorInDb(requestedId, body);

        return res.status(200).json({
            id: requestedId,
            name: body.name,
            birthYear: body.birthYear
        });
    } catch (error) {
        console.error("Failed to update author:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const deleteAuthor = async (req, res) => {
    try {
        const requestedId = req.params.id;

        const existingAuthor = await getAuthorByIdFromDb(requestedId);

        if (!existingAuthor) {
            return res.status(404).json({ message: "Author not found" });
        }

        const hasBooks = await authorHasBooks(requestedId);

        if (hasBooks) {
            return res.status(409).json({
                message: "Cannot delete author because books are still linked to this author"
            });
        }

        await deleteAuthorInDb(requestedId);

        return res.status(204).send();
    } catch (error) {
        console.error("Failed to delete author:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor };
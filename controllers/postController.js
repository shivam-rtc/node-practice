const sql = require('../db/db');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: 'uploads/',
});

const upload = multer({ storage });

const postController = {
    createPost: async (req, res) => {
        try {
            const { user_id, title, content, status, tags } = req.body;

            // Validate required fields
            if (!user_id || !title || !content || !status) {
                return res.status(400).json({ message: 'user_id, title, content, and status are required', success: false });
            }

            // Validate status value
            const validStatuses = ['draft', 'published', 'archived'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ message: 'Invalid status value. Valid options are: draft, published, archived', success: false });
            }

            // Validate tags (optional, but ensure it's a string if provided)
            if (tags && typeof tags !== 'string') {
                return res.status(400).json({ message: 'Tags should be a comma-separated string', success: false });
            }
            // Get the file path from the uploaded image
            let image_url = null;
            if (req.file) {
                console.log('req.file', req.file);
                image_url = `/uploads/${req.file.filename}`;
            }
            // SQL Query to insert the post
            const query = `
                INSERT INTO posts (user_id, title, content, image_url, status, tags)
                VALUES (?, ?, ?, ?, ?, ?);
            `;
            const response = await sql.promise().query(query, [user_id, title, content, image_url, status, tags]);

            // Send success response
            res.status(201).json({ message: 'Post created successfully', success: true, response });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Post creation error: ' + error.message, success: false });
        }
    },

    posts: async (req, res) => {
        try {
            const query = `select * from posts`;
            const [row] = await sql.promise().query(query)
            return res.status(200).json({ message: "All students", success: true, row });
        } catch (error) {
            return res.status(400).json({ message: "something wrong" + error.message, success: false });
        }
    }
};

module.exports = { postController, upload };

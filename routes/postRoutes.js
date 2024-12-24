const express = require('express');
const router = express.Router();
const { postController, upload } = require('../controllers/postController');

router.post('/createPost', postController.createPost);
router.get('/posts', postController.posts);

module.exports = router;    
const express = require('express');
const db = require('../db');
const authenticateToken = require('../middleware/auth.middleware');
const router = express.Router();

// Create a new post
router.post('/', authenticateToken, async (req, res) => {
    const { title, content, price } = req.body;
    const userId = req.user.id;

    if (!title || !content || price == null) {
        return res.status(400).json({ message: 'Title, content, and price are required.' });
    }

    try {
        const [result] = await db.execute('INSERT INTO posts (user_id, title, content, price) VALUES (?, ?, ?, ?)', [
            userId, title, content, price
        ]);
        
        res.status(201).json({ message: 'Post created successfully!', postId: result.insertId });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

router.get('/get-user-posts', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const [posts] = await db.execute('SELECT * FROM posts WHERE user_id = ?', [userId]);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});


// Get post by title
router.get('/', async (req, res) => {
    const params = req.query;

    try {
        if (params.title) {
            const [posts] = await db.execute('SELECT * FROM posts WHERE title LIKE ?', [`%${params.title}%`]);
            return res.json(posts);
        }

        // If no title filter, get all posts
        const [posts] = await db.execute('SELECT * FROM posts');
        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Get post by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [post] = await db.execute('SELECT * FROM posts WHERE id = ?', [id]);
        if (post.length === 0) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        res.json(post[0]);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Delete post (only for the user who created it)
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        // Check if the post belongs to the user
        const [post] = await db.execute('SELECT * FROM posts WHERE id = ? AND user_id = ?', [id, userId]);
        if (post.length === 0) {
            return res.status(403).json({ message: 'You do not have permission to delete this post.' });
        }

        await db.execute('DELETE FROM posts WHERE id = ?', [id]);
        res.json({ message: 'Post deleted successfully!' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});


router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { title, content, price } = req.body;
    const userId = req.user.id;
    
    try{
        const [post] = await db.execute('SELECT * FROM posts WHERE id = ? AND user_id = ?', [id, userId]);
        if (post.length === 0) {
            return res.status(403).json({ message: 'You do not have permission to update this post.' });
        }

        await db.execute("UPDATE posts SET title = ?, content = ?, price = ? WHERE id = ?", [title, content, price, id]);
        res.status(200).json({ message: 'Post updated successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

    
module.exports = router;

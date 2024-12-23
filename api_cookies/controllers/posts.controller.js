const express = require('express');
const db = require('../db');
const authenticateToken = require('../middleware/auth.middleware');
const router = express.Router();

const getCategoryName = async (category_id) => {
    const [category] = await db.execute('SELECT name FROM categories WHERE id = ?', [category_id]);
    return category[0].name;
}

// Create a new post
router.post('/', authenticateToken, async (req, res) => {
    const { title, content, price, category_id } = req.body;
    const userId = req.user.id;

    if (!title || !content || price == null || !category_id) {
        return res.status(400).json({ message: 'Title, content, price and category are required.' });
    }

    try {
        const [category] = await db.execute('SELECT * FROM categories WHERE id = ?', [category_id]);
        if (category.length === 0) {
            return res.status(404).json({ message: 'Category not found.' });
        }

        const [result] = await db.execute('INSERT INTO posts (user_id, title, content, price, category_id) VALUES (?, ?, ?, ?, ?)', [
            userId, title, content, price, category_id
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
        // Updated query to select specific fields and use aliases to avoid conflicts
        const [posts] = await db.execute(`
            SELECT 
                p.id AS post_id, 
                p.title, 
                p.content, 
                p.price, 
                p.user_id, 
                p.created_at, 
                p.category_id, 
                c.name AS category_name 
            FROM posts p
            JOIN categories c ON p.category_id = c.id 
            WHERE p.user_id = ?
        `, [userId]);

        // Format the response to include category as an array inside each post
        const formattedPosts = posts.map(post => {
            return {
                id: post.post_id, // Use the correct post ID
                title: post.title,
                content: post.content,
                price: post.price,
                user_id: post.user_id,
                created_at: post.created_at,
                category: [{
                    id: post.category_id,
                    name: post.category_name,
                }]
            };
        });

        res.status(200).json(formattedPosts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});


// Get all posts or filter by title
router.get('/', async (req, res) => {
    const params = req.query;

    try {
        let query = `
            SELECT p.*, c.name AS category_name 
            FROM posts p
            LEFT JOIN categories c ON p.category_id = c.id
        `;
        let queryParams = [];

        if (params.title) {
            query += ' WHERE p.title LIKE ?';
            queryParams.push(`%${params.title}%`);
        }

        const [posts] = await db.execute(query, queryParams);

        // Format the response to include category as an array inside each post
        const formattedPosts = posts.map(post => ({
            ...post,
            category: [{
                id: post.category_id,
                name: post.category_name
            }],
            category_id: undefined,
            category_name: undefined
        }));

        res.json(formattedPosts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Get post by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [post] = await db.execute('SELECT posts.id, posts.title, posts.content, posts.price, posts.user_id, posts.created_at, posts.category_id, categories.name AS category_name FROM posts LEFT JOIN categories ON posts.category_id = categories.id WHERE posts.id = ?;', [id]);
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

//Edit post (only for the user who created it)
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { title, content, price, category_id } = req.body;
    const userId = req.user.id;
    
    try{
        const [post] = await db.execute('SELECT * FROM posts WHERE id = ? AND user_id = ?', [id, userId]);
        if (post.length === 0) {
            return res.status(403).json({ message: 'You do not have permission to update this post.' });
        }

        if(db.execute('SELECT * FROM categories WHERE id = ?', [category_id]).length === 0) {
            return res.status(404).json({ message: 'Category not found.' });
        };

        await db.execute("UPDATE posts SET title = ?, content = ?, price = ?, category_id = ? WHERE id = ?", [title, content, price, category_id, id]);
        res.status(200).json({ message: 'Post updated successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

router.get('/phone-number/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [userId] = await db.execute('SELECT user_id FROM posts WHERE id = ?', [id]);
        console.log(userId[0].user_id);
        const [phoneNumber] = await db.execute('SELECT phone_number FROM users WHERE id = ?', [userId[0].user_id]);
        if (phoneNumber.length === 0) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        res.json(phoneNumber[0]);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

module.exports = router;


import express from 'express';
import Short from '../controllers/short.controller.js';
import checkApiKey from '../middleware/checkApiKey.js';
import protect from '../middleware/auth.js'

const router = express.Router();

router.route('/feed').get(protect, async (req, res) => {
    const result = Short.getNotes();
    result.then(data => {
        res.json({ success: data });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: 'Failed to fetch notes' });
    });
});

router.route('/create').post(checkApiKey, async (req, res) => {
    const { category, title, author, content, actual_content_link, image, upvote, downvote } = req.body;
    const publish_date = new Date();
    console.log(title);
    const result = Short.create(category, title, author, publish_date, content, actual_content_link, image, upvote, downvote);
    result.then(data => {
        res.json({
            "message": "Short added successfully",
            "short_id": data.insertId,
            "status_code": 200
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: 'Failed to create note' });
    });
});

router.route('/update/:id').put(checkApiKey, async (req, res) => {
    const noteId = req.params.id;
    const { title } = req.body;
    const result = Short.updateNoteById(noteId, title);
    result.then(data => {
        res.json({ success: data });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: 'Failed to update note' });
    });
});

router.route('/delete/:id').delete(checkApiKey, async (req, res) => {
    const noteId = req.params.id;
    const result = Short.deleteNoteById(noteId);
    result.then(data => {
        res.json({ success: data });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: 'Failed to delete note' });
    });
});

router.route('/filter').get(protect, async (req, res) => {
    const { category, publish_date, upvote } = req.query;
    const result = await Short.getFilteredNotes({ category, publish_date, upvote });
    if (result.length === 0) {
        res.json({
            "status": "No short matches your search criteria",
            "status_code": 400
        })
    } else {
        res.json(result);
    }
});

router.route('/search').get(protect, async (req, res) => {
    const { title, keyword, author } = req.query;
    const result = await Short.searchNotes({ title, keyword, author });
    if (result.length === 0) {
        res.json({
            "status": "No short matches your search criteria",
            "status_code": 400
        })
    } else {
        res.json(result);
    }
});


export default router;
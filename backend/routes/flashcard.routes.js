const express = require('express');
const { createFlashcard, getAllFlashcards, updateFlashcard, deleteFlashcard, getFlashCards } = require('../controllers/flashcard.controller.js');

const { default: authMiddleware } = require('../middleware/auth.js');

const router = express.Router();

router.post('/',authMiddleware,  createFlashcard);
router.get('/get',authMiddleware, getFlashCards);
router.get('/', getAllFlashcards);
router.put('/:id', authMiddleware,updateFlashcard);
router.delete('/:id',authMiddleware, deleteFlashcard);

module.exports = router;

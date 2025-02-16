const Flashcard = require('../models/FlashCard.model.js');

// Create Flashcard
exports.createFlashcard = async (req, res) => {
  try {
    
    const { question, answer } = req.body;
    const user = req.user._id;

    if(!user || !question || !answer) 
        return res.status(400).json({ error: 'Missing required fields' });

    const flashcard = new Flashcard({ user, question, answer : answer.toLowerCase() });
    if(!flashcard) return res.status(400).json({ error: 'Flashcard not created' });

    await flashcard.save();
    res.status(201).json(flashcard);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.getFlashCards = async (req, res) => {
    try {
      const user = req.user._id;
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize time to compare only the date
  
      // Fetch flashcards where nextReview is either null or today or earlier
      const flashcards = await Flashcard.find({
        user,
        $or: [
          { nextReview: null }, 
          { nextReview: { $lte: today } } // Fetch due flashcards
        ]
      }).populate('user', 'username');

      console.log({flashcards})
  
      res.status(200).json(flashcards);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

// Get All Flashcards
exports.getAllFlashcards = async (req, res) => {
  try {
    const flashcards = await Flashcard.find().populate('user', 'username');
    if(!flashcards) return res.status(404).json({ error: 'Flashcards not found' });
    res.status(201).json(flashcards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Flashcard Box Level
exports.updateFlashcard = async (req, res) => {
  try {
    const { isCorrect } = req.body;
    console.log({isCorrect})
    if(!req.params.id) return res.status(400).json({ error: 'Missing required fields' });

    const flashcard = await Flashcard.findById(req.params.id);
    console.log({flashcard})
    if (!flashcard) return res.status(404).json({ error: 'Flashcard not found' });

    await flashcard.updateFlashcardLevel(isCorrect);
    res.status(201).json(flashcard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Flashcard
exports.deleteFlashcard = async (req, res) => {
  try {
    if(!req.params.id) return res.status(400).json({ error: 'Missing required fields' });
    await Flashcard.findByIdAndDelete(req.params.id);
    res.status(201).json({ message: 'Flashcard deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

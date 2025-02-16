const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  box: { type: Number, default: 1, min: 1, max: 5 }, // Leitner System (1 to 5)
  nextReview: { type: Date }, // Spaced repetition logic
  createdAt: { type: Date, default: Date.now }
});

// Function to update flashcard level based on user response
flashcardSchema.methods.updateFlashcardLevel = function (isCorrect) {
  if (isCorrect) {
    // If the answer is correct, move to the next box (up to max level)
    this.box = Math.min(this.box + 1, 5);
  } else {
    // If incorrect, move back to box 1
    this.box = 1;
  }

  
  const reviewIntervals = [1, 2, 4, 7, 15]; // Days for each level
  this.nextReview = new Date();
  this.nextReview.setDate(this.nextReview.getDate() + reviewIntervals[this.box - 1]);

  return this.save();
};

flashcardSchema.statics.getDueFlashcards = function (userId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize time to compare only the date
  
    return this.find({
      user: userId,
      $or: [
        { nextReview: null }, 
        { nextReview: { $lte: today } } // Fetch flashcards due today or earlier
      ]
    }).sort({ nextReview: 1 });
  };

const Flashcard = mongoose.model('Flashcard', flashcardSchema);
module.exports = Flashcard;

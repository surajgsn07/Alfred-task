# Flashcard Learning App (Leitner System)

## Overview
This is a flashcard learning application that implements the **Leitner System** for spaced repetition. It helps users efficiently retain information by reviewing flashcards at increasing intervals based on their performance.

## Features
- **Leitner System-based Learning**: Flashcards progress through a series of review boxes: `[1, 2, 4, 7, 15]` days.
- **Spaced Repetition Algorithm**: Cards are scheduled for review based on user performance.
- **Authentication**: Users can sign up and log in to track their progress.
- **Dark and Light Mode**: Toggle between dark and light themes.
- **Flashcard Management**: Users can add, edit, and delete flashcards.
- **Play Mode**: Engage in active recall by answering flashcard questions.
- **About Section**: Learn how the game and spaced repetition system work.
- **AI dymanic MCQ options** : Using Groq API to fetch options to make flashcard question in MCQ.

---

## Leitner System Implementation
The Leitner System is a spaced repetition technique using a series of boxes to determine when a flashcard should be reviewed. Our app uses **5 boxes** with the following intervals:

- **Box 1**: Initial state; review **daily**
- **Box 2**: Review after **2 days**
- **Box 3**: Review after **4 days**
- **Box 4**: Review after **7 days**
- **Box 5**: Review after **15 days**

If a user answers a flashcard correctly, it moves to the next box, extending the review interval. If answered incorrectly, it resets to **Box 1** and is reviewed the next day.

### Example Flow
1. A new flashcard starts in **Box 1**.
2. On the first review day:
   - If answered correctly → Moves to **Box 2** (review after 2 days)
   - If answered incorrectly → Stays in **Box 1** (review next day)
3. When reviewed in **Box 2**:
   - Correct → Moves to **Box 3** (review after 4 days)
   - Incorrect → Moves back to **Box 1**
4. The process continues until the flashcard reaches **Box 5**.
5. Once a flashcard is successfully reviewed in **Box 5**, it is considered learned.

---

## Data Model (Mongoose Schema)
The following schema is used to store flashcards in MongoDB:

```javascript
const flashcardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  box: { type: Number, default: 1, min: 1, max: 5 }, // Leitner System (1 to 5)
  nextReview: { type: Date }, // Spaced repetition logic
  createdAt: { type: Date, default: Date.now }
});
```

The `nextReview` field determines when the flashcard should be shown to the user.

---

## User Flow
1. **Login / Signup**: Users authenticate to track progress.
2. **Add Flashcards**: Users can create new flashcards with questions and answers.
3. **Daily Review**: The system checks if any flashcards are due for review.
4. **Answering Questions**:
   - If correct → Move to the next box and update `nextReview`.
   - If incorrect → Reset to **Box 1** and set `nextReview` to the next day.
5. **Game Mode**: Users can engage in active recall sessions.
6. **Theme Selection**: Users can switch between dark and light mode.
7. **About Section**: Provides information on how the system works.

## Screenshots :
![Screenshot_2025-02-16-20-11-35-53_971289f995469705f6f3dbdc4f96b96e](https://github.com/user-attachments/assets/ec2deed4-7bf1-4952-8919-52ee51b116dd)
![Screenshot_2025-02-16-20-11-57-45_971289f995469705f6f3dbdc4f96b96e](https://github.com/user-attachments/assets/287e1881-dad2-4966-af78-b9330d5d29b8)
![Screenshot_2025-02-16-20-10-49-94_971289f995469705f6f3dbdc4f96b96e](https://github.com/user-attachments/assets/e9636d75-e3ab-4f50-b38a-fcd288f1f62a)
![Screenshot_2025-02-16-20-11-54-46_971289f995469705f6f3dbdc4f96b96e](https://github.com/user-attachments/assets/5c0a757b-1174-49eb-ac93-bf6e9299e4f7)
![Screenshot_2025-02-16-20-11-39-73_971289f995469705f6f3dbdc4f96b96e](https://github.com/user-attachments/assets/6cc8623a-01c5-457d-8f8b-865e4e921c53)
![Screenshot_2025-02-16-20-10-52-88_971289f995469705f6f3dbdc4f96b96e](https://github.com/user-attachments/assets/9954b810-4813-4c4a-99f4-8771c5b6d3eb)







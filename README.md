# 🍿 90s Blockbuster Trivia Challenge (Multiplayer)

A simultaneous multiplayer trivia game built with plain HTML, CSS, and JavaScript, using Firebase Realtime Database to track scores and display a live leaderboard across multiple devices.

---

## Features

* **Multiplayer:** Players can join and play simultaneously from any device (phone, tablet, computer).
* **Real-Time Leaderboard:** Scores are updated in a central Firebase database and displayed instantly on the live leaderboard.
* **Themed Questions:** Features a "90s Blockbuster Movies" quiz round.
* **Simple Setup:** Hosted for free using GitHub Pages and Firebase's free tier.

---

## How to Play

1.  **Open the Live Link:** All participants navigate to the live GitHub Pages URL (e.g., `https://echeng2021.github.io/90s-trivia-game/`).
2.  **Start Game:** Each player enters their name and clicks **"Start Game."**
3.  **Submit Score:** After answering the 5 questions, the player sees their individual score and a message confirming the score has been submitted.
4.  **View Results:** Anyone can click the **"View Live Leaderboard"** button at any time to see the current, sorted rankings of all players who have submitted scores.

---

## Project Setup and Local Development

This project requires a connection to a Firebase Realtime Database to function as a multiplayer application.

### Prerequisites

* A **Firebase Project** (using the Spark/Free plan).
* The **Firebase Configuration** (API Key, Project ID, etc.).
* A hosting solution (e.g., **GitHub Pages**).

### Setup Instructions

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/echeng2021/90s-trivia-game.git](https://github.com/echeng2021/90s-trivia-game.git)
    cd 90s-trivia-game
    ```

2.  **Configure Firebase:**
    * In your Firebase Console, enable the **Realtime Database**.
    * Set the **Rules** to allow public read/write access for testing:
        ```json
        {
          "rules": {
            "scores": {
              ".read": "true",
              ".write": "true"
            }
          }
        }
        ```

3.  **Update `index.html`:**
    * Open `index.html`.
    * Locate the `<script>` block containing `const firebaseConfig = { ... };`.
    * **Replace the placeholder configuration** with your unique configuration object copied from the Firebase console.

4.  **Run Locally (Optional):**
    * You can open `index.html` directly in your browser to test the styling and JavaScript logic.

### Deployment (If Code Changes)

1.  Stage your changes:
    ```bash
    git add .
    ```
2.  Commit your changes:
    ```bash
    git commit -m "Updated Firebase config with live keys"
    ```
3.  Push to GitHub, which automatically triggers the GitHub Pages rebuild:
    ```bash
    git push origin main
    ```

---

## Technologies Used

* **HTML5**
* **CSS3**
* **Vanilla JavaScript** (ES5/ES6)
* **Firebase Realtime Database** (Backend and Data Storage)
* **Firebase SDK v8** (For classic, cross-browser compatibility)

---

## License

This project is open source and available under the MIT License.

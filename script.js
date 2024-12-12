class TicTacToe {
    constructor() {
        this.questions = [];
        this.currentPlayer = '⭕';
        this.board = Array(9).fill('');
        this.gameActive = false;
        this.selectedCell = null;

        // DOM Elements
        this.questionsContainer = document.getElementById('questions-container');
        this.startGameBtn = document.getElementById('startGame');
        this.gameBoard = document.querySelector('.game-board');
        this.cells = document.querySelectorAll('.cell');
        this.modal = document.getElementById('questionModal');
        this.resultModal = document.getElementById('resultModal');
        this.questionText = document.getElementById('questionText');
        this.questionImage = document.getElementById('questionImage');
        this.currentPlayerSpan = document.getElementById('currentPlayer');
        this.correctBtn = document.getElementById('correctAnswer');
        this.wrongBtn = document.getElementById('wrongAnswer');
        this.resultMessage = document.getElementById('resultMessage');
        this.emojiContainer = document.getElementById('emojiContainer');
        this.homeLink = document.querySelector('.home-link');

        this.initializeGame();
    }

    initializeGame() {
        // Create question input fields
        for (let i = 0; i < 9; i++) {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question-input';
            questionDiv.innerHTML = `
                <label>Question ${i + 1}:</label>
                <input type="text" class="question" placeholder="Enter question">
                <div class="image-upload">
                    <label>Optional Image:</label>
                    <input type="file" class="question-image-input" accept="image/*">
                    <div class="image-preview">
                        <img src="" alt="Preview">
                    </div>
                </div>
            `;
            this.questionsContainer.appendChild(questionDiv);

            // Add image preview functionality
            const imageInput = questionDiv.querySelector('.question-image-input');
            const preview = questionDiv.querySelector('.image-preview');
            const previewImg = preview.querySelector('img');

            imageInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        previewImg.src = e.target.result;
                        preview.style.display = 'block';
                    };
                    reader.readAsDataURL(file);
                } else {
                    preview.style.display = 'none';
                }
            });
        }

        // Event Listeners
        this.startGameBtn.addEventListener('click', () => this.startGame());
        this.cells.forEach(cell => {
            cell.addEventListener('click', () => this.handleCellClick(cell));
        });
        this.correctBtn.addEventListener('click', () => this.handleAnswer(true));
        this.wrongBtn.addEventListener('click', () => this.handleAnswer(false));
        this.homeLink.addEventListener('click', () => this.resetGame());
    }

    resetGame() {
        // Clear the board
        this.board = Array(9).fill('');
        this.cells.forEach(cell => cell.textContent = '');
        this.currentPlayer = '⭕';
        this.currentPlayerSpan.textContent = this.currentPlayer;
        this.gameActive = false;

        // Hide game board and show setup
        this.gameBoard.style.display = 'none';
        document.querySelector('.game-setup').style.display = 'block';

        // Clear questions
        this.questionsContainer.innerHTML = '';
        this.initializeGame();
    }

    startGame() {
        const questionInputs = document.querySelectorAll('.question');
        const imageInputs = document.querySelectorAll('.question-image-input');
        
        // Validate all questions are filled
        let allFilled = true;
        questionInputs.forEach(input => {
            if (!input.value) {
                allFilled = false;
            }
        });

        if (!allFilled) {
            alert('Please fill in all questions before starting the game.');
            return;
        }

        // Store questions and images
        this.questions = Array.from(questionInputs).map((input, index) => ({
            question: input.value,
            image: imageInputs[index].files[0] ? 
                   imageInputs[index].parentElement.querySelector('img').src : 
                   null
        }));

        // Hide setup and show game board
        document.querySelector('.game-setup').style.display = 'none';
        this.gameBoard.style.display = 'block';
        this.gameActive = true;
    }

    handleCellClick(cell) {
        if (!this.gameActive) return;
        
        const index = cell.dataset.index;
        if (this.board[index] !== '') return;

        this.selectedCell = cell;
        const questionData = this.questions[index];
        this.questionText.textContent = questionData.question;
        
        // Handle image display
        if (questionData.image) {
            this.questionImage.innerHTML = `<img src="${questionData.image}" alt="Question Image">`;
            this.questionImage.style.display = 'block';
        } else {
            this.questionImage.style.display = 'none';
        }
        
        this.modal.style.display = 'block';
    }

    handleAnswer(isCorrect) {
        this.showResult(isCorrect);
        
        if (isCorrect) {
            const index = this.selectedCell.dataset.index;
            this.board[index] = this.currentPlayer;
            this.selectedCell.textContent = this.currentPlayer;
            
            if (this.checkWinner()) {
                setTimeout(() => {
                    this.showWinnerCelebration(this.currentPlayer);
                    this.gameActive = false;
                }, 2000);
            } else if (this.board.every(cell => cell !== '')) {
                setTimeout(() => {
                    alert("It's a draw!");
                    this.gameActive = false;
                }, 2000);
            } else {
                setTimeout(() => {
                    this.currentPlayer = this.currentPlayer === '⭕' ? '❌' : '⭕';
                    this.currentPlayerSpan.textContent = this.currentPlayer;
                }, 2000);
            }
        } else {
            setTimeout(() => {
                this.currentPlayer = this.currentPlayer === '⭕' ? '❌' : '⭕';
                this.currentPlayerSpan.textContent = this.currentPlayer;
            }, 2000);
        }
    }

    showResult(isCorrect) {
        this.modal.style.display = 'none';
        this.resultModal.style.display = 'block';
        
        // Clear previous emojis
        this.emojiContainer.innerHTML = '';
        
        if (isCorrect) {
            this.resultMessage.textContent = 'The answer is correct! 🎉';
            this.resultMessage.className = 'correct-message';
            const happyEmojis = ['🎉', '✨', '🌟', '⭐', '🎊', '🎯', '🏆', '👏', '🥳'];
            this.createEmojiExplosion(happyEmojis);
        } else {
            this.resultMessage.textContent = 'The answer is wrong! 😔';
            this.resultMessage.className = 'wrong-message';
            const sadEmojis = ['😔', '😢', '😥', '💔', '😿', '🤦', '😫', '😩', '😭'];
            this.createEmojiExplosion(sadEmojis);
        }

        setTimeout(() => {
            this.resultModal.style.display = 'none';
        }, 2000);
    }

    createEmojiExplosion(emojis) {
        // Clear previous emojis
        this.emojiContainer.innerHTML = '';

        for (let i = 0; i < 30; i++) {
            const emoji = document.createElement('div');
            emoji.className = 'floating-emoji';
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];

            // Calculate random angle and distance
            const angle = (Math.random() * 360) * (Math.PI / 180);
            const distance = Math.random() * Math.min(window.innerWidth, window.innerHeight) * 0.5;

            // Calculate final position
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            // Set custom properties for the animation
            emoji.style.setProperty('--tx', `${tx}px`);
            emoji.style.setProperty('--ty', `${ty}px`);

            this.emojiContainer.appendChild(emoji);

            // Remove emoji after animation
            setTimeout(() => emoji.remove(), 1500);
        }
    }

    showWinnerCelebration(winner) {
        // Create winner announcement
        const announcement = document.createElement('div');
        announcement.className = 'winner-announcement';
        announcement.innerHTML = `
            <h2>Team ${winner} Wins! 🎉</h2>
            <div class="trophy">🏆</div>
        `;
        document.body.appendChild(announcement);

        // Create celebration emojis
        const celebrationEmojis = ['🎉', '✨', '🌟', '⭐', '🎊', '🎯', '🏆', '👑', '💫'];
        this.createEmojiExplosion(celebrationEmojis);

        // Remove announcement after delay
        setTimeout(() => {
            announcement.remove();
        }, 3000);
    }

    checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return this.board[a] && 
                   this.board[a] === this.board[b] && 
                   this.board[a] === this.board[c];
        });
    }
}

// Initialize the game
new TicTacToe();

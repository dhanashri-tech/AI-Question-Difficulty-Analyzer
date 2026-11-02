
// ===================================
// QUESTION ANALYZER - REAL ML MODEL
// ===================================

const analyzeBtn = document.getElementById('analyzeBtn');
const questionText = document.getElementById('questionText');

if (analyzeBtn && questionText) {

    analyzeBtn.addEventListener('click', async function () {

        const question = questionText.value.trim();

        if (!question) {
            alert('Please enter a question to analyze.');
            return;
        }

        const originalContent = analyzeBtn.innerHTML;

        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = '<div class="loading"></div> Analyzing...';

        try {

            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    question: question
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Prediction failed');
            }

            const difficulty = result.difficulty.toLowerCase();
            const confidence = Number(result.confidence);

            currentDifficulty = difficulty;

            // Get HTML elements
            const resultContent =
                document.getElementById('resultContent');

            const placeholderContent =
                document.getElementById('placeholderContent');

            const suggestionBox =
                document.getElementById('suggestionBox');

            const difficultyBadge =
                document.getElementById('difficultyBadge');

            const scoreValue =
                document.getElementById('scoreValue');

            const complexityText =
                document.getElementById('complexityText');

            const complexityProgress =
                document.getElementById('complexityProgress');

            const confidenceValue =
                document.getElementById('confidenceValue');

            const suggestionText =
                document.getElementById('suggestionText');

            // Display predicted difficulty
            if (difficultyBadge) {
                difficultyBadge.textContent =
                    difficulty.toUpperCase() + ' DIFFICULTY';

                difficultyBadge.className =
                    'difficulty-badge badge-' + difficulty;
            }

            // Display model confidence
            if (confidenceValue) {
                confidenceValue.textContent =
                    confidence.toFixed(2) + '% Confidence';
            }

            // Display confidence in score circle
            if (scoreValue) {
                scoreValue.textContent =
                    confidence.toFixed(0);
            }

            // Display prediction details
            if (complexityText) {
                complexityText.textContent =
                    difficulty.charAt(0).toUpperCase() +
                    difficulty.slice(1) +
                    ' Difficulty';
            }

            if (complexityProgress) {
                complexityProgress.style.width =
                    confidence + '%';
            }

            // Update circular progress
            const progressCircle =
                document.getElementById('scoreProgress');

            if (progressCircle) {
                const circumference = 2 * Math.PI * 85;
                const offset =
                    circumference - (confidence / 100) * circumference;

                progressCircle.style.strokeDashoffset = offset;

                const colors = {
                    easy: '#10B981',
                    medium: '#F59E0B',
                    hard: '#EF4444'
                };

                progressCircle.style.stroke =
                    colors[difficulty] || '#3B82F6';
            }

            // Show suggestion
            const suggestions = {
                easy: 'The model predicts this question as Easy. It may be suitable for introductory-level assessments.',
                medium: 'The model predicts this question as Medium. It may require some understanding and application of concepts.',
                hard: 'The model predicts this question as Hard. It may require advanced understanding and problem-solving.'
            };

            if (suggestionText) {
                suggestionText.textContent =
                    suggestions[difficulty] ||
                    'Review the predicted difficulty manually.';
            }

            // Bloom's level is not predicted by the current ML model
            const bloomLevel =
                document.getElementById('bloomLevel');

            const bloomDescription =
                document.getElementById('bloomDescription');

            if (bloomLevel) bloomLevel.textContent = 'Not predicted';
            if (bloomDescription) bloomDescription.textContent =
                'Not available from current ML model';

            // Show result panel
            if (placeholderContent) {
                placeholderContent.style.display = 'none';
            }

            if (resultContent) {
                resultContent.classList.remove('hidden');
            }

            if (suggestionBox) {
                suggestionBox.classList.remove('hidden');
            }

            // Save recent question
            if (typeof addRecentQuestion === 'function') {
                addRecentQuestion(
                    question,
                    difficulty.toUpperCase()
                );
            }

        } catch (error) {

            console.error('Prediction error:', error);

            alert(
                'Unable to analyze the question. ' +
                'Please check the Flask terminal.'
            );

        } finally {

            analyzeBtn.disabled = false;
            analyzeBtn.innerHTML = originalContent;

        }
    });
}

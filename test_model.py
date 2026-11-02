
import joblib

model = joblib.load("models/difficulty_model.pkl")

questions = [
    "Write a program to find the sum of two numbers.",
    "Explain the binary search algorithm and its time complexity.",
    "Design an efficient dynamic programming algorithm for the travelling salesman problem."
]

for question in questions:

    prediction = model.predict([question])[0]

    probabilities = model.predict_proba([question])[0]

    confidence = max(probabilities) * 100

    print("\nQuestion:", question)
    print("Predicted Difficulty:", prediction)
    print("Confidence:", round(float(confidence), 2), "%")

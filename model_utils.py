
import joblib

model = joblib.load("models/difficulty_model.pkl")

def predict_difficulty(question):

    prediction = model.predict([question])[0]

    probabilities = model.predict_proba([question])[0]

    confidence = max(probabilities) * 100

    return {
        "difficulty": prediction.capitalize(),
        "confidence": round(float(confidence), 2)
    }

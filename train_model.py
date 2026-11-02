
import pandas as pd
import os
import joblib

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# Load dataset
df = pd.read_csv("dataset/questions_dataset.csv")

# Display dataset information
print("Dataset Columns:", df.columns.tolist())
print("\nDataset Shape:", df.shape)

# Remove rows without difficulty labels
df = df.dropna(subset=["title", "difficulty_level"])

# Convert columns into strings
columns = ["title", "description", "examples", "constraints"]

for col in columns:
    df[col] = df[col].fillna("").astype(str)

# Combine question information
df["question"] = (
    df["title"] + " " +
    df["description"] + " " +
    df["examples"] + " " +
    df["constraints"]
)

# Clean labels
df["difficulty_level"] = (
    df["difficulty_level"].astype(str).str.strip().str.lower()
)

# Check available difficulty labels
print("\nDifficulty Distribution:")
print(df["difficulty_level"].value_counts())

# Features and target
X = df["question"]
y = df["difficulty_level"]

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# Create ML pipeline
model = Pipeline([
    ("tfidf", TfidfVectorizer(
        lowercase=True,
        stop_words="english",
        ngram_range=(1, 2),
        max_features=10000
    )),
    ("classifier", LogisticRegression(
        max_iter=1000,
        class_weight="balanced"
    ))
])

# Train model
model.fit(X_train, y_train)

# Test model
y_pred = model.predict(X_test)

print("\nAccuracy:", accuracy_score(y_test, y_pred))

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

# Save model
os.makedirs("models", exist_ok=True)

joblib.dump(model, "models/difficulty_model.pkl")

print("\nModel trained and saved successfully!")

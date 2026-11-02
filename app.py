from flask import Flask, render_template, request, jsonify
from model_utils import predict_difficulty

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/analyzer")
def analyzer():
    return render_template("analyzer.html")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(silent=True) or {}
    question = data.get("question", "").strip()

    if not question:
        return jsonify({"error": "Please enter a question"}), 400

    result = predict_difficulty(question)
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
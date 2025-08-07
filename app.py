from flask import Flask, request, jsonify
import os 
from abg_interpreter import interpret_abg  # make sure your logic is in this file
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allows cross-origin requests from your parabox site

@app.route("/", methods=["GET"])
def home():
    return "RAPHA ABG Interpreter API is running."

@app.route("/interpret", methods=["POST"])
def interpret():
    data = request.get_json()

    try:
        pH = float(data["pH"])
        pCO2 = float(data["pCO2"])
        HCO3 = float(data["HCO3"])
        Na = float(data["Na"])
        Cl = float(data["Cl"])
        lactate = float(data["lactate"])
        paO2 = float(data["paO2"])
        FiO2 = float(data["FiO2"])  # in percentage like 21, 100
        age = int(data["age"])
    except Exception as e:
        return jsonify({"error": f"Invalid or missing input: {str(e)}"}), 400

    # Run interpretation
    result = interpret_abg(pH, pCO2, HCO3, Na, Cl, lactate, paO2, FiO2, age)

    return jsonify(result)

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)


  


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)


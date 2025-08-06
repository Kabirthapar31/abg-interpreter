from flask import Flask, request, render_template

app = Flask(__name__)

def interpret_abg(pH, pCO2, HCO3):
    result = {
        "Primary Disorder": "",
        "Compensation": "",
        "Likely Cause": ""
    }

    if 7.35 <= pH <= 7.45:
        if 35 <= pCO2 <= 45 and 22 <= HCO3 <= 26:
            result["Primary Disorder"] = "Normal Acid-Base Status"
        elif pCO2 > 45 and HCO3 > 26:
            result["Primary Disorder"] = "Compensated Respiratory Acidosis"
        elif pCO2 < 35 and HCO3 < 22:
            result["Primary Disorder"] = "Compensated Respiratory Alkalosis"
        elif HCO3 > 26 and pCO2 > 45:
            result["Primary Disorder"] = "Compensated Metabolic Alkalosis"
        elif HCO3 < 22 and pCO2 < 35:
            result["Primary Disorder"] = "Compensated Metabolic Acidosis"
        else:
            result["Primary Disorder"] = "Mixed or Compensated Disorder"
    elif pH < 7.35:
        if pCO2 > 45:
            if HCO3 >= 22:
                result["Primary Disorder"] = "Uncompensated Respiratory Acidosis"
            else:
                result["Primary Disorder"] = "Mixed Respiratory and Metabolic Acidosis"
        elif HCO3 < 22:
            if pCO2 <= 45:
                result["Primary Disorder"] = "Uncompensated Metabolic Acidosis"
            else:
                result["Primary Disorder"] = "Mixed Disorder"
        result["Compensation"] = "Uncompensated or Partial"
    elif pH > 7.45:
        if pCO2 < 35:
            if HCO3 <= 26:
                result["Primary Disorder"] = "Uncompensated Respiratory Alkalosis"
            else:
                result["Primary Disorder"] = "Mixed Alkalosis"
        elif HCO3 > 26:
            if pCO2 >= 35:
                result["Primary Disorder"] = "Uncompensated Metabolic Alkalosis"
            else:
                result["Primary Disorder"] = "Mixed Alkalosis"
        result["Compensation"] = "Uncompensated or Partial"

    disorder = result["Primary Disorder"]
    if "Metabolic Acidosis" in disorder:
        result["Likely Cause"] = "Possible causes: DKA, Renal Failure, Lactic Acidosis, Diarrhea"
    elif "Metabolic Alkalosis" in disorder:
        result["Likely Cause"] = "Possible causes: Vomiting, Diuretics, Hypokalemia"
    elif "Respiratory Acidosis" in disorder:
        result["Likely Cause"] = "Possible causes: COPD, Drug Overdose, Airway Obstruction"
    elif "Respiratory Alkalosis" in disorder:
        result["Likely Cause"] = "Possible causes: Anxiety, Pain, Fever, Hyperventilation"

    return result

@app.route('/')
def form():
    return render_template("try-abg.html")

@app.route('/interpret', methods=['POST'])
def interpret():
    try:
        pH = float(request.form['ph'])
        pCO2 = float(request.form['pco2'])
        HCO3 = float(request.form['hco3'])

        result = interpret_abg(pH, pCO2, HCO3)
        return render_template("try-abg.html", result=result)
    except Exception as e:
        return render_template("try-abg.html", result={"error": str(e)})

if __name__ == '__main__':
 import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)


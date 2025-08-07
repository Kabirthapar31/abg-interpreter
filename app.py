from flask import Flask, render_template, request
import os

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/result', methods=['POST'])
def result():
    try:
        # Safely extract input values
        ph = float(request.form.get('ph', 0))
        pco2 = float(request.form.get('pco2', 0))
        hco3 = float(request.form.get('hco3', 0))
        na = float(request.form.get('na', 0))
        cl = float(request.form.get('cl', 0))
        lactate = float(request.form.get('lactate', 0))
        po2 = float(request.form.get('po2', 0))
        fio2 = float(request.form.get('fio2', 0.21)) / 100 if float(request.form.get('fio2', 21)) > 1 else float(request.form.get('fio2', 0.21))
        age = float(request.form.get('age', 40))

        # Primary Acid-Base Classification
        if ph < 7.35:
            primary = "Acidosis"
        elif ph > 7.45:
            primary = "Alkalosis"
        else:
            primary = "Normal"

        # Determine the primary disorder
        if primary == "Acidosis":
            if hco3 < 22:
                disorder = "Metabolic Acidosis"
            elif pco2 > 45:
                disorder = "Respiratory Acidosis"
            else:
                disorder = "Mixed or Compensated"
        elif primary == "Alkalosis":
            if hco3 > 26:
                disorder = "Metabolic Alkalosis"
            elif pco2 < 35:
                disorder = "Respiratory Alkalosis"
            else:
                disorder = "Mixed or Compensated"
        else:
            disorder = "Normal"

        # Compensation Calculations
        expected_pco2 = None
        expected_hco3 = None

        if disorder == "Metabolic Acidosis":
            expected_pco2 = round(1.5 * hco3 + 8, 2)
        elif disorder == "Metabolic Alkalosis":
            expected_pco2 = round(0.7 * hco3 + 20, 2)
        elif disorder == "Respiratory Acidosis":
            expected_hco3 = round(24 + 0.35 * (pco2 - 40), 2)
        elif disorder == "Respiratory Alkalosis":
            expected_hco3 = round(24 - 0.25 * (40 - pco2), 2)

        # Anion Gap
        anion_gap = na - (cl + hco3)

        # Delta Ratio (only in metabolic acidosis and valid when hco3 < 24)
        if hco3 < 24 and (24 - hco3) != 0:
            delta_ratio = round((anion_gap - 12) / (24 - hco3), 2)
        else:
            delta_ratio = "N/A"

        # A-a Gradient Calculation
        pao2 = fio2 * (713) - (pco2 / 0.8)  # (760 - 47 = 713)
        aagrad = round(pao2 - po2, 2)

        # Oxygenation Status
        oxygen_ratio = po2 / fio2 if fio2 != 0 else 0
        if oxygen_ratio < 300:
            oxygen_status = "Impaired"
        else:
            oxygen_status = "Normal"

        return render_template('result.html',
                               ph=ph,
                               pco2=pco2,
                               hco3=hco3,
                               na=na,
                               cl=cl,
                               lactate=lactate,
                               po2=po2,
                               fio2=fio2,
                               age=age,
                               disorder=disorder,
                               anion_gap=round(anion_gap, 2),
                               delta_ratio=delta_ratio,
                               aagrad=aagrad,
                               oxygen_status=oxygen_status,
                               expected_pco2=expected_pco2,
                               expected_hco3=expected_hco3,
                               primary=primary)
    except Exception as e:
        return f"❌ Error: {str(e)}"

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)

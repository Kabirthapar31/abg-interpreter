from flask import Flask, render_template, request
import os

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/result', methods=['POST'])
def result():
    try:
        ph = float(request.form['ph'])
        pco2 = float(request.form['pco2'])
        hco3 = float(request.form['hco3'])
        na = float(request.form.get('na', 0))
        cl = float(request.form.get('cl', 0))
        lactate = float(request.form.get('lactate', 0))
        po2 = float(request.form.get('po2', 0))
        fio2 = float(request.form.get('fio2', 0.21))

        # Primary disorder
        if ph < 7.35:
            primary = "Acidosis"
        elif ph > 7.45:
            primary = "Alkalosis"
        else:
            primary = "Normal"

        # Determine if metabolic or respiratory
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

        # Compensation status (simple version)
        if disorder == "Metabolic Acidosis":
            expected_pco2 = 1.5 * hco3 + 8
        elif disorder == "Metabolic Alkalosis":
            expected_pco2 = 0.7 * hco3 + 20
        elif disorder == "Respiratory Acidosis":
            expected_hco3 = 24 + 0.35 * (pco2 - 40)
        elif disorder == "Respiratory Alkalosis":
            expected_hco3 = 24 - 0.25 * (40 - pco2)
        else:
            expected_pco2 = expected_hco3 = None

        # Anion Gap
        anion_gap = na - (cl + hco3)

        # Delta Ratio
        delta_ratio = (anion_gap - 12) / (24 - hco3) if hco3 < 24 else 0

        # A-a gradient (Alveolar-arterial gradient)
        pao2 = fio2 * (760 - 47) - (pco2 / 0.8)
        aagrad = pao2 - po2

        # Oxygenation status
        if po2 / fio2 < 300:
            oxygen_status = "Impaired oxygenation"
        else:
            oxygen_status = "Normal oxygenation"

        return render_template('result.html',
                               ph=ph,
                               pco2=pco2,
                               hco3=hco3,
                               na=na,
                               cl=cl,
                               lactate=lactate,
                               po2=po2,
                               fio2=fio2,
                               disorder=disorder,
                               anion_gap=round(anion_gap, 2),
                               delta_ratio=round(delta_ratio, 2),
                               aagrad=round(aagrad, 2),
                               oxygen_status=oxygen_status,
                               primary=primary)

    except Exception as e:
        return f"Error: {e}"


  


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)


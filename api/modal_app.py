import modal

app = modal.App("ctc-calculator")

image = modal.Image.debian_slim(python_version="3.12").pip_install(
    "fastapi[standard]",
    "policyengine-us",
)

DEFAULT_AGE = 40


def create_situation(is_married: bool, child_ages: list[int], earnings: int, year: int) -> dict:
    situation = {
        "people": {
            "adult": {
                "age": {year: DEFAULT_AGE},
                "employment_income": {year: earnings},
            },
        },
        "families": {"family": {"members": ["adult"]}},
        "marital_units": {"marital_unit": {"members": ["adult"]}},
        "tax_units": {
            "tax_unit": {
                "members": ["adult"],
                "premium_tax_credit": {year: 0},
                "tax_unit_itemizes": {year: False},
                "taxable_income_deductions_if_itemizing": {year: 0},
                "alternative_minimum_tax": {year: 0},
                "net_investment_income_tax": {year: 0},
            }
        },
        "households": {
            "household": {"members": ["adult"], "state_name": {year: "TX"}}
        },
    }

    for i, age in enumerate(child_ages):
        child_id = f"child_{i}"
        situation["people"][child_id] = {"age": {year: age}}
        for unit in ["families", "tax_units", "households"]:
            situation[unit][list(situation[unit].keys())[0]]["members"].append(child_id)

    if is_married:
        situation["people"]["spouse"] = {"age": {year: DEFAULT_AGE}}
        for unit in ["families", "marital_units", "tax_units", "households"]:
            situation[unit][list(situation[unit].keys())[0]]["members"].append("spouse")

    return situation


@app.function(image=image, timeout=120)
@modal.web_endpoint(method="POST")
def calculate(data: dict) -> dict:
    from policyengine_us import Simulation

    is_married = data.get("isMarried", False)
    child_ages = data.get("childAges", [5])
    earnings = data.get("earnings", 50000)
    year = data.get("year", 2024)

    situation = create_situation(is_married, child_ages, earnings, year)
    ctc = float(Simulation(situation=situation).calculate("ctc_value", year)[0])

    return {"ctc": ctc, "year": year}

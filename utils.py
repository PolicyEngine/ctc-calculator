from policyengine_us import Simulation


# Colors
LIGHT_RED = "#f78989"
LIGHTER_RED = "#f9b1b1"
BLACK = "#000000"
BLUE_95 = "#D8E6F3"
BLUE_98 = "#F7FAFD"
BLUE = "#2C6496"
BLUE_LIGHT = "#D8E6F3"
BLUE_PRESSED = "#17354F"
BLUE_PRIMARY = "#2C6496"
DARK_BLUE_HOVER = "#1d3e5e"
DARK_GRAY = "#616161"
DARK_RED = "#b50d0d"
GRAY = "#808080"
LIGHT_GRAY = "#D3D3D3"
GREEN = "#29d40f"
LIGHT_GRAY = "#F2F2F2"
MEDIUM_DARK_GRAY = "#D2D2D2"
MEDIUM_LIGHT_GRAY = "#BDBDBD"
TEAL_ACCENT = "#39C6C0"
TEAL_LIGHT = "#F7FDFC"
TEAL_PRESSED = "#227773"
WHITE = "#FFFFFF"


DEFAULT_AGE = 40


def create_situation(is_married, child_ages, earnings, year, add_axes=False):
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
                # Performance improvement settings
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
    if add_axes:
        situation["people"]["adult"]["axes"] = {year: 0}
        if is_married:
            situation["people"]["spouse"]["axes"] = {year: 0}
        for i, age in enumerate(child_ages):
            situation["people"][f"child_{i}"]["axes"] = {year: 0}

    for i, age in enumerate(child_ages):
        child_id = f"child_{i}"
        situation["people"][child_id] = {"age": {year: age}}
        for unit in ["families", "tax_units", "households"]:
            situation[unit][list(situation[unit].keys())[0]]["members"].append(
                child_id
            )

    if is_married:
        situation["people"]["spouse"] = {"age": {year: DEFAULT_AGE}}
        for unit in ["families", "marital_units", "tax_units", "households"]:
            situation[unit][list(situation[unit].keys())[0]]["members"].append(
                "spouse"
            )

    return situation


def calculate_ctc(situation, year):
    return Simulation(situation=situation).calculate("ctc_value", year)[0]

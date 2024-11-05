from utils import GRAY, BLUE, LIGHT_RED, LIGHTER_RED
import importlib.metadata

POLICYENGINE_VERSION = importlib.metadata.version("policyengine-us")

APP_TITLE = "Child Tax Credit Calculator"

BASELINE_DESCRIPTION = """
The Child Tax Credit provides up to \$2,000 per qualifying child in 2024, or \$1,000 beginning in 2026. 
Enter your information below to see how much you'll be eligible for.

[Learn more about the Child Tax Credit](https://policyengine.org/us/research/the-child-tax-credit-in-2023)
"""

NOTES = """
#### Assumptions
- All earnings are from the tax filer's wages, salaries, and tips.
- The filer has no other taxable income.
- The filer takes the standard deduction.
- Married couples file jointly.
- Uses the `policyengine-us v{version}` Python package.
""".format(
    version=POLICYENGINE_VERSION
)

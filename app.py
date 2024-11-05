import streamlit as st
from utils import (
    create_situation,
    calculate_ctc,
    TEAL_ACCENT,
)
from config import (
    APP_TITLE,
    BASELINE_DESCRIPTION,
    NOTES,
)


def main():
    st.set_page_config(page_title=APP_TITLE, page_icon="👪")
    st.title(APP_TITLE)

    st.markdown(BASELINE_DESCRIPTION)

    # User inputs
    # Enter year, defaulting to current year.
    year = st.number_input("Year", min_value=2020, max_value=2030, value=2024)
    is_married = st.checkbox("I'm married")
    num_children = st.number_input(
        "Number of children", min_value=0, max_value=10, value=1
    )
    child_ages = [
        st.number_input(
            f"Age of child {i+1}", min_value=0, max_value=16, value=5
        )
        for i in range(num_children)
    ]
    earnings = st.number_input(
        f"Household wages and salaries in {year}",
        min_value=0,
        value=50000,
        step=1000,
    )

    if st.button("Calculate My CTC"):
        household = create_situation(is_married, child_ages, earnings, year)

        # Calculate CTC first
        ctc = calculate_ctc(household, year)

        # Display the baseline CTC
        # If the CTC is $0, display "You are not eligible for the Child Tax Credit."
        if ctc == 0:
            st.markdown(
                f"<h2 style='text-align: center;'>You are not eligible for the Child Tax Credit.</h2>",
                unsafe_allow_html=True,
            )
        else:
            st.markdown(
                f"<h2 style='text-align: center;'>In {year}, you will be eligible for a<br>"
                f"<span style='color:{TEAL_ACCENT};'>${ctc:,.0f}</span> child tax credit.</h2>",
                unsafe_allow_html=True,
            )

    st.markdown(NOTES)


if __name__ == "__main__":
    main()

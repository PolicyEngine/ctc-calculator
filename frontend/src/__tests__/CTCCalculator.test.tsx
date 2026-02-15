import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import CTCCalculator from "../components/CTCCalculator";

function renderWithProviders() {
  return render(
    <MantineProvider>
      <CTCCalculator />
    </MantineProvider>,
  );
}

describe("CTCCalculator", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the title and description", () => {
    renderWithProviders();
    expect(
      screen.getByText("Child tax credit calculator"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/The Child Tax Credit provides/),
    ).toBeInTheDocument();
  });

  it("renders all input fields", () => {
    renderWithProviders();
    expect(screen.getByLabelText("Year")).toBeInTheDocument();
    expect(screen.getByLabelText("I'm married")).toBeInTheDocument();
    expect(screen.getByLabelText("Number of children")).toBeInTheDocument();
    expect(screen.getByLabelText("Age of child 1")).toBeInTheDocument();
  });

  it("renders the calculate button", () => {
    renderWithProviders();
    expect(
      screen.getByRole("button", { name: /calculate my ctc/i }),
    ).toBeInTheDocument();
  });

  it("renders the assumptions section", () => {
    renderWithProviders();
    expect(screen.getByText("Assumptions")).toBeInTheDocument();
    expect(
      screen.getByText(/standard deduction/),
    ).toBeInTheDocument();
  });

  it("displays CTC result after successful calculation", async () => {
    const mockResponse = { ctc: 2000, year: 2024 };
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    renderWithProviders();
    fireEvent.click(
      screen.getByRole("button", { name: /calculate my ctc/i }),
    );

    await waitFor(() => {
      expect(screen.getByText(/\$2,000/)).toBeInTheDocument();
    });
  });

  it("displays not eligible message when CTC is 0", async () => {
    const mockResponse = { ctc: 0, year: 2024 };
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    renderWithProviders();
    fireEvent.click(
      screen.getByRole("button", { name: /calculate my ctc/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByText(/not eligible for the Child Tax Credit/),
      ).toBeInTheDocument();
    });
  });

  it("displays error on API failure", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    renderWithProviders();
    fireEvent.click(
      screen.getByRole("button", { name: /calculate my ctc/i }),
    );

    await waitFor(() => {
      expect(screen.getByText(/API error: 500/)).toBeInTheDocument();
    });
  });

  it("renders learn more link", () => {
    renderWithProviders();
    const link = screen.getByText("Learn more about the Child Tax Credit");
    expect(link).toHaveAttribute(
      "href",
      "https://policyengine.org/us/research/the-child-tax-credit-in-2023",
    );
  });
});

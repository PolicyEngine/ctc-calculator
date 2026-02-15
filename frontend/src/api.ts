const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://policyengine--ctc-calculator-calculate.modal.run";

export interface CalculateRequest {
  year: number;
  isMarried: boolean;
  childAges: number[];
  earnings: number;
}

export interface CalculateResponse {
  ctc: number;
  year: number;
}

export async function calculateCTC(
  params: CalculateRequest,
): Promise<CalculateResponse> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json() as Promise<CalculateResponse>;
}

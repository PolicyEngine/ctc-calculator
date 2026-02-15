import { useState } from "react";
import {
  Container,
  Title,
  Text,
  NumberInput,
  Checkbox,
  Button,
  Stack,
  Paper,
  Anchor,
  Loader,
  Alert,
} from "@mantine/core";
import { designTokens } from "../designTokens";
import { calculateCTC } from "../api";

export default function CTCCalculator() {
  const [year, setYear] = useState<number>(2024);
  const [isMarried, setIsMarried] = useState(false);
  const [numChildren, setNumChildren] = useState<number>(1);
  const [childAges, setChildAges] = useState<number[]>([5]);
  const [earnings, setEarnings] = useState<number>(50000);
  const [ctcResult, setCtcResult] = useState<number | null>(null);
  const [resultYear, setResultYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNumChildrenChange = (val: string | number) => {
    const n = typeof val === "string" ? parseInt(val, 10) || 0 : val;
    setNumChildren(n);
    setChildAges((prev) => {
      if (n > prev.length) {
        return [...prev, ...Array(n - prev.length).fill(5) as number[]];
      }
      return prev.slice(0, n);
    });
  };

  const handleChildAgeChange = (index: number, val: string | number) => {
    const age = typeof val === "string" ? parseInt(val, 10) || 0 : val;
    setChildAges((prev) => {
      const next = [...prev];
      next[index] = age;
      return next;
    });
  };

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    setCtcResult(null);
    try {
      const result = await calculateCTC({
        year,
        isMarried,
        childAges,
        earnings,
      });
      setCtcResult(result.ctc);
      setResultYear(result.year);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Calculation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="sm" py="xl">
      <Stack gap="lg">
        <Title order={1}>Child tax credit calculator</Title>

        <Text>
          The Child Tax Credit provides up to $2,000 per qualifying child in
          2024, or $1,000 beginning in 2026. Enter your information below to see
          how much you'll be eligible for.
        </Text>
        <Anchor
          href="https://policyengine.org/us/research/the-child-tax-credit-in-2023"
          target="_blank"
        >
          Learn more about the Child Tax Credit
        </Anchor>

        <NumberInput
          label="Year"
          value={year}
          onChange={(val) => setYear(typeof val === "string" ? 2024 : val)}
          min={2020}
          max={2030}
        />

        <Checkbox
          label="I'm married"
          checked={isMarried}
          onChange={(e) => setIsMarried(e.currentTarget.checked)}
        />

        <NumberInput
          label="Number of children"
          value={numChildren}
          onChange={handleNumChildrenChange}
          min={0}
          max={10}
        />

        {childAges.map((age, i) => (
          <NumberInput
            key={i}
            label={`Age of child ${i + 1}`}
            value={age}
            onChange={(val) => handleChildAgeChange(i, val)}
            min={0}
            max={16}
          />
        ))}

        <NumberInput
          label={`Household wages and salaries in ${year}`}
          value={earnings}
          onChange={(val) =>
            setEarnings(typeof val === "string" ? 50000 : val)
          }
          min={0}
          step={1000}
          thousandSeparator=","
          prefix="$"
        />

        <Button
          onClick={handleCalculate}
          loading={loading}
          color="teal"
          size="md"
        >
          Calculate my CTC
        </Button>

        {loading && <Loader color="teal" style={{ alignSelf: "center" }} />}

        {error && <Alert color="red" title="Error">{error}</Alert>}

        {ctcResult !== null && resultYear !== null && (
          <Paper
            p="xl"
            radius="md"
            style={{ textAlign: "center" }}
            withBorder
          >
            {ctcResult === 0 ? (
              <Title order={2}>
                You are not eligible for the Child Tax Credit.
              </Title>
            ) : (
              <Title order={2}>
                In {resultYear}, you will be eligible for a{" "}
                <span style={{ color: designTokens.colors.primary }}>
                  ${ctcResult.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </span>{" "}
                child tax credit.
              </Title>
            )}
          </Paper>
        )}

        <Paper p="md" radius="md" bg="gray.0">
          <Title order={4}>Assumptions</Title>
          <Text component="ul" size="sm" c="dimmed">
            <li>
              All earnings are from the tax filer's wages, salaries, and tips.
            </li>
            <li>The filer has no other taxable income.</li>
            <li>The filer takes the standard deduction.</li>
            <li>Married couples file jointly.</li>
            <li>
              Uses the policyengine-us Python package via{" "}
              <Anchor href="https://policyengine.org" target="_blank">
                PolicyEngine
              </Anchor>
              .
            </li>
          </Text>
        </Paper>
      </Stack>
    </Container>
  );
}

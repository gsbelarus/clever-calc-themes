import { describe, expect, it } from "vitest";
import { calculate, isReadyToCalculate, validateInput } from "@/lib/calculator/calculate";
import { defaultInput, defaultMitarbeiterFor } from "@/lib/calculator/branche";

describe("calculator", () => {
  it("isReadyToCalculate is false for empty input", () => {
    expect(isReadyToCalculate(defaultInput("dienstleistung"))).toBe(false);
  });

  it("validates umsatz must be > aufwand", () => {
    const i = defaultInput("dienstleistung");
    i.umsatz = 100;
    i.aufwand = 200;
    i.stunden = 100;
    const err = validateInput(i);
    expect(err).not.toBeNull();
  });

  it("computes baseline ausgangssituation correctly (dienstleistung)", () => {
    const i = defaultInput("dienstleistung");
    i.umsatz = 50000;
    i.aufwand = 10000;
    i.stunden = 1000;
    const r = calculate(i);
    expect(r.fehlermeldung).toBe("");
    expect(r.ausgangssituation.gewinn.jahr).toBe(40000);
    // No employees → break-even == ausgangssituation
    expect(r.breakEven.breakEvenUmsatz.jahr).toBe(50000);
  });

  it("includes Mitarbeiter1 personalkosten when active (gewerbe)", () => {
    const i = defaultInput("gewerbe");
    i.umsatz = 100000;
    i.aufwand = 20000;
    i.wareneinsatz = 10000;
    i.stunden = 1000;
    i.mitarbeiter1 = { ...defaultMitarbeiterFor("gewerbe", true), bruttogehaltProMonat: 2000 };
    const r = calculate(i);
    expect(r.fehlermeldung).toBe("");
    expect(r.breakEven.personalkosten.jahr).toBeGreaterThan(0);
    // Employee 1 brutto-jahr should be 2000 * 14 = 28000
    expect(r.breakEven.mitarbeiter[0].brutto.jahr).toBeCloseTo(28000, 0);
  });

  it("provision branch produces gesamtumsatz when provision > 0", () => {
    const i = defaultInput("provision");
    i.umsatz = 50000;
    i.aufwand = 10000;
    i.provision = 10;
    const r = calculate(i);
    expect(r.fehlermeldung).toBe("");
    expect(r.breakEven.gesamtumsatz.jahr).toBeGreaterThan(0);
  });
});

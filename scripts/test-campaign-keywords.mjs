import assert from "node:assert/strict";
import { test } from "node:test";
import {
  detectCampaignKeyword,
  INSTAGRAM_EDITORIAL_CAMPAIGN,
} from "../src/lib/crm/campaign-keywords.ts";

const cases = [
  ["SALUD", "SALUD", "salud"],
  ["salud.", "SALUD", "salud"],
  ["AGENDA", "AGENDA", "belleza"],
  ["agenda!", "AGENDA", "belleza"],
  ["Fitness", "FITNESS", "fitness"],
  ["DIAGNÓSTICO", "DIAGNÓSTICO", "general"],
  ["diagnostico", "DIAGNÓSTICO", "general"],
];

for (const [message, keyword, vertical] of cases) {
  test(`clasifica ${message}`, () => {
    const result = detectCampaignKeyword([message]);
    assert.equal(result?.keyword, keyword);
    assert.equal(result?.vertical, vertical);
    assert.equal(result?.campaign, INSTAGRAM_EDITORIAL_CAMPAIGN);
    assert.ok(result?.qualificationQuestion);
  });
}

test("atribuye variantes de LANDING a su campaña orgánica", () => {
  for (const message of ["LANDING", "landing", "Landing!"]) {
    const result = detectCampaignKeyword([message]);
    assert.equal(result?.keyword, "LANDING");
    assert.equal(result?.vertical, "general");
    assert.equal(result?.campaign, "landing_pages");
    assert.equal(result?.interest, "Landing page y conversión");
    assert.ok(result?.tags.includes("origen:instagram-story"));
    assert.ok(result?.tags.includes("servicio:landing-page"));
  }
});

test("prioriza la palabra clave más reciente", () => {
  assert.equal(
    detectCampaignKeyword(["SALUD", "FITNESS"])?.keyword,
    "FITNESS",
  );
});

test("no clasifica menciones casuales como palabra de campaña", () => {
  assert.equal(
    detectCampaignKeyword(["Trabajo en el área de salud y necesito ayuda"]),
    null,
  );
});

test("no clasifica mensajes no relacionados", () => {
  assert.equal(detectCampaignKeyword(["Hola, quisiera información"]), null);
});

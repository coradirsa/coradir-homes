#!/usr/bin/env node

import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const DEFAULT_BASE_URL = process.env.LEAD_BOT_BASE_URL || "http://localhost:6118";
const DEFAULT_CASES_URL = new URL("../docs/lead-bot/evaluation-cases.json", import.meta.url);
const DEFAULT_TEMPLATES_URL = new URL("../docs/lead-bot/query-templates.json", import.meta.url);

function parseArgs(argv) {
  const args = {
    baseUrl: DEFAULT_BASE_URL,
    casesUrl: DEFAULT_CASES_URL,
    templatesUrl: DEFAULT_TEMPLATES_URL,
    includeTemplates: true,
    verbose: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--base-url") args.baseUrl = argv[++index];
    else if (arg === "--cases") args.casesUrl = pathToFileURL(resolve(argv[++index]));
    else if (arg === "--templates") args.templatesUrl = pathToFileURL(resolve(argv[++index]));
    else if (arg === "--no-templates") args.includeTemplates = false;
    else if (arg === "--verbose") args.verbose = true;
    else if (arg === "--help") {
      printHelp();
      process.exit(0);
    }
  }

  return args;
}

function printHelp() {
  console.log(`Usage: npm run bot:evaluate -- [options]

Options:
  --base-url <url>     Chatbot URL. Default: ${DEFAULT_BASE_URL}
  --cases <path>       Evaluation cases JSON.
  --templates <path>   Query templates JSON.
  --no-templates       Run only explicit evaluation cases.
  --verbose            Print each final reply.
`);
}

async function readJson(url) {
  const content = await readFile(fileURLToPath(url), "utf8");
  return JSON.parse(content);
}

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function expandInput(input, variables, maxGenerated = 12) {
  const names = [...input.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]);
  if (names.length === 0) return [input];

  const values = names.map((name) => {
    const options = variables[name];
    if (!Array.isArray(options) || options.length === 0) {
      throw new Error(`Missing template variable: ${name}`);
    }
    return { name, options };
  });

  const expanded = [];

  function walk(index, current) {
    if (expanded.length >= maxGenerated) return;
    if (index === values.length) {
      expanded.push(current);
      return;
    }

    const { name, options } = values[index];
    for (const option of options) {
      walk(index + 1, current.replaceAll(`{${name}}`, option));
      if (expanded.length >= maxGenerated) return;
    }
  }

  walk(0, input);
  return expanded;
}

function casesFromTemplates(config) {
  const variables = config.variables || {};
  const templates = Array.isArray(config.templates) ? config.templates : [];

  return templates.flatMap((template) => {
    const maxGenerated = template.maxGenerated || 12;
    return expandInput(template.input, variables, maxGenerated).map((message, index) => ({
      id: `${template.id}_${String(index + 1).padStart(2, "0")}`,
      category: template.category || "template",
      path: template.path,
      messages: [message],
      expect: template.expect || {},
      generatedFromTemplate: template.id,
    }));
  });
}

async function callBot(baseUrl, clientId, message, state, pathname) {
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/lead-bot/message`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      clientId,
      message,
      state,
      tracking: {
        pathname,
      },
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.success === false) {
    throw new Error(`HTTP ${response.status}: ${payload.error || response.statusText}`);
  }
  return payload;
}

function evaluateExpectation(testCase, result) {
  const reply = result.reply || "";
  const normalizedReply = normalize(reply);
  const expect = testCase.expect || {};
  const failures = [];

  for (const expected of expect.mustInclude || []) {
    if (!normalizedReply.includes(normalize(expected))) {
      failures.push(`missing text: ${expected}`);
    }
  }

  for (const forbidden of expect.mustNotInclude || []) {
    if (normalizedReply.includes(normalize(forbidden))) {
      failures.push(`forbidden text present: ${forbidden}`);
    }
  }

  for (const pattern of expect.mustMatch || []) {
    if (!new RegExp(pattern, "i").test(reply)) {
      failures.push(`regex did not match: ${pattern}`);
    }
  }

  if (expect.state) {
    for (const [key, value] of Object.entries(expect.state)) {
      if (result.state?.[key] !== value) {
        failures.push(`state.${key} expected ${value}, got ${result.state?.[key]}`);
      }
    }
  }

  if (expect.knowledgeSourceIds) {
    const actualIds = new Set((result.knowledgeSources || []).map((source) => source.id));
    for (const expectedId of expect.knowledgeSourceIds) {
      if (!actualIds.has(expectedId)) {
        failures.push(`missing knowledge source: ${expectedId}`);
      }
    }
  }

  return failures;
}

async function runCase(baseUrl, testCase) {
  const clientId = `eval-${randomUUID()}`;
  let state = testCase.initialState;
  let result;

  for (const message of testCase.messages) {
    result = await callBot(baseUrl, clientId, message, state, testCase.path || "/");
    state = result.state;
  }

  return result;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const explicitCases = await readJson(args.casesUrl);
  const templateCases = args.includeTemplates ? casesFromTemplates(await readJson(args.templatesUrl)) : [];
  const cases = [...explicitCases, ...templateCases];
  const results = [];

  console.log(`Running ${cases.length} lead bot evaluation cases against ${args.baseUrl}`);

  for (const testCase of cases) {
    try {
      const result = await runCase(args.baseUrl, testCase);
      const failures = evaluateExpectation(testCase, result);
      const passed = failures.length === 0;
      results.push({ id: testCase.id, passed, failures, reply: result.reply });

      console.log(`${passed ? "PASS" : "FAIL"} ${testCase.id}`);
      if (!passed || args.verbose) {
        console.log(`  question: ${testCase.messages[testCase.messages.length - 1]}`);
        console.log(`  reply: ${String(result.reply || "").replace(/\n/g, "\\n")}`);
      }
      for (const failure of failures) {
        console.log(`  - ${failure}`);
      }
    } catch (error) {
      results.push({ id: testCase.id, passed: false, failures: [error.message] });
      console.log(`FAIL ${testCase.id}`);
      console.log(`  - ${error.message}`);
    }
  }

  const failed = results.filter((result) => !result.passed);
  const passed = results.length - failed.length;
  console.log(`\nSummary: ${passed}/${results.length} passed`);

  if (failed.length > 0) {
    console.log("Failed cases:");
    for (const result of failed) {
      console.log(`- ${result.id}: ${result.failures.join("; ")}`);
    }
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error.message);
  console.error(`Make sure the local app is running, for example: npm run start`);
  process.exit(1);
});

import type { TestInfo } from "@playwright/test";

export function uniqueE2eEmail(testInfo: TestInfo) {
  return `e2e-${testInfo.workerIndex}-${testInfo.retry}-${crypto.randomUUID()}@example.com`;
}

export function uniqueE2eLabel(prefix: string, testInfo: TestInfo) {
  return `${prefix} ${testInfo.workerIndex}-${testInfo.retry}-${crypto.randomUUID()}`;
}

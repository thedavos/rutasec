const LEARNING_MODES = ["theory", "practice", "mixed"];

const REQUIRED_RESOURCE_FIELDS = [
  "id",
  "title",
  "url",
  "phase",
  "category",
  "topic",
  "resource_type",
  "level",
  "estimated_hours",
  "original_source_name",
  "original_source_url",
  "curated_from_name",
  "curated_from_url",
  "roadmap_section",
  "path_order",
];

export function requireField(obj, field, context) {
  if (obj[field] === undefined || obj[field] === null || obj[field] === "") {
    throw new Error(`Missing required field '${field}' in ${context}`);
  }
}

export function validateSeedResource(resource, context = "resource") {
  if (!resource || typeof resource !== "object") {
    throw new Error(`${context} must be an object`);
  }

  for (const field of REQUIRED_RESOURCE_FIELDS) {
    requireField(resource, field, context);
  }

  if (!Array.isArray(resource.tags)) {
    throw new Error(`${context}.tags must be an array`);
  }

  const hasLearningMode = resource.tags.some((tag) =>
    LEARNING_MODES.includes(String(tag).trim().toLowerCase()),
  );
  if (!hasLearningMode) {
    throw new Error(`${context}.tags must include one of: ${LEARNING_MODES.join(", ")}`);
  }
}

export function validateSeed(seed) {
  if (!seed || typeof seed !== "object") {
    throw new Error("Seed must be a JSON object");
  }

  if (!seed.learning_path || typeof seed.learning_path !== "object") {
    throw new Error("Seed must contain a learning_path object");
  }

  if (!Array.isArray(seed.resources) || seed.resources.length === 0) {
    throw new Error("Seed must contain a non-empty resources array");
  }

  const lp = seed.learning_path;
  ["id", "slug", "title", "description"].forEach((field) =>
    requireField(lp, field, "learning_path"),
  );

  const seenIds = new Set();
  const seenOrders = new Set();

  seed.resources.forEach((resource, index) => {
    const context = `resources[${index}]`;
    validateSeedResource(resource, context);

    if (seenIds.has(resource.id)) {
      throw new Error(`Duplicate resource id: ${resource.id}`);
    }
    seenIds.add(resource.id);

    if (seenOrders.has(resource.path_order)) {
      throw new Error(`Duplicate path_order: ${resource.path_order}`);
    }
    seenOrders.add(resource.path_order);
  });
}

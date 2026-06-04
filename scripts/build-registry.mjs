import { readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const BASE_URL = process.env.URL ?? "http://localhost:4321";

const registry = JSON.parse(
  readFileSync(resolve(root, "registry.json"), "utf8"),
);

function resolveRegistryDep(dep) {
  if (dep.startsWith("@kaui/")) {
    const name = dep.replace("@kaui/", "");
    return `${BASE_URL}/r/${name}.json`;
  }
  return dep;
}

function transformImports(content) {
  return content
    .replace(
      /from "@\/registry\/base\/([a-z-]+)\/components\/\1"/g,
      (_, name) => `from "@/components/ui/${name}"`,
    )
    .replace(
      /from "\.\.\/\.\.\/([a-z-]+)\/components\/\1"/g,
      (_, name) => `from "@/components/ui/${name}"`,
    );
}

let built = 0;

for (const item of registry.items) {
  const files = item.files.map((file) => {
    const raw = readFileSync(resolve(root, file.path), "utf8");
    const { path: _path, ...rest } = file;
    return {
      ...rest,
      path: file.path,
      content: transformImports(raw),
    };
  });

  const registryDependencies = (item.registryDependencies ?? []).map(
    resolveRegistryDep,
  );

  const output = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: item.name,
    type: item.type,
    description: item.description,
    ...(item.dependencies?.length && { dependencies: item.dependencies }),
    ...(registryDependencies.length && { registryDependencies }),
    files,
  };

  writeFileSync(
    resolve(root, `public/r/${item.name}.json`),
    JSON.stringify(output, null, 2),
  );

  console.log(`  built → public/r/${item.name}.json`);
  built++;
}

console.log(`\nregistry: ${built} item${built !== 1 ? "s" : ""} built`);

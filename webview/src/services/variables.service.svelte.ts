export const GLOBAL = "global";
export const ENVIRONMENT = "environment";
export const COLLECTION = "collection";
export const SECRET = "secret";

export type VariableScope = typeof GLOBAL | typeof ENVIRONMENT | typeof COLLECTION | typeof SECRET;

interface VariableStorage {
  global: Map<string, string>;
  environment: Map<string, string>;
  collection: Map<string, string>;
  secret: Map<string, string>;
}

let variableStorage: VariableStorage = $state({
  global: new Map(),
  environment: new Map(),
  collection: new Map(),
  secret: new Map(),
});

export const variablesService = {
  resolve(key: string): string {
    // resolve the key in the order of secret > collection > environment > global by using the resolve function defined below
    // if result contains this regex \{\{.+\}\}, resolve it recursively until no more {{}} is found
    let ans: string | undefined = undefined;
    const storages = [
      variableStorage.secret,
      variableStorage.collection,
      variableStorage.environment,
      variableStorage.global,
    ];
    for (const storage of storages) {
      try {
        ans = resolve(key, storage);
        break;
      } catch (e) {
        if (e instanceof Error && e.cause === "VariableNotFound") {
          continue;
        } else {
          throw e;
        }
      }
    }
    if (ans === undefined) {
      throw new Error(`Variable ${key} not found in any storage`, {
        cause: "VariableNotFound",
      });
    }
    const variableRegex = /\{\{(.+?)\}\}/g;
    let match: RegExpExecArray | null;
    while ((match = variableRegex.exec(ans)) !== null) {
      const variableKey = match[1];
      const variableValue = this.resolve(variableKey);
      ans = ans.replace(`{{${variableKey}}}`, variableValue);
    }
    return ans;
  },
  reset: () => {
    variableStorage.global.clear();
    variableStorage.environment.clear();
    variableStorage.collection.clear();
    variableStorage.secret.clear();
  },
  set: (scope: VariableScope, key: string, value: string) => {
    variableStorage[scope].set(key, value);
  },
  override: (newVariableStorage: VariableStorage) => {
    variableStorage = newVariableStorage;
  }
};

const resolve = (key: string, variables: Map<string, string>): string => {
  const ans = variables.get(key);
  if (ans === undefined) {
    throw new Error(`Variable ${key} not found`, { cause: "VariableNotFound" });
  }
  return ans;
};

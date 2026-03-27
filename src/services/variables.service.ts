export const GLOBAL = "global";
export const ENVIRONMENT = "environment";
export const COLLECTION = "collection";
export const SECRET = "secret";

export type VariableScope =
    | typeof GLOBAL
    | typeof ENVIRONMENT
    | typeof COLLECTION
    | typeof SECRET;

interface VariableStorage {
    global: Map<string, string>;
    environment: Map<string, string>;
    collection: Map<string, string>;
    secret: Map<string, string>;
}

// Internal state (Native Maps)
let variableStorage: VariableStorage = {
    global: new Map(),
    environment: new Map(),
    collection: new Map(),
    secret: new Map(),
};

// Listeners for React components
let listeners: Array<() => void> = [];

const emitChange = () => {
    listeners.forEach((l) => l());
};

export const variablesService = {
    resolve(key: string, depth = 0): string {
        if (depth > 20) {
            throw new Error("Circular dependency detected", {
                cause: "CircularDependency",
            });
        }

        let ans: string | undefined = undefined;
        const storages = [
            variableStorage.secret,
            variableStorage.collection,
            variableStorage.environment,
            variableStorage.global,
        ];

        for (const storage of storages) {
            ans = storage.get(key);
            if (ans !== undefined) break;
        }

        if (ans === undefined) {
            throw new Error(`Variable ${key} not found`, {
                cause: "VariableNotFound",
            });
        }

        // Recursive resolution for {{nested}}
        return ans.replace(/\{\{(.+?)\}\}/g, (_, variableKey) => {
            return this.resolve(variableKey.trim(), depth + 1);
        });
    },

    set(scope: VariableScope, key: string, value: string) {
        variableStorage[scope].set(key, value);
        emitChange(); // Trigger React update
    },

    reset() {
        variableStorage.global.clear();
        variableStorage.environment.clear();
        variableStorage.collection.clear();
        variableStorage.secret.clear();
        emitChange();
    },
};

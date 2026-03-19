import { describe, it, expect, beforeEach } from "vitest";
import {
    variablesService,
    SECRET,
    GLOBAL,
    ENVIRONMENT,
    COLLECTION,
} from "./variables.service";

describe("VariablesService", () => {
    beforeEach(() => {
        variablesService.reset();
    });

    describe("Priority Resolution", () => {
        it("should resolve a global variable when no others exist", () => {
            variablesService.set(GLOBAL, "host", "api.com");
            expect(variablesService.resolve("host")).toBe("api.com");
        });

        it("should prioritize SECRET over all other scopes", () => {
            variablesService.set(GLOBAL, "token", "global_token");
            variablesService.set(ENVIRONMENT, "token", "env_token");
            variablesService.set(COLLECTION, "token", "coll_token");
            variablesService.set(SECRET, "token", "secret_token");

            expect(variablesService.resolve("token")).toBe("secret_token");
        });

        it("should fallback to next priority if not in secret", () => {
            variablesService.set(GLOBAL, "port", "8080");
            variablesService.set(ENVIRONMENT, "port", "3000");
            // Secret doesn't have 'port'

            expect(variablesService.resolve("port")).toBe("3000");
        });
    });

    describe("Recursive Resolution", () => {
        it("should resolve nested variables: {{host}} inside a string", () => {
            variablesService.set(GLOBAL, "domain", "example.com");
            variablesService.set(GLOBAL, "url", "https://{{domain}}/v1");

            expect(variablesService.resolve("url")).toBe(
                "https://example.com/v1",
            );
        });

        it("should resolve multi-level nesting", () => {
            variablesService.set(GLOBAL, "proto", "https");
            variablesService.set(GLOBAL, "host", "api.{{proto}}.com");
            variablesService.set(GLOBAL, "endpoint", "{{host}}/users");

            expect(variablesService.resolve("endpoint")).toBe(
                "api.https.com/users",
            );
        });

        // Test a deep of 19 levels of nesting and spread between scopes (should work)
        it("should resolve 19 levels of nesting spread across all scopes", () => {
            // level19 is the final literal value
            variablesService.set(GLOBAL, "level19", "final_value");

            // Create a chain: level0 -> {{level1}} -> {{level2}} ... -> {{level19}}
            // We distribute them across scopes to test the hierarchy lookup
            const scopes = [GLOBAL, ENVIRONMENT, COLLECTION, SECRET] as const;

            for (let i = 0; i < 19; i++) {
                const currentScope = scopes[i % scopes.length];
                variablesService.set(
                    currentScope,
                    `level${i}`,
                    `{{level${i + 1}}}`,
                );
            }

            // This should trigger 19 recursive calls
            expect(variablesService.resolve("level0")).toBe("final_value");
        });
    });

    describe("Error Handling", () => {
        it("should throw VariableNotFound if key does not exist anywhere", () => {
            expect(() => variablesService.resolve("unknown")).toThrow(
                /Variable unknown not found/,
            );
        });

        it("should handle circular dependencies without crashing (Stack Overflow check)", () => {
            variablesService.set(GLOBAL, "A", "{{B}}");
            variablesService.set(GLOBAL, "B", "{{A}}");

            // Note: Your current code will throw "Maximum call stack size exceeded"
            // which is a valid test failure to catch!
            expect(() => variablesService.resolve("A")).toThrow();
        });

        // test CircularDependency
        it("should detect circular dependencies and throw a specific error", () => {
            variablesService.set(GLOBAL, "X", "{{Y}}");
            variablesService.set(GLOBAL, "Y", "{{X}}");

            expect(() => variablesService.resolve("X")).toThrow(
                /Circular dependency detected/,
            );
        });

        it("should fail when nesting exceeds the depth limit (20+)", () => {
            // Create a 21-level chain
            variablesService.set(GLOBAL, "depth21", "too_deep");
            for (let i = 0; i < 21; i++) {
                variablesService.set(GLOBAL, `depth${i}`, `{{depth${i + 1}}}`);
            }

            // Based on your code's depth > 10 check, this must throw
            expect(() => variablesService.resolve("depth0")).toThrow(
                /Circular dependency/,
            );
        });
    });
});

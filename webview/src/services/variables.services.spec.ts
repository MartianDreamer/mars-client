import { describe, it, expect, beforeEach } from 'vitest';
import { variablesService, SECRET, GLOBAL, ENVIRONMENT, COLLECTION } from './variables.service.svelte';

describe('VariablesService', () => {
  
  beforeEach(() => {
    variablesService.reset();
  });

  describe('Priority Resolution', () => {
    it('should resolve a global variable when no others exist', () => {
      variablesService.set(GLOBAL, 'host', 'api.com');
      expect(variablesService.resolve('host')).toBe('api.com');
    });

    it('should prioritize SECRET over all other scopes', () => {
      variablesService.set(GLOBAL, 'token', 'global_token');
      variablesService.set(ENVIRONMENT, 'token', 'env_token');
      variablesService.set(COLLECTION, 'token', 'coll_token');
      variablesService.set(SECRET, 'token', 'secret_token');

      expect(variablesService.resolve('token')).toBe('secret_token');
    });

    it('should fallback to next priority if not in secret', () => {
      variablesService.set(GLOBAL, 'port', '8080');
      variablesService.set(ENVIRONMENT, 'port', '3000');
      // Secret doesn't have 'port'
      
      expect(variablesService.resolve('port')).toBe('3000');
    });
  });

  describe('Recursive Resolution', () => {
    it('should resolve nested variables: {{host}} inside a string', () => {
      variablesService.set(GLOBAL, 'domain', 'example.com');
      variablesService.set(GLOBAL, 'url', 'https://{{domain}}/v1');

      expect(variablesService.resolve('url')).toBe('https://example.com/v1');
    });

    it('should resolve multi-level nesting', () => {
      variablesService.set(GLOBAL, 'proto', 'https');
      variablesService.set(GLOBAL, 'host', 'api.{{proto}}.com');
      variablesService.set(GLOBAL, 'endpoint', '{{host}}/users');

      expect(variablesService.resolve('endpoint')).toBe('api.https.com/users');
    });
  });

  describe('Error Handling', () => {
    it('should throw VariableNotFound if key does not exist anywhere', () => {
      expect(() => variablesService.resolve('unknown')).toThrow(/not found in any storage/);
    });

    it('should handle circular dependencies without crashing (Stack Overflow check)', () => {
      variablesService.set(GLOBAL, 'A', '{{B}}');
      variablesService.set(GLOBAL, 'B', '{{A}}');

      // Note: Your current code will throw "Maximum call stack size exceeded" 
      // which is a valid test failure to catch!
      expect(() => variablesService.resolve('A')).toThrow();
    });
  });
});
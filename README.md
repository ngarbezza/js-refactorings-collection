# Javascript Refactorings Collection

A collection of simple refactorings for Javascript. It uses [Acorn](https://github.com/acornjs/acorn) for parsing the JS code.

## Why

Implementing refactorings is not that hard as it seems. We as developers should write our own tools if we don't have them available in our programming environments.

## Refactorings list

### Remove unnecessary conditional

Input:

```javascript
if (a > b) {
  return true;
} else {
  return false;
}
```

Output:

```javascript
return a > b; 
```

Usage:

```javascript
const RemoveUnnecessaryConditional = require('lib/remove_unnecessary_conditional');

const originalCode = 'if (a > b) { return true } else { return false }';
const refactoring = new RemoveUnnecessaryConditional(originalCode);
const refactoredCode =  refactoring.apply();
// refactoredCode: 'return a > b'
```

## Next Steps

- [ ] release NPM package
- [ ] VSCode integration
- [ ] Continue adding refactorings

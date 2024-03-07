import { assert, suite, test } from '@pmoo/testy';

import { RemoveUnnecessaryConditional } from '../lib/remove_unnecessary_conditional.js';

function removeUnnecessaryIf(sourceCode) {
  return new RemoveUnnecessaryConditional(sourceCode).apply();
}

suite('"remove unnecessary conditional" refactoring', () => {
  test('works on a trivial condition', () => {
    const sourceCode = 'if (true) return true; else return false';
    const newSourceCode = removeUnnecessaryIf(sourceCode);

    assert.areEqual(newSourceCode, 'return true');
  });

  test('works on a non-trivial condition', () => {
    const sourceCode = 'if ([1,2,3].length > 2) return true; else return false';
    const newSourceCode = removeUnnecessaryIf(sourceCode);

    assert.areEqual(newSourceCode, 'return [1,2,3].length > 2');
  });

  test('fails when the code is not an if statement', () => {
    const sourceCode = 'while ([1,2,3].length > 2) return true';

    assert
      .that(() => removeUnnecessaryIf(sourceCode))
      .raises(new Error(RemoveUnnecessaryConditional.errorMessageForInvalidStatementType()));
  });

  test('fails when there are more than one statement', () => {
    const sourceCode = 'if ([1,2,3].length > 2) return true; const x = 42;';

    assert
      .that(() => removeUnnecessaryIf(sourceCode))
      .raises(new Error(RemoveUnnecessaryConditional.errorMessageForMultipleStatements()));
  });

  test('fails when the consequent block is not a return statement', () => {
    const sourceCode = 'if ([1,2,3].length > 2) { const x = 42; } else return false';

    assert
      .that(() => removeUnnecessaryIf(sourceCode))
      .raises(new Error(RemoveUnnecessaryConditional.errorMessageForConditionalCannotBeSimplified()));
  });

  test('fails when the consequent block is not a { return true } statement', () => {
    const sourceCode = 'if ([1,2,3].length > 2) return 42; else return false';

    assert
      .that(() => removeUnnecessaryIf(sourceCode))
      .raises(new Error(RemoveUnnecessaryConditional.errorMessageForConditionalCannotBeSimplified()));
  });

  test('fails when the alternative block is not a return statement', () => {
    const sourceCode = 'if ([1,2,3].length > 2) return true; else { const x = 42; }';

    assert
      .that(() => removeUnnecessaryIf(sourceCode))
      .raises(new Error(RemoveUnnecessaryConditional.errorMessageForConditionalCannotBeSimplified()));
  });

  test('fails when the alternative block is not a { return false } statement', () => {
    const sourceCode = 'if ([1,2,3].length > 2) return true; else return 42';

    assert
      .that(() => removeUnnecessaryIf(sourceCode))
      .raises(new Error(RemoveUnnecessaryConditional.errorMessageForConditionalCannotBeSimplified()));
  });

  test('fails when the alternative block is not present', () => {
    const sourceCode = 'if ([1,2,3].length > 2) return true';

    assert
      .that(() => removeUnnecessaryIf(sourceCode))
      .raises(new Error(RemoveUnnecessaryConditional.errorMessageForAlternativeBlockNotPresent()));
  });

  test('fails when the code has syntax errors', () => {
    const sourceCode = 'if (true))) return true';

    assert
      .that(() => removeUnnecessaryIf(sourceCode))
      .raises(/the code has syntax errors/);
  });
});

'use strict';

const acorn = require('acorn');

const TARGET_ECMA_VERSION = 11;

class Refactoring {
  static errorMessageForSyntaxError(parseError) {
    return `the code has syntax errors: ${parseError.message}`;
  }

  constructor(sourceCode) {
    this._sourceCode = sourceCode;
    this._ast = this._generateAST();
  }

  apply() {
    throw new Error('subclass responsibility');
  }

  parserOptions() {
    return {};
  }

  evaluatePreconditions(preconditions, errorMessage) {
    preconditions.forEach(precondition =>
      this.evaluatePrecondition(precondition, errorMessage));
  }

  evaluatePrecondition(precondition, errorMessage) {
    if (!precondition.call()) {
      this.signalRefactoringError(errorMessage.call());
    }
  }

  signalRefactoringError(message) {
    throw new Error(message);
  }

  parseNodeMustBePresent(parseNode) {
    return parseNode !== null;
  }

  parseNodeTypeShouldMatch(parseNode, expectedType) {
    return parseNode.type === expectedType;
  }

  _generateAST() {
    try {
      return acorn.parse(
        this._sourceCode,
        { ...this.parserOptions(), ecmaVersion: TARGET_ECMA_VERSION },
      );
    } catch (parseError) {
      this.signalRefactoringError(Refactoring.errorMessageForSyntaxError(parseError));
    }
  }

  _sourceCodeAt(range) {
    return this._sourceCode.slice(range.start, range.end);
  }
}

module.exports = Refactoring;

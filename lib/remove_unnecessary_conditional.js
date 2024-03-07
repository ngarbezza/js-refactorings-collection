'use strict';

import { Refactoring } from './refactoring.js';

export class RemoveUnnecessaryConditional extends Refactoring {
  static errorMessageForInvalidStatementType() {
    return 'the selected code is not an if statement';
  }

  static errorMessageForMultipleStatements() {
    return 'the selected code includes more than one statement';
  }

  static errorMessageForConditionalCannotBeSimplified() {
    return 'the selected code includes an if statement but it cannot be simplified';
  }

  static errorMessageForAlternativeBlockNotPresent() {
    return 'the selected code includes an if statement but it does not have an "else" block';
  }

  constructor(sourceCode) {
    super(sourceCode);
    this._validateThereIsASingleIfStatement();
    this._validateIfStatementCanBeSimplified();
  }

  apply() {
    return `return ${(this._conditionOfIfStatement())}`;
  }

  parserOptions() {
    return { allowReturnOutsideFunction: true };
  }

  _conditionOfIfStatement() {
    return this._sourceCodeAt(this._ifStatement().test);
  }

  _ifStatement() {
    return this._ast.body[0];
  }

  _validateThereIsASingleIfStatement() {
    this.evaluatePrecondition(
      () => this._ast.body.length === 1,
      () => RemoveUnnecessaryConditional.errorMessageForMultipleStatements(),
    );
    this.evaluatePrecondition(
      () => this.parseNodeTypeShouldMatch(this._ifStatement(), 'IfStatement'),
      () => RemoveUnnecessaryConditional.errorMessageForInvalidStatementType(),
    );
  }

  _validateIfStatementCanBeSimplified() {
    this.evaluatePrecondition(
      () => this.parseNodeMustBePresent(this._ifStatement().alternate),
      () => RemoveUnnecessaryConditional.errorMessageForAlternativeBlockNotPresent(),
    );
    this.evaluatePreconditions(
      [
        () => this.parseNodeTypeShouldMatch(this._ifStatement().consequent, 'ReturnStatement'),
        () => this._ifStatement().consequent.argument.value === true,
        () => this.parseNodeTypeShouldMatch(this._ifStatement().alternate, 'ReturnStatement'),
        () => this._ifStatement().alternate.argument.value === false,
      ],
      () => RemoveUnnecessaryConditional.errorMessageForConditionalCannotBeSimplified(),
    );
  }
}

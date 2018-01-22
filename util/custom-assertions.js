var Assertion = require('chai').expect;

Assertion.addMethod('toEqualFoo', function isFoo() {
  new Assertion(this._obj).to.equal('foo');
});
import test from 'node:test';
import assert from 'node:assert/strict';
import { validateIndianPincodeFormat, lookupIndianPincode } from '../src/services/pincodeService.ts';

test('validateIndianPincodeFormat rejects invalid formats', () => {
  // Empty
  assert.equal(validateIndianPincodeFormat('').isValid, false);
  assert.equal(validateIndianPincodeFormat('   ').isValid, false);

  // Starts with 0
  const zeroRes = validateIndianPincodeFormat('012345');
  assert.equal(zeroRes.isValid, false);
  assert.match(zeroRes.error || '', /cannot start with 0/i);

  // Too short
  const shortRes = validateIndianPincodeFormat('56010');
  assert.equal(shortRes.isValid, false);
  assert.match(shortRes.error || '', /6 digits/i);

  // Too long
  const longRes = validateIndianPincodeFormat('5601021');
  assert.equal(longRes.isValid, false);
  assert.match(longRes.error || '', /exceed 6 digits/i);

  // Dummy repeating sequences
  assert.equal(validateIndianPincodeFormat('000000').isValid, false);
  assert.equal(validateIndianPincodeFormat('111111').isValid, false);
  assert.equal(validateIndianPincodeFormat('999999').isValid, false);
});

test('validateIndianPincodeFormat accepts valid Indian PIN code formats', () => {
  assert.equal(validateIndianPincodeFormat('560102').isValid, true);
  assert.equal(validateIndianPincodeFormat('110001').isValid, true);
  assert.equal(validateIndianPincodeFormat('400001').isValid, true);
  assert.equal(validateIndianPincodeFormat('700001').isValid, true);
  assert.equal(validateIndianPincodeFormat('600001').isValid, true);
});

test('lookupIndianPincode resolves valid PIN codes from offline database', async () => {
  // Bangalore HSR / Sobha Classic
  const res1 = await lookupIndianPincode('560102');
  assert.equal(res1.success, true);
  assert.equal(res1.state, 'Karnataka');
  assert.match(res1.city, /Bangalore|Bengaluru/i);

  // New Delhi Connaught Place
  const res2 = await lookupIndianPincode('110001');
  assert.equal(res2.success, true);
  assert.equal(res2.state, 'Delhi');
  assert.match(res2.city, /Delhi/i);

  // Mumbai Fort
  const res3 = await lookupIndianPincode('400001');
  assert.equal(res3.success, true);
  assert.equal(res3.state, 'Maharashtra');
  assert.match(res3.city, /Mumbai/i);
});

test('lookupIndianPincode handles invalid or nonexistent PIN codes gracefully without false positives', async () => {
  // Starts with 0
  const resZero = await lookupIndianPincode('056102');
  assert.equal(resZero.success, false);
  assert.match(resZero.error || '', /cannot start with 0/i);

  // Dummy repeating sequence
  const resDummy = await lookupIndianPincode('999999');
  assert.equal(resDummy.success, false);
  assert.match(resDummy.error || '', /dummy|invalid/i);

  // Non-existent validly-formatted PIN code
  const resUnrecognized = await lookupIndianPincode('987987');
  assert.equal(resUnrecognized.success, false);
  assert.match(resUnrecognized.error || '', /unrecognized/i);

  // Incomplete PIN
  const resShort = await lookupIndianPincode('123');
  assert.equal(resShort.success, false);
});

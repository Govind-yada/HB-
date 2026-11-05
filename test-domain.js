const ALLOWED_DOMAIN = '@hbplus.fit';
const DOMAIN_RESTRICTION_ERROR = 'Access restricted. Please login using your official domain email.';

function validateHbPlusDomain(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  const normalized = email.trim().toLowerCase();
  return normalized.endsWith(ALLOWED_DOMAIN.toLowerCase());
}

async function enforceDomainOrSignOut(user) {
  const email = user ? user.email : '';
  if (!validateHbPlusDomain(email)) {
    throw new Error(DOMAIN_RESTRICTION_ERROR);
  }
  return true;
}

console.log('====================================================');
console.log('HB+ Fit Domain Authorization Security Test Runner');
console.log('Target Whitelist Domain:', ALLOWED_DOMAIN);
console.log('Required Error Text:', `"${DOMAIN_RESTRICTION_ERROR}"`);
console.log('====================================================\n');

const testCases = [
  { email: 'sarah.connor@hbplus.fit', expected: true, desc: 'Official team member' },
  { email: 'ADMIN@HBPLUS.FIT', expected: true, desc: 'Case-insensitive domain' },
  { email: 'athlete.lead+test@hbplus.fit', expected: true, desc: 'Plus-aliased email' },
  { email: 'baduser@gmail.com', expected: false, desc: 'Gmail user (Must be rejected)' },
  { email: 'hacker@yahoo.com', expected: false, desc: 'Yahoo user (Must be rejected)' },
  { email: 'spoof@hbplus.fit.evil.com', expected: false, desc: 'Subdomain spoofing attack (Must be rejected)' },
  { email: 'fakehbplus.fit@outlook.com', expected: false, desc: 'Prefix match spoof (Must be rejected)' },
  { email: 'athlete@hbplus.org', expected: false, desc: 'Alternative TLD .org (Must be rejected)' },
  { email: '', expected: false, desc: 'Empty email (Must be rejected)' },
  { email: null, expected: false, desc: 'Null email (Must be rejected)' },
  { email: undefined, expected: false, desc: 'Undefined email (Must be rejected)' },
];

let passes = 0;
let fails = 0;

for (const tc of testCases) {
  const result = validateHbPlusDomain(tc.email);
  if (result === tc.expected) {
    console.log(`[PASS] ${tc.desc}: "${tc.email}" -> Valid = ${result}`);
    passes++;
  } else {
    console.error(`[FAIL] ${tc.desc}: "${tc.email}" -> Got ${result}, Expected ${tc.expected}`);
    fails++;
  }
}

async function runEnforcementCheck() {
  console.log('\nTesting direct session enforcement error string...');
  try {
    await enforceDomainOrSignOut({ email: 'unauthorized.user@gmail.com' });
    console.error('[FAIL] enforceDomainOrSignOut should have thrown but did not!');
    fails++;
  } catch (err) {
    if (err.message === DOMAIN_RESTRICTION_ERROR) {
      console.log(`[PASS] Exact error matched: "${err.message}"`);
      passes++;
    } else {
      console.error(`[FAIL] Error string mismatch! Got: "${err.message}", Expected: "${DOMAIN_RESTRICTION_ERROR}"`);
      fails++;
    }
  }

  console.log('\n====================================================');
  console.log(`Summary: ${passes} Passed, ${fails} Failed`);
  console.log('====================================================');
  if (fails > 0) {
    process.exit(1);
  } else {
    console.log('ALL SECURITY & DOMAIN SPECIFICATIONS VERIFIED.');
    process.exit(0);
  }
}

runEnforcementCheck();

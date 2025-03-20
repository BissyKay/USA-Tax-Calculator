document.getElementById('taxForm').addEventListener('submit', function (e) {
  e.preventDefault();

  // Get user input
  const income = parseFloat(document.getElementById('income').value);
  const filingStatus = document.getElementById('filingStatus').value;
  const state = document.getElementById('state').value;
  const deductions = parseFloat(document.getElementById('deductions').value) || 0;

  // Validate input
  if (isNaN(income) || income < 0) {
    alert("Please enter a valid income.");
    return;
  }

  // Calculate taxes
  const taxableIncome = income - deductions;
  const federalTax = calculateFederalTax(taxableIncome, filingStatus);
  const stateTax = calculateStateTax(taxableIncome, state);
  const totalTax = federalTax + stateTax;

  // Display result
  document.getElementById('result').innerHTML = `
    <p>Federal Tax: $${federalTax.toFixed(2)}</p>
    <p>State Tax: $${stateTax.toFixed(2)}</p>
    <p>Total Tax: $${totalTax.toFixed(2)}</p>
  `;
});

// Federal Tax Calculation
function calculateFederalTax(income, filingStatus) {
  const brackets = {
    single: [
      { limit: 10275, rate: 0.10 },
      { limit: 41775, rate: 0.12 },
      { limit: 89075, rate: 0.22 },
      { limit: 170050, rate: 0.24 },
      { limit: 215950, rate: 0.32 },
      { limit: 539900, rate: 0.35 },
      { limit: Infinity, rate: 0.37 }
    ],
    marriedJointly: [
      { limit: 20550, rate: 0.10 },
      { limit: 83550, rate: 0.12 },
      { limit: 178150, rate: 0.22 },
      { limit: 340100, rate: 0.24 },
      { limit: 431900, rate: 0.32 },
      { limit: 647850, rate: 0.35 },
      { limit: Infinity, rate: 0.37 }
    ],
    marriedSeparately: [
      { limit: 10275, rate: 0.10 },
      { limit: 41775, rate: 0.12 },
      { limit: 89075, rate: 0.22 },
      { limit: 170050, rate: 0.24 },
      { limit: 215950, rate: 0.32 },
      { limit: 323925, rate: 0.35 },
      { limit: Infinity, rate: 0.37 }
    ],
    headOfHousehold: [
      { limit: 14650, rate: 0.10 },
      { limit: 55900, rate: 0.12 },
      { limit: 89050, rate: 0.22 },
      { limit: 170050, rate: 0.24 },
      { limit: 215950, rate: 0.32 },
      { limit: 539900, rate: 0.35 },
      { limit: Infinity, rate: 0.37 }
    ]
  };

  let tax = 0;
  let remainingIncome = income;
  const bracket = brackets[filingStatus];

  for (let i = 0; i < bracket.length; i++) {
    if (remainingIncome <= 0) break;
    const { limit, rate } = bracket[i];
    const taxableAmount = Math.min(remainingIncome, limit - (bracket[i - 1]?.limit || 0));
    tax += taxableAmount * rate;
    remainingIncome -= taxableAmount;
  }

  return tax;
}

// State Tax Calculation
function calculateStateTax(income, state) {
  const stateTaxRates = {
    CA: 0.0934, // California
    NY: 0.0882, // New York
    TX: 0.00,   // Texas (no state income tax)
    FL: 0.00,   // Florida (no state income tax)
    IL: 0.0495  // Illinois
  };

  return income * (stateTaxRates[state] || 0);
}

document.getElementById('car').addEventListener('change', function() {
    const selectedOption = this.options[this.selectedIndex];
    const carImage = selectedOption.getAttribute('data-image');
    const carImageElement = document.getElementById('car-image');
    carImageElement.src = carImage;
    carImageElement.style.display = 'block';
});

document.getElementById('credit-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const carPrice = parseFloat(document.getElementById('car').value);
    const interest = parseFloat(document.getElementById('interest').value) / 100;
    const periodsInYears = parseInt(document.getElementById('periods').value);
    const downPayment = parseFloat(document.getElementById('down-payment').value) || 0;
    const commission = parseFloat(document.getElementById('commission').value) || 0;
    const vat = parseFloat(document.getElementById('vat').value) / 100 || 0;

    const principal = carPrice - downPayment + commission;
    const monthlyInterest = interest / 12;
    const totalMonths = periodsInYears * 12;
    let monthlyPayment = (principal * monthlyInterest) / (1 - Math.pow(1 + monthlyInterest, -totalMonths));

    if (vat) {
        monthlyPayment *= (1 + vat);
    }

    const amortizationTable = document.getElementById('amortization-table');
    amortizationTable.innerHTML = `
        <thead>
            <tr>
                <th>Mes</th>
                <th>Pago Mensual</th>
                <th>Intereses</th>
                <th>Amortización</th>
                <th>Saldo</th>
            </tr>
        </thead>
        <tbody>
    `;

    let balance = principal;
    for (let month = 1; month <= totalMonths; month++) {
        const interestPayment = balance * monthlyInterest;
        const principalPayment = Math.min(monthlyPayment - interestPayment, balance);
        balance -= principalPayment;

        amortizationTable.innerHTML += `
            <tr>
                <td>${month}</td>
                <td>${monthlyPayment.toFixed(2)}</td>
                <td>${interestPayment.toFixed(2)}</td>
                <td>${principalPayment.toFixed(2)}</td>
                <td>${Math.max(0, balance).toFixed(2)}</td>
            </tr>
        `;

        if (balance <= 0) {
            break;
        }
    }

    amortizationTable.innerHTML += '</tbody>';
});

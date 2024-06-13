document.addEventListener('DOMContentLoaded', function() {
    // 시스템 언어 설정에 따른 기본 화폐 단위 설정
    const userLanguage = navigator.language || navigator.userLanguage;
    let defaultCurrency = 'USD'; // 기본값은 USD로 설정

    if (userLanguage.startsWith('ko')) {
        defaultCurrency = 'KRW';
    } else if (userLanguage.startsWith('ja')) {
        defaultCurrency = 'JPY';
    } else if (userLanguage.startsWith('zh')) {
        defaultCurrency = 'CNY';
    } else if (userLanguage.startsWith('de') || userLanguage.startsWith('fr')) {
        defaultCurrency = 'EUR';
    }

    document.getElementById('currency').value = defaultCurrency;

    document.getElementById('interest-form').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const principal = parseFloat(document.getElementById('principal').value);
        const rate = parseFloat(document.getElementById('rate').value) / 100;
        const years = parseFloat(document.getElementById('years').value);
        const compound = parseInt(document.getElementById('compound').value);
        const currency = document.getElementById('currency').value;

        const finalAmount = principal * Math.pow((1 + rate / compound), compound * years);
        const totalProfit = finalAmount - principal;
        const profitRate = (totalProfit / principal) * 100;
        const averageAnnualProfitRate = profitRate / years;

        document.getElementById('final-amount').textContent = `최종 금액: ${formatCurrency(finalAmount, currency)}`;
        document.getElementById('total-profit').textContent = `최종 수익: ${formatCurrency(totalProfit, currency)}`;
        document.getElementById('profit-rate').textContent = `수익율: ${profitRate.toFixed(2)}%`;
        document.getElementById('average-annual-profit-rate').textContent = `연평균 수익율: ${averageAnnualProfitRate.toFixed(2)}%`;
        
        let amounts = [];
        for (let i = 1; i <= years; i++) {
            let amount = principal * Math.pow((1 + rate / compound), compound * i);
            amounts.push({ year: i, amount: amount });
        }

        const amountsList = document.getElementById('amounts-list');
        amountsList.innerHTML = '';
        amounts.forEach(a => {
            let listItem = document.createElement('li');
            listItem.textContent = `${a.year} 년: ${formatCurrency(a.amount, currency)}`;
            amountsList.appendChild(listItem);
        });

        // 그래프 업데이트
        if (window.myChart) {
            window.myChart.destroy();
        }
        
        const ctx = document.getElementById('chart').getContext('2d');
        window.myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: amounts.map(a => `${a.year} 년`),
                datasets: [{
                    label: '복리 주기별 증감 금액',
                    data: amounts.map(a => a.amount),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value, index, values) {
                                return formatCurrency(value, currency);
                            }
                        }
                    }
                }
            }
        });
    });

    function formatCurrency(value, currency) {
        return value.toLocaleString(undefined, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
});

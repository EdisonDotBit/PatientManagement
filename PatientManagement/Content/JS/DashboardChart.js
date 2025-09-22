(function ($) {
    $(document).ready(function () {

        if (typeof dailyRecords !== "undefined" && dailyRecords.length > 0) {
            const ctxDaily = document.getElementById('dailyChart').getContext('2d');
            new Chart(ctxDaily, {
                type: 'line',
                data: {
                    labels: dailyRecords.map(function (x) { return x.Date; }),
                    datasets: [{
                        label: 'Records',
                        data: dailyRecords.map(function (x) { return x.Count; }),
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 2,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }

        if (typeof drugDistribution !== "undefined" && drugDistribution.length > 0) {
            const ctxDrug = document.getElementById('drugChart').getContext('2d');
            new Chart(ctxDrug, {
                type: 'pie',
                data: {
                    labels: drugDistribution.map(function (x) { return x.Drug; }),
                    datasets: [{
                        data: drugDistribution.map(function (x) { return x.Count; }),
                        backgroundColor: [
                            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }

    });
})(jQuery);

$(document).ready(function () {

    // Helper: parse MVC JSON date
    function parseMvcDate(dateStr) {
        if (!dateStr) return '';
        var timestamp = dateStr.match(/\d+/);
        if (!timestamp) return '';
        var date = new Date(parseInt(timestamp[0]));
        var month = ("0" + (date.getMonth() + 1)).slice(-2);
        var day = ("0" + date.getDate()).slice(-2);
        var year = date.getFullYear();
        return month + '/' + day + '/' + year;
    }

    // Function to refresh table
    function refreshTable(data) {
        var tbody = $('#patientTableBody');
        tbody.empty();
        $.each(data, function (i, item) {
            tbody.append(
                '<tr>' +
                '<td>' + parseMvcDate(item.ModifiedDate) + '</td>' +
                '<td>' + parseFloat(item.Dosage).toFixed(2) + '</td>' +
                '<td>' + item.Drug + '</td>' +
                '<td>' + item.Patient + '</td>' +
                '<td>' +
                '<a href="/Patient/Edit/' + item.ID + '" class="btn btn-sm btn-warning">Edit</a> ' +
                '<a href="#" data-id="' + item.ID + '" class="btn btn-sm btn-danger btn-delete">Delete</a>' +
                '</td>' +
                '</tr>'
            );
        });
    }

    // SEARCH
    $('#btnSearch').click(function () {
        var filters = {
            Date: $('#filterDate').val(),
            Dosage: $('#filterDosage').val(),
            Drug: $('#filterDrug').val(),
            Patient: $('#filterPatient').val()
        };

        $.ajax({
            url: '/Patient/Search',
            type: 'GET',
            data: filters,
            success: function (data) {
                refreshTable(data);
            },
            error: function () {
                alert('Error loading data.');
            }
        });
    });

    // RESET
    $('#btnReset').click(function () {
        $('#filterDate, #filterDosage, #filterDrug, #filterPatient').val('');
        $('#btnSearch').click();
    });

    // Optional: load all on page load
    $('#btnSearch').click();
});

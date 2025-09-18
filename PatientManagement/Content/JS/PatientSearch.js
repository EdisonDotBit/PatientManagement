$(document).ready(function () {
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
            success: refreshTable, // uses function from PatientList.js
            error: function () { Swal.fire('Error', 'Error loading data.', 'error'); }
        });
    });

    // RESET
    $('#btnReset').click(function () {
        $('#filterDate, #filterDosage, #filterDrug, #filterPatient').val('');
        $('#btnSearch').click();
    });

    // Auto-run on load
    $('#btnSearch').click();
});

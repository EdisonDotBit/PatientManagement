$(document).ready(function () {
    // Apply real-time formatting for search Dosage input
    Utils.Validation.formatDosageInput('#filterDosage');

    // SEARCH
    $('#btnSearch').click(function () {
        var filters = {
            Date: $('#filterDate').val(),
            Dosage: Utils.Validation.formatDosageString($('#filterDosage').val()),
            Drug: $('#filterDrug').val().trim(),
            Patient: $('#filterPatient').val().trim()
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

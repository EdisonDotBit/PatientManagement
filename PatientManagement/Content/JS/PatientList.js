var table;

// Parse MVC JSON date
function parseMvcDate(dateStr) {
    if (!dateStr) return '';
    var timestamp = dateStr.match(/\d+/);
    if (!timestamp) return '';
    var date = new Date(parseInt(timestamp[0]));
    return ("0" + (date.getMonth() + 1)).slice(-2) + '/' +
        ("0" + date.getDate()).slice(-2) + '/' +
        date.getFullYear();
}

// Refresh table
function refreshTable(data) {
    table.clear();
    $.each(data, function (i, item) {
        table.row.add([
            parseMvcDate(item.ModifiedDate),
            parseFloat(item.Dosage).toFixed(2),
            item.Drug,
            item.Patient,
            '<a href="/Patient/Edit/' + item.ID + '" class="btn btn-sm btn-warning" title="Edit Record">Edit</a> ' +
            '<button type="button" data-id="' + item.ID + '" class="btn btn-sm btn-danger btn-delete" title="Delete Record">Delete</button>'
        ]);
    });
    table.draw();
    $('[title]').tooltip({ trigger: 'hover' });
}

$(document).ready(function () {
    // Initialize DataTable
    table = $('#patientTable').DataTable({
        paging: true,
        info: true,
        searching: false,
        ordering: true,
        order: [[0, 'desc']],
        columnDefs: [
            { orderable: false, targets: 4 },
            { className: "text-center align-middle", targets: "_all" }
        ],
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
        pageLength: -1
    });

    // Style length menu
    $('.dt-length').css({
        'display': 'flex',
        'align-items': 'center',
        'gap': '8px'
    });

    // Row click highlight
    $('#patientTable tbody').on('click', 'tr', function (e) {
        if ($(e.target).closest('a, button').length > 0) return;
        $('#patientTable tbody tr').removeClass('table-active');
        $(this).addClass('table-active');
    });
});

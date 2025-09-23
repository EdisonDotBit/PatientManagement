var table;

// Convert any string/date to JS Date
function parseDate(dateStr) {
    if (!dateStr) return null;
    var date = new Date(dateStr);
    return isNaN(date) ? null : date;
}

// Format JS Date to MM/DD/YYYY
function formatDate(date) {
    if (!date) return '';
    return ("0" + (date.getMonth() + 1)).slice(-2) + '/' +
        ("0" + date.getDate()).slice(-2) + '/' +
        date.getFullYear();
}

// Refresh table with data
function refreshTable(data) {
    table.clear();
    data.forEach(item => {
        table.row.add([
            item.ModifiedDate, 
            parseFloat(item.Dosage).toFixed(2),
            item.Drug,
            item.Patient,
            `<a href="/Patient/Edit/${item.ID}" class="btn btn-sm btn-warning">Edit</a>
             <button type="button" data-id="${item.ID}" class="btn btn-sm btn-danger btn-delete">Delete</button>`
        ]);
    });
    table.draw();
    $('[title]').tooltip({ trigger: 'hover' });
}

// Apply filters
function filterPatients() {
    const dateFilter = $('#filterDate').val().trim();
    const dosageFilter = $('#filterDosage').val().trim();
    const drugFilter = $('#filterDrug').val().trim();
    const patientFilter = $('#filterPatient').val().trim();

    const filtered = allPatients.filter(p => {
        const dateStr = formatDate(parseDate(p.ModifiedDate));
        return Utils.Validation.matchPartial(dateStr, dateFilter) &&
            Utils.Validation.matchPartial(p.Dosage, dosageFilter) &&
            Utils.Validation.matchPartial(p.Drug, drugFilter) &&
            Utils.Validation.matchPartial(p.Patient, patientFilter);
    });

    refreshTable(filtered);
}

$(document).ready(function () {
    table = $('#patientTable').DataTable({
        paging: true,
        info: true, 
        searching: false,
        ordering: true,        
        order: [[0, 'desc']],   
        pageLength: -1,  
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]], 
        columnDefs: [
            {
                targets: 0, 
                render: function (data, type) {
                    if (type === 'display') return formatDate(parseDate(data));
                    return data; 
                }
            },
            { orderable: false, targets: 4 },
            { className: "text-center align-middle", targets: "_all" }
        ]
    });

    Utils.Validation.formatDosageInput('#filterDosage');
    Utils.Validation.formatDateInput('#filterDate');

    $('#patientTable tbody').on('click', 'tr', function (e) {
        if ($(e.target).closest('a, button').length > 0) return;
        $('#patientTable tbody tr').removeClass('table-active');
        $(this).addClass('table-active');
    });

    $('#filterDate, #filterDosage, #filterDrug, #filterPatient').on('input', filterPatients);

    $('#btnReset').click(function () {
        $('#filterDate, #filterDosage, #filterDrug, #filterPatient').val('');
        filterPatients();
    });

    filterPatients(); // initial load
});
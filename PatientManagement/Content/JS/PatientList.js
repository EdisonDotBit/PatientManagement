let table;

// Parse date string into Date object
function parseDate(dateStr) {
    if (!dateStr) return null;
    let date = new Date(dateStr);
    return isNaN(date) ? null : date;
}

// Helpers for formatting dates as MM/DD/YYYY
function formatDate(date) {
    if (!date) return '';
    return ("0" + (date.getMonth() + 1)).slice(-2) + '/' +
        ("0" + date.getDate()).slice(-2) + '/' +
        date.getFullYear();
}

$(document).ready(function () {
    // Initialize DataTable
    table = $('#patientTable').DataTable({
        data: allPatients,
        paging: false,
        info: false,
        searching: false,
        ordering: false,
        lengthChange: false,
        pageLength: -1,
        autoWidth: false,
        columns: [
            {
                data: null,
                className: "text-center",
                width: "150px",
                render: function (data) {
                    return `
                        <a href="/Patient/Edit/${data.ID}" class="btn btn-sm btn-warning me-1">Edit</a>
                        <button type="button" data-id="${data.ID}" class="btn btn-sm btn-danger btn-delete">Delete</button>
                    `;
                }
            },
            {
                data: "ModifiedDate",
                className: "text-start",
                render: function (data, type) {
                    if (!data) return "";
                    const d = parseDate(data);
                    return type === "display" ? formatDate(d) : d;
                }
            },
            {
                data: "Dosage",
                className: "text-start",
                render: d => parseFloat(d).toFixed(2)
            },
            { data: "Drug", className: "text-start" },
            { data: "Patient", className: "text-start" }
        ]
    });

    // Row click highlight
    $('#patientTable tbody').on('click', 'tr', function (e) {
        if ($(e.target).closest('a, button').length > 0) return;
        $('#patientTable tbody tr').removeClass('table-active');
        $(this).addClass('table-active');
    });

    // Dosage formatting
    Utils.Validation.formatDosageInput('#txtDosage');

    // Initial filter
    filterPatients();
});
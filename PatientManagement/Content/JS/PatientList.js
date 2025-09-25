let table;
function formatDate(date) {
    if (!date) {
        return '';
    }
    return ("0" + (date.getMonth() + 1)).slice(-2) + '/' +
        ("0" + date.getDate()).slice(-2) + '/' +
        date.getFullYear();
}
function parseDate(dateStr) {
    if (!dateStr) {
        return null;
    }
    let date = new Date(dateStr);
    if (isNaN(date)) {
        return null;
    } else {
        return date;
    }
}

$(document).ready(function () {
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
                    if (type === "display") {
                        return formatDate(parseDate(data));
                    } else {
                        return new Date(data);
                    }
                }
            },
            { data: "Dosage", className: "text-start", render: d => parseFloat(d).toFixed(2) },
            { data: "Drug", className: "text-start" },
            { data: "Patient", className: "text-start" }
        ]
    });

    // Row highlighting
    $('#patientTable tbody').on('click', 'tr', function (e) {
        if ($(e.target).closest('a, button').length > 0) {
            return;
        } else {
            $('#patientTable tbody tr').removeClass('table-active');
            $(this).addClass('table-active');
        }
    });

    // Input formatting
    Utils.Validation.formatDosageInput('#txtDosage');
    Utils.Validation.formatDateInput('#txtDate');
});
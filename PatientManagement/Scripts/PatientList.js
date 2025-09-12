$(document).ready(function () {
    var table = $('#patientTable').DataTable({
        paging: true, info: true, searching: false, ordering: true,
        columnDefs: [{ "orderable": false, "targets": 4 }],
        createdRow: function (row) {
            $(row).find('td').addClass('text-center align-middle');
        }
    });

    $('#patientTable thead th').addClass('text-center align-middle');


    $('.dt-length').css({
        'display': 'flex',
        'align-items': 'center',
        'gap': '8px'
    });

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
            success: refreshTable,
            error: function () { Swal.fire('Error', 'Error loading data.', 'error'); }
        });
    });

    $('#btnReset').click(function () {
        $('#filterDate, #filterDosage, #filterDrug, #filterPatient').val('');
        $('#btnSearch').click();
    });

    $('#btnSearch').click();

    // DELETE with SweetAlert2 confirmation
    $(document).on('click', '.btn-delete', function () {
        var id = $(this).data('id');

        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to delete this record?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, delete it!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: '/Patient/Delete',
                    type: 'POST',
                    data: { ID: id },
                    success: function (response) {
                        if (response.success) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Deleted!',
                                text: response.message,
                                timer: 1500,
                                showConfirmButton: false
                            }).then(() => { $('#btnSearch').click(); });
                        } else {
                            Swal.fire('Error', response.message, 'error');
                        }
                    },
                    error: function () { Swal.fire('Error', 'Error deleting record.', 'error'); }
                });
            }
        });
    });
});

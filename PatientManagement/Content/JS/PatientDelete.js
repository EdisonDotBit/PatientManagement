$(document).ready(function () {
    // DELETE with confirmation
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
            reverseButtons: false
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: '/Patient/Delete',
                    type: 'POST',
                    data: { ID: id },
                    success: function (response) {
                        if (response.success) {
                            Utils.Notification.showToast(response.message, 'success');
                            setTimeout(() => { window.location.reload(); }, 1500);
                        } else {
                            Utils.Notification.showToast(response.message, 'error');
                        }
                    },
                    error: function () {
                        Utils.Notification.showToast('Error deleting record.', 'error');
                    }
                });
            }
        });
    });
});
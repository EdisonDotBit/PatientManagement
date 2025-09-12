$(document).ready(function () {
    // Form Validation Setup
    $("#editForm").validate({
        rules: {
            Patient: { required: true, maxlength: 50, alphaName: true },
            Drug: { required: true, maxlength: 50, alphanumericName: true },
            Dosage: { required: true, number: true, min: 0.0001 }
        },
        messages: {
            Patient: { required: "Patient name is required.", maxlength: "Max 50 characters.", alphaName: "Accepts letters, spaces, hyphen, apostrophe (no leading/ending spaces, but hyphen/apostrophe allowed at end)." },
            Drug: { required: "Drug name is required.", maxlength: "Max 50 characters.", alphanumericName: "Accepts letters, numbers, and spaces only. Cannot start or end with spaces." },
            Dosage: { required: "Dosage is required.", number: "Enter a valid number.", min: "Must be greater than 0." }
        },
        errorClass: "text-danger",
        highlight: function (element) { $(element).addClass("is-invalid"); },
        unhighlight: function (element) { $(element).removeClass("is-invalid"); },
        errorPlacement: function (error, element) { element.siblings(".error-placeholder").html(error); }
    });

    // Only letters, spaces, hyphen, apostrophe (no leading/trailing spaces, but hyphen/apostrophe allowed at end)
    $.validator.addMethod("alphaName", function (value, element) {
        return this.optional(element) || /^[A-Za-z](?:[A-Za-z\s'-]*[A-Za-z'-])?$/.test(value);
    });

    // Letters, numbers, spaces only (not starting/ending with space)
    $.validator.addMethod("alphanumericName", function (value, element) {
        return this.optional(element) || /^[A-Za-z0-9](?:[A-Za-z0-9\s]*[A-Za-z0-9])?$/.test(value);
    });

    // UPDATE using SweetAlert2
    $("#btnUpdate").click(function () {
        if ($("#editForm").valid()) {
            Swal.fire({
                title: 'Are you sure?',
                text: "Do you want to update this patient record?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes, Update',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        url: editPatientUrl,
                        type: 'POST',
                        data: $("#editForm").serialize(),
                        success: function (response) {
                            if (response.success) {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Updated!',
                                    text: response.message,
                                    timer: 1500,
                                    showConfirmButton: false
                                }).then(() => {
                                    window.location.href = indexPatientUrl;
                                });
                            } else {
                                $("#validationSummary").html(response.message);
                                Swal.fire('Error', response.message, 'error');
                            }
                        },
                        error: function () {
                            Swal.fire('Error', 'An unexpected error occurred.', 'error');
                        }
                    });
                }
            });
        }
    });

    // Clear All Button
    $("#btnClear").click(function () {
        // Manually clear form values
        $("#editForm").find("input[type=text], input[type=number], textarea").val("");
        $("#editForm").find("select").prop("selectedIndex", 0);

        // Reset validation
        $("#editForm").validate().resetForm();
        $("#editForm").find(".is-invalid").removeClass("is-invalid");
        $(".error-placeholder").html("");
        $("#validationSummary").html("");

        // Put cursor on the first input
        $("#Patient").focus();
    });

});

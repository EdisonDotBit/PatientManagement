$(document).ready(function () {
    // Form Validation Setup
    $("#patientForm").validate({
        rules: {
            Patient: { required: true, maxlength: 50, alphaName: true },
            Drug: { required: true, maxlength: 50, alphanumericName: true },
            Dosage: { required: true, number: true, min: 0.0001 }
        },
        messages: {
            Patient: { required: "Patient name is required.", maxlength: "Max 50 characters.", alphaName: "Accepts letters, spaces, hyphen, apostrophe (no leading/ending spaces, but hyphen/apostrophe allowed at end)."  },
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

    // Save Button: SweetAlert2 Confirmation
    $("#btnSave").click(function () {
        if ($("#patientForm").valid()) {
            Swal.fire({
                title: 'Are you sure?',
                text: "Do you want to save this patient record?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes, Save',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    // AJAX Submit
                    $.ajax({
                        url: createPatientUrl,
                        type: 'POST',
                        data: $("#patientForm").serialize(),
                        success: function (response) {
                            if (response.success) {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Saved!',
                                    text: response.message,
                                    timer: 1500,
                                    showConfirmButton: false
                                }).then(() => {
                                    window.location.href = indexPatientUrl;
                                });
                            } else {
                                $("#validationSummary").html(response.message);
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    text: response.message
                                });
                            }
                        },
                        error: function () {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops!',
                                text: 'An unexpected error occurred.'
                            });
                        }
                    });
                }
            });
        }
    });

    // Clear All Button
    $("#btnClear").click(function () {
        $("#patientForm")[0].reset();
        $("#patientForm").validate().resetForm();
        $("#patientForm").find(".is-invalid").removeClass("is-invalid");
        $(".error-placeholder").html("");
        $("#validationSummary").html("");

        // Put cursor on the first input
        $("#Patient").focus();
    });
});

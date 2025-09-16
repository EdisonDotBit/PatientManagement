$(document).ready(function () {
    // Custom validation methods
    $.validator.addMethod("alphaName", function (value, element) {
        return this.optional(element) || /^[A-Za-z](?:[A-Za-z\s'-]*[A-Za-z'-])?$/.test(value);
    });
    $.validator.addMethod("alphanumericName", function (value, element) {
        return this.optional(element) || /^[A-Za-z0-9](?:[A-Za-z0-9\s]*[A-Za-z0-9])?$/.test(value);
    });
    $.validator.addMethod("decimal4", function (value, element) {
        return this.optional(element) || /^\d+(\.\d{1,4})?$/.test(value);
    }, "Up to 4 decimal places only.");
    // Form Validation Setup
    $("#editForm").validate({
        rules: {
            Patient: { required: true, maxlength: 50, alphaName: true },
            Drug: { required: true, maxlength: 50, alphanumericName: true },
            Dosage: { required: true, number: true, min: 0.0001, decimal4: true }
        },
        messages: {
            Patient: { required: "Patient name is required.", maxlength: "Max 50 characters.", alphaName: "Accepts letters, spaces, hyphen, apostrophe (no leading/ending spaces, but hyphen/apostrophe allowed at end)." },
            Drug: { required: "Drug name is required.", maxlength: "Max 50 characters.", alphanumericName: "Accepts letters, numbers, and spaces only. Cannot start or end with spaces." },
            Dosage: { required: "Dosage is required.", number: "Enter a valid number.", min: "Must be greater than 0.", decimal4: "Up to 4 decimal places only." }
        },
        errorClass: "text-danger",
        highlight: function (element) { $(element).addClass("is-invalid"); },
        unhighlight: function (element) { $(element).removeClass("is-invalid"); },
        errorPlacement: function (error, element) { element.siblings(".error-placeholder").html(error); }
    });
    // Clear summary on input
    $("#Drug").on("input", function () {
        $("#validationSummary").html("");
    });
    // UPDATE Button
    $("#btnUpdate").click(function () {
        if (!$("#editForm").valid()) return;
        // Step 0: Check for changes
        $.post(checkHasChangesUrl, $("#editForm").serialize())
            .done(function (changeResponse) {
                if (!changeResponse.success) {
                    Swal.fire({ icon: 'info', title: 'No changes', text: changeResponse.message });
                    return;
                }
                // Step 1: Check for duplicate
                $.post(checkUpdateDuplicateUrl, $("#editForm").serialize())
                    .done(function (dupResponse) {
                        if (dupResponse.isDuplicate) {
                            $("#validationSummary").html(dupResponse.message);
                            Swal.fire({ icon: 'error', title: 'Duplicate Found', text: dupResponse.message });
                            return;
                        }
                        // Step 2: Confirm update
                        Swal.fire({
                            title: 'Are you sure?',
                            text: "Do you want to update this patient record?",
                            icon: 'question',
                            showCancelButton: true,
                            confirmButtonText: 'Yes, Update',
                            cancelButtonText: 'Cancel'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                $.post(editPatientUrl, $("#editForm").serialize())
                                    .done(function (response) {
                                        if (response.success) {
                                            Swal.fire({
                                                icon: 'success',
                                                title: 'Updated!',
                                                text: response.message,
                                                timer: 1500,
                                                showConfirmButton: false
                                            }).then(() => { window.location.href = indexPatientUrl; });
                                        } else {
                                            $("#validationSummary").html(response.message);
                                            Swal.fire('Error', response.message, 'error');
                                        }
                                    })
                                    .fail(function () {
                                        Swal.fire('Error', 'An unexpected error occurred.', 'error');
                                    });
                            }
                        });
                    })
                    .fail(function () {
                        Swal.fire('Error', 'Error checking duplicates.', 'error');
                    });
            })
            .fail(function () {
                Swal.fire('Error', 'Error checking changes.', 'error');
            });
    });
    // Clear All Button
    $("#btnClear").click(function () {
        $("#editForm").find("input[type=text], input[type=number], textarea").val("");
        $("#editForm").find("select").prop("selectedIndex", 0);
        $("#editForm").validate().resetForm();
        $("#editForm").find(".is-invalid").removeClass("is-invalid");
        $(".error-placeholder").html("");
        $("#validationSummary").html("");
        $("#Patient").focus();
    });
});

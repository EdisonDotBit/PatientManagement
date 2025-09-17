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
    // Form validation
    var form = $("#patientForm");
    form.validate({
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
    // Save button click
    $("#btnSave").click(function () {
        $("#validationSummary").html("");
        if (!form.validate().form()) return;
        // Step 1: Check for duplicates via AJAX
        $.ajax({
            url: checkDuplicateUrl,
            type: 'POST',
            data: form.serialize(),
            success: function (dupResponse) {
                if (dupResponse.isDuplicate) {
                    $("#validationSummary").html(dupResponse.message);
                    Swal.fire({ icon: 'error', title: 'Duplicate Found', text: dupResponse.message });
                    return;
                }
                // Step 2: Confirm save
                Swal.fire({
                    title: 'Are you sure?',
                    text: "Do you want to save this patient record?",
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, Save',
                    cancelButtonText: 'Cancel'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Step 3: Save via AJAX
                        $.ajax({
                            url: createPatientUrl,
                            type: 'POST',
                            data: form.serialize(),
                            success: function (saveResponse) {
                                if (saveResponse.success) {
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Saved!',
                                        text: saveResponse.message,
                                        timer: 1500,
                                        showConfirmButton: false
                                    }).then(() => { window.location.href = indexPatientUrl; });
                                } else {
                                    $("#validationSummary").html(saveResponse.message);
                                    Swal.fire({ icon: 'error', title: 'Error', text: saveResponse.message });
                                }
                            },
                            error: function () {
                                Swal.fire({ icon: 'error', title: 'Oops!', text: 'Unexpected error occurred.' });
                            }
                        });
                    }
                });
            },
            error: function () {
                Swal.fire({ icon: 'error', title: 'Oops!', text: 'Error checking duplicates.' });
            }
        });
    });
    // Clear button
    $("#btnClear").click(function () {
        form[0].reset();
        form.validate().resetForm();
        form.find(".is-invalid").removeClass("is-invalid");
        $(".error-placeholder").html("");
        $("#validationSummary").html("");
        $("#Patient").focus();
    });
});

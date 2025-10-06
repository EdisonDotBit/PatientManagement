$(document).ready(function () {
    const form = $("#patientForm");

    // Validation helpers
    Utils.Validation.addCustomMethods();
    Utils.Validation.formatDosageInput('#txtDosage');

    // Collapse spaces on blur
    $('input[type="text"], textarea').on('blur', function () {
        Utils.Validation.normalizeTextInput(this);
    });

    // Initialize form validation
    form.validate({
        rules: Utils.Validation.config.rules,
        messages: Utils.Validation.config.messages,
        errorClass: "text-danger",
        highlight: function (element) {
            $(element).addClass("is-invalid");
        },
        unhighlight: function (element) {
            if ($(element).siblings(".error-placeholder").text().trim() === "") {
                $(element).removeClass("is-invalid");
                $(element).removeClass("ajax-duplicate-error");
            }
        },
        errorPlacement: function (error, element) {
            element.siblings(".error-placeholder").html(error);
        },
        onfocusout: function (element) {
            if (!$(element).hasClass("ajax-duplicate-error")) {
                this.element(element);
            }
        }
    });

    // Save Button
    $("#btnSave").click(function () {

        // Validate all inputs 
        const isFormValid = form.valid();

        // Check required fields manually
        const hasEmpty = form.find(":input[required]").toArray()
            .some(el => $(el).val().trim() === "");

        if (!isFormValid || hasEmpty) {
            if (hasEmpty) {
                Utils.Notification.showToast("All field/s are required.", "error");
            }
            return;
        }

        // Step 1: Check for duplicate
        $.ajax({
            url: checkDuplicateUrl,
            type: 'POST',
            data: form.serialize(),
            success: function (dupResponse) { 
                if (dupResponse.isDuplicate) {
                    Utils.Notification.showToast(dupResponse.message, 'error');
                    Utils.Notification.showDuplicateErrors(form, dupResponse.fields);
                    return;
                }
                Swal.fire({
                    title: 'Add Record',
                    text: 'Are you sure you want to add this record?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, Save',
                    cancelButtonText: 'Cancel'
                }).then((result) => {
                    if (!result.isConfirmed) return;

                    // Step 2: Create new record
                    $.ajax({
                        url: createPatientUrl,
                        type: 'POST',
                        data: form.serialize(),
                        success: function (saveResponse) {
                            if (saveResponse.success) {
                                Utils.Notification.showToast(saveResponse.message, 'success');
                                setTimeout(() => window.location.href = indexPatientUrl, 1500);
                            } else {
                                if (saveResponse.errors) {
                                    // Server-side validation errors (dictionary)
                                    $.each(saveResponse.errors, function (fieldName, messages) {
                                        const input = $("[name='" + fieldName + "']");
                                        input.addClass("is-invalid");
                                        input.siblings(".error-placeholder").html(messages.join("<br/>"));
                                    });
                                    Utils.Notification.showToast("Please fix the highlighted errors.", "error");
                                } else {
                                    // Generic error
                                    Utils.Notification.showToast(saveResponse.message, 'error');
                                }
                            }
                        },
                        error: function () {
                            Utils.Notification.showToast('Unexpected error occurred.', 'error');
                        }
                    });
                });
            },
            error: function () {
                Utils.Notification.showToast('Error checking duplicates.', 'error');
            }
        });
    });

    // Remove AJAX error if user changes input
    $('input, textarea').on('input', function () {
        if ($(this).hasClass("ajax-duplicate-error")) {
            $(this).removeClass("ajax-duplicate-error");
            $(this).removeClass("is-invalid");
            $(this).siblings(".error-placeholder").html("");
        }
    });

    // Clear All Button
    $("#btnClear").click(function () {
        $("#txtDosage").val("");
        $("#txtDrug").val("");
        $("#txtPatient").val("");

        form.find("select").prop("selectedIndex", 0);
        form.validate().resetForm();
        form.find(".is-invalid").removeClass("is-invalid ajax-duplicate-error");
        form.find(".error-placeholder").html("");

        $("#txtDosage").focus();
    });
});
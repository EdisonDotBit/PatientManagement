$(document).ready(function () {
    var form = $("#editForm");

    // Add custom validation methods
    Utils.Validation.addCustomMethods();

    // Collapse spaces on blur
    $('input[type="text"], textarea').on('blur', function () {
        Utils.Validation.normalizeTextInput(this);
    });

    // Format dosage input
    Utils.Validation.formatDosageInput('#Dosage');

    // Initialize form validation
    form.validate({
        rules: Utils.Validation.config.rules,
        messages: Utils.Validation.config.messages,
        errorClass: "text-danger",
        highlight: function (element) {
            $(element).addClass("is-invalid");
        },
        unhighlight: function (element) {
            $(element).removeClass("is-invalid");
        },
        errorPlacement: function (error, element) {
            element.siblings(".error-placeholder").html(error);
        }
    });

    // UPDATE Button
    $("#btnUpdate").click(function () {
        // Normalize text inputs before validation
        form.find('input[type="text"], textarea').each(function () {
            Utils.Validation.normalizeTextInput(this);
        });

        // Trigger validation to show inline errors
        form.valid();

        // Check if any required field is empty
        var hasEmpty = false;
        form.find(':input[required]').each(function () {
            if ($(this).val().trim() === "") {
                hasEmpty = true;
                return false; // break loop
            }
        });

        if (hasEmpty) {
            Utils.Notification.showToast("All field/s are required.", "error");
        }

        // Stop update if form is invalid
        if (!form.valid()) return;

        // Step 1: Check if there are changes
        $.ajax({
            url: checkHasChangesUrl,
            type: 'POST',
            data: form.serialize(),
            success: function (changeResponse) {
                if (!changeResponse.success) {
                    Utils.Notification.showToast(changeResponse.message, 'info');
                    return;
                }

                // Step 2: Check for duplicate
                $.ajax({
                    url: checkUpdateDuplicateUrl,
                    type: 'POST',
                    data: form.serialize(),
                    success: function (dupResponse) {
                        if (dupResponse.isDuplicate) {
                            Utils.Notification.showToast(dupResponse.message, 'error');
                            return;
                        }

                        // Step 3: Confirm update
                        Swal.fire({
                            title: 'Update Record',
                            text: 'Are you sure you want to update this record?',
                            icon: 'question',
                            showCancelButton: true,
                            confirmButtonText: 'Yes, Update',
                            cancelButtonText: 'Cancel'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                // Step 4: Save update via AJAX
                                $.ajax({
                                    url: editPatientUrl,
                                    type: 'POST',
                                    data: form.serialize(),
                                    success: function (response) {
                                        if (response.success) {
                                            Utils.Notification.showToast(response.message, 'success');
                                            setTimeout(() => {
                                                window.location.href = indexPatientUrl;
                                            }, 1500);
                                        } else {
                                            Utils.Notification.showToast(response.message, 'error');
                                        }
                                    },
                                    error: function () {
                                        Utils.Notification.showToast('An unexpected error occurred.', 'error');
                                    }
                                });
                            }
                        });
                    },
                    error: function () {
                        Utils.Notification.showToast('Error checking duplicates.', 'error');
                    }
                });
            },
            error: function () {
                Utils.Notification.showToast('Error checking changes.', 'error');
            }
        });
    });

    // Clear All Button
    $("#btnClear").click(function () {
        form.find("input[type=text], input[type=number], textarea").val("");
        form.find("select").prop("selectedIndex", 0);
        form.validate().resetForm();
        form.find(".is-invalid").removeClass("is-invalid");
        form.find(".error-placeholder").html("");
        $("#Patient").focus();
    });
});
$(document).ready(function () {
    var form = $("#editForm");
    // Add custom validation methods
    Utils.Validation.addCustomMethods();
    // Collapse spaces on blur
    $('input[type="text"], textarea').on('blur', function () {
        Utils.Validation.normalizeTextInput(this);
    });
    // Add format dosage input method
    $(document).ready(function () {
        var form = $("#patientForm");
        Utils.Validation.addCustomMethods();
        Utils.Validation.formatDosageInput('#Dosage'); 
    });
    // Form Validation
    form.validate({
        rules: Utils.Validation.config.rules,
        messages: Utils.Validation.config.messages,
        errorClass: "text-danger",
        highlight: function (element) { $(element).addClass("is-invalid"); },
        unhighlight: function (element) { $(element).removeClass("is-invalid"); },
        errorPlacement: function (error, element) { element.siblings(".error-placeholder").html(error); },
    });
    // UPDATE Button
    $("#btnUpdate").click(function () {
        form.find('input[type="text"], textarea').each(function () {
            Utils.Validation.normalizeTextInput(this);
        });
        // Step 0: Check if all required fields are empty
        var allRequiredEmpty = true;
        form.find(':input[required]').each(function () {
            if ($(this).val().trim() !== "") {
                allRequiredEmpty = false;
                return false;
            }
        });
        if (allRequiredEmpty) {
            Utils.Notification.showToast("All field/s are required.", "error");
        }
        // Step 1: Run validation to trigger per-field errors
        if (!form.valid()) return;

        // Step 1: Check for changes
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
                                    data: form.serialize(),
                                    success: function (response) {
                                        if (response.success) {
                                            Utils.Notification.showToast(response.message, 'success');
                                            setTimeout(() => { window.location.href = indexPatientUrl; }, 1500);
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
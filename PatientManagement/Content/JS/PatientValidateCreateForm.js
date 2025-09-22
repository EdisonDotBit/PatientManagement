$(document).ready(function () {
    var form = $("#patientForm");
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
    // Form validation
    form.validate({
        rules: Utils.Validation.config.rules,
        messages: Utils.Validation.config.messages,
        errorClass: "text-danger",
        highlight: function (element) { $(element).addClass("is-invalid"); },
        unhighlight: function (element) { $(element).removeClass("is-invalid"); },
        errorPlacement: function (error, element) { element.siblings(".error-placeholder").html(error); },
    });
    // Save Button
    $("#btnSave").click(function () {
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
        if (!form.valid()) return;
        // Step 1: Check for duplicates via AJAX
        $.ajax({
            url: checkDuplicateUrl,
            type: 'POST',
            data: form.serialize(),
            success: function (dupResponse) {
                if (dupResponse.isDuplicate) {
                    Utils.Notification.showToast(dupResponse.message, 'error');
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
                                    Utils.Notification.showToast(saveResponse.message, 'success');
                                    setTimeout(function () { window.location.href = indexPatientUrl; }, 1500);
                                } else {
                                    Utils.Notification.showToast(saveResponse.message, 'error');
                                }
                            },
                            error: function () {
                                Utils.Notification.showToast('Unexpected error occurred.', 'error');
                            }
                        });
                    }
                });
            },
            error: function () {
                Utils.Notification.showToast('Error checking duplicates.', 'error');
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
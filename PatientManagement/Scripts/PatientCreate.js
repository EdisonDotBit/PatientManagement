$(document).ready(function () {

    var validator = $('#patientForm').validate({
        errorElement: 'span',
        errorClass: 'text-danger',
        onfocusout: false,
        onkeyup: false,
        onclick: false,
        rules: {
            Patient: { required: true, maxlength: 50 },
            Drug: { required: true, maxlength: 50 },
            Dosage: { required: true, number: true, min: 0.01 },
        },
        messages: {
            Patient: { required: "Patient is required." },
            Drug: { required: "Drug is required." },
            Dosage: {
                required: "Dosage is required.",
                number: "Must be numeric.",
                min: "Dosage must be greater than 0."
            },
        },
        errorPlacement: function (error, element) {
            error.insertAfter(element);
        }
    });

    $('#btnSave').click(function () {
        if ($('#patientForm').valid()) {
            $.ajax({
                url: '/Patient/Create',
                type: 'POST',
                data: $('#patientForm').serialize(),
                dataType: 'json',
                success: function (res) {
                    $('#message').removeClass('d-none alert-success alert-danger');
                    if (res.success) {
                        $('#message').addClass('alert-success').text(res.message);
                        $('#patientForm')[0].reset();
                    } else {
                        $('#message').addClass('alert-danger').text(res.message);
                    }
                },
                error: function (xhr) {
                    $('#message').removeClass('d-none').addClass('alert-danger').text("Unexpected server error.");
                }
            });
        }
        return false;
    });

    // Clear button
    $('#btnClear').click(function () {
        $('#patientForm')[0].reset();
        $('#message').addClass('d-none').text('');
        $('#Patient').focus();
    });

});

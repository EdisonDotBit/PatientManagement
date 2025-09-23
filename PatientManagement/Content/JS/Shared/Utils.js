var Utils = Utils || {};

// Validation Utilities
Utils.Validation = {
    config: {
        rules: {
            Patient: { required: true, maxlength: 50, alphaName: true },
            Drug: { required: true, maxlength: 50, alphanumericName: true },
            Dosage: { required: true, number: true, min: 0.0001, max: 999.9999, decimal4: true }
        },
        messages: {
            Patient: {
                required: "Patient name is required.",
                maxlength: "Max 50 characters.",
                alphaName: "Accepts letters, spaces, hyphen, apostrophe only."
            },
            Drug: {
                required: "Drug name is required.",
                maxlength: "Max 50 characters.",
                alphanumericName: "Accepts letters, numbers, and spaces only."
            },
            Dosage: {
                required: "Dosage is required.",
                number: "Enter a valid number.",
                min: "Must be greater than 0.",
                max: "Must not exceed 999.9999.",
                decimal4: "Up to 4 decimal places only."
            }
        }
    },

    // Input Formatting
    formatDosageInput: function (selector) {
        $(selector).on('input', function () {
            var value = $(this).val();
            value = value.replace(/[^0-9.]/g, '');
            var firstDotIndex = value.indexOf('.');

            if (firstDotIndex !== -1) {
                var beforeDot = value.slice(0, firstDotIndex);
                var afterDot = value.slice(firstDotIndex + 1).replace(/\./g, '');
                value = beforeDot + '.' + afterDot;
            }

            var parts = value.split('.');
            var intPart = parts[0] || '';
            var decPart = parts[1] || '';

            intPart = intPart.replace(/^0+(?=\d)/, '');
            if (intPart.length > 3) intPart = intPart.substring(0, 3);
            if (decPart.length > 4) decPart = decPart.substring(0, 4);

            $(this).val(value.includes('.') ? intPart + '.' + decPart : intPart);
        });
    },

    formatDosageString: function (value) {
        if (!value) return '';
        value = value.replace(/[^0-9.]/g, '');
        var firstDotIndex = value.indexOf('.');
        if (firstDotIndex !== -1) {
            var beforeDot = value.slice(0, firstDotIndex);
            var afterDot = value.slice(firstDotIndex + 1).replace(/\./g, '');
            value = beforeDot + '.' + afterDot;
        }

        var parts = value.split('.');
        var intPart = parts[0] || '';
        var decPart = parts[1] || '';
        intPart = intPart.replace(/^0+(?=\d)/, '');

        if (intPart.length > 3) intPart = intPart.substring(0, 3);
        if (decPart.length > 4) decPart = decPart.substring(0, 4);

        return value.includes('.') ? intPart + '.' + decPart : intPart;
    },

    formatDateInput: function (selector) {
        $(selector).on('input', function () {
            var value = $(this).val();

            value = value.replace(/[^0-9/]/g, '');
            value = value.replace(/\/{2,}/g, '/');

            if (value.length > 10) {
                value = value.substring(0, 10);
            }

            $(this).val(value);
        });
    },

    normalizeTextInput: function (el) {
        var cleanVal = $(el).val().replace(/\s+/g, " ").trim();
        $(el).val(cleanVal);
    },

    // Matching Router
    matchPartial: function (value, filter) {
        if (!filter) return true;
        if (value === null || value === undefined) return false;

        let vStr = value.toString().trim();
        let fStr = filter.toString().trim();

        if (!isNaN(vStr) && !isNaN(fStr.replace(/\.$/, ""))) {
            return Utils.Validation.matchDosage(vStr, fStr);
        }

        if (fStr.includes("/")) {
            return Utils.Validation.matchDate(vStr, fStr);
        }

        return Utils.Validation.matchText(vStr, fStr);
    },

    // Specialized Matchers
    matchDate: function (value, filter) {
        if (!value || !filter) return false;

        let vNorm = value.replace(/\b0(\d)/g, "$1");
        let fNorm = filter.replace(/\b0(\d)/g, "$1");

        if (vNorm.includes(filter) || vNorm.includes(fNorm)) return true;

        let [mm, dd, yyyy] = value.split("/");
        if (!mm || !dd || !yyyy) return false;

        if (/^\d{4}$/.test(fNorm)) {
            return yyyy === fNorm;
        }

        if (/^\d{1,2}\/\d{4}$/.test(fNorm)) {
            let [fMonth, fYear] = fNorm.split("/");
            fMonth = fMonth.padStart(2, "0");
            return yyyy === fYear && mm === fMonth;
        }

        if (/^\d{1,2}\/\d{4}$/.test(fNorm)) {
            let [fDay, fYear] = fNorm.split("/");
            fDay = fDay.padStart(2, "0");
            return yyyy === fYear && dd === fDay;
        }

        return false;
    },

    matchDosage: function (value, filter) {
        if (!filter) return true;
        if (value === null || value === undefined) return false;

        let vStr = parseFloat(value).toFixed(4); 
        let fStr = filter.toString().trim();

        return vStr.includes(fStr);
    },

    matchText: function (value, filter) {
        let vNorm = value.toLowerCase().replace(/\s+/g, '');
        let fNorm = filter.toLowerCase().replace(/\s+/g, '');
        return vNorm.includes(fNorm);
    },

    // Validate Custom Rules
    addCustomMethods: function () {
        $.validator.addMethod("alphaName", function (value, element) {
            return this.optional(element) || /^[A-Za-z\s'-]+$/.test(value);
        }, "Accepts letters, spaces, hyphen, apostrophe only.");

        $.validator.addMethod("alphanumericName", function (value, element) {
            return this.optional(element) || /^[A-Za-z0-9\s]+$/.test(value);
        }, "Accepts letters, numbers, and spaces only.");

        $.validator.addMethod("decimal4", function (value, element) {
            return this.optional(element) || /^\d+(\.\d{1,4})?$/.test(value);
        }, "Up to 4 decimal places only.");
    }
};

// Notification Utilities
Utils.Notification = {
    showToast: function (message, type = 'error') {
        const toastColors = {
            success: '#28a745',
            error: '#dc3545',
            info: '#17a2b8',
            warning: '#ffc107'
        };
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: type,
            title: message,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: toastColors[type],
            color: '#FFFFFF',
            iconColor: '#FFFFFF',
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        });
    }
};
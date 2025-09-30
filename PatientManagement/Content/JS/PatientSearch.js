// Text matching (case-insensitive, ignores spaces)
function matchText(value, filter) {
    if (!filter) return true;
    if (value === null || value === undefined) return false;
    const v = value.toString().toLowerCase().replace(/\s+/g, '');
    const f = filter.toString().toLowerCase().replace(/\s+/g, '');
    return v.includes(f);
}

// Numeric dosage match
function matchDosage(value, filter) {
    if (!filter) return true;
    const v = parseFloat(value).toFixed(4);
    return v.includes(filter);
}

// Date match (convert datepicker yyyy-mm-dd to MM/DD/YYYY)
function matchDate(value, filter) {
    if (!filter) return true;
    if (!value) return false;
    const [yyyy, mm, dd] = filter.split('-'); // datepicker format
    const filterFormatted = `${mm}/${dd}/${yyyy}`;
    return value === filterFormatted;
}

// Partial match based on type
function matchPartial(value, filter, type) {
    if (type === "date") {
        return matchDate(value, filter);
    }
    if (type === "dosage") {
        return matchDosage(value, filter);
    }
    return matchText(value, filter);
}

// Main filtering function
function filterPatients() {
    const dateFilter = $('#txtDate').val();
    const dosageFilter = $('#txtDosage').val().trim();
    const drugFilter = $('#txtDrug').val().trim();
    const patientFilter = $('#txtPatient').val().trim();

    const filtered = allPatients.filter(p => {
        const dateStr = formatDate(new Date(p.ModifiedDate)); // MM/DD/YYYY
        return matchPartial(dateStr, dateFilter, "date") &&
            matchPartial(p.Dosage, dosageFilter, "dosage") &&
            matchPartial(p.Drug, drugFilter) &&
            matchPartial(p.Patient, patientFilter);
    });

    table.clear().rows.add(filtered).draw();

    // Show or hide reset button
    if (dateFilter || dosageFilter || drugFilter || patientFilter) {
        $('#btnReset').show();
    } else {
        $('#btnReset').hide();
    }
}

// Event bindings
$(document).ready(function () {
    $('#txtDate, #txtDosage, #txtDrug, #txtPatient').on('input', filterPatients);

    $('#btnReset').click(function () {
        $('#txtDate, #txtDosage, #txtDrug, #txtPatient').val('');
        filterPatients();
    });

    filterPatients();
});
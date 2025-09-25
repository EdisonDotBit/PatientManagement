// Helpers for searching
function matchPartial(value, filter) {
    if (!filter) {
        return true;
    }
    if (value === null || value === undefined) {
        return false;
    }

    let vStr = value.toString().trim();
    let fStr = filter.toString().trim();

    if (!isNaN(vStr) && !isNaN(fStr.replace(/\.$/, ""))) {
        return matchDosage(vStr, fStr);
    } else if (fStr.includes("/")) {
        return matchDate(vStr, fStr);
    } else {
        return matchText(vStr, fStr);
    }
}
function matchDate(value, filter) {
    if (!value || !filter) {
        return false;
    }

    let vNorm = value.replace(/\b0(\d)/g, "$1");
    let fNorm = filter.replace(/\b0(\d)/g, "$1");

    if (vNorm.includes(filter) || vNorm.includes(fNorm)) {
        return true;
    }

    let [mm, dd, yyyy] = value.split("/");
    if (!mm || !dd || !yyyy) {
        return false;
    }

    if (/^\d{4}$/.test(fNorm)) {
        return yyyy === fNorm;
    } else if (/^\d{1,2}\/\d{4}$/.test(fNorm)) {
        let [fMonth, fYear] = fNorm.split("/");
        fMonth = fMonth.padStart(2, "0");
        return yyyy === fYear && mm === fMonth;
    } else {
        return false;
    }
}
function matchDosage(value, filter) {
    let vStr = parseFloat(value).toFixed(4);
    let fStr = filter.toString().trim();
    return vStr.includes(fStr);
}
function matchText(value, filter) {
    let vNorm = value.toLowerCase().replace(/\s+/g, '');
    let fNorm = filter.toLowerCase().replace(/\s+/g, '');
    return vNorm.includes(fNorm);
}

// Main filtering
function filterPatients() {
    const dateFilter = $('#txtDate').val().trim();
    const dosageFilter = $('#txtDosage').val().trim();
    const drugFilter = $('#txtDrug').val().trim();
    const patientFilter = $('#txtPatient').val().trim();

    const filtered = allPatients.filter(p => {
        const dateStr = formatDate(parseDate(p.ModifiedDate));
        if (matchPartial(dateStr, dateFilter) &&
            matchPartial(p.Dosage, dosageFilter) &&
            matchPartial(p.Drug, drugFilter) &&
            matchPartial(p.Patient, patientFilter)) {
            return true;
        } else {
            return false;
        }
    });

    table.clear().rows.add(filtered).draw();
}

// Bind filters
$(document).ready(function () {
    $('#txtDate, #txtDosage, #txtDrug, #txtPatient').on('input', filterPatients);

    $('#btnReset').click(function () {
        $('#txtDate, #txtDosage, #txtDrug, #txtPatient').val('');
        filterPatients();
    });

    filterPatients(); 
});
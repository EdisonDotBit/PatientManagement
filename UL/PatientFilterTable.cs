using System;
using System.Collections.Generic;
using System.Linq;
using EL;

namespace UL
{
    public static class PatientFilterTable
    {
       
        public static List<PatientEntity> FilterPatients(
            List<PatientEntity> patientList,
            string searchDate = null,
            string searchDosage = null,
            string searchDrug = null,
            string searchPatient = null)
        {
            if (patientList == null)
                return new List<PatientEntity>();

            var filtered = patientList.AsQueryable();

            // Filter by Date
            if (!string.IsNullOrWhiteSpace(searchDate))
            {
                if (DateTime.TryParse(searchDate, out DateTime parsedDate))
                {
                    filtered = filtered.Where(p => p.ModifiedDate.Date == parsedDate.Date);
                }
            }

            if (!string.IsNullOrWhiteSpace(searchDosage))
            {
                filtered = filtered.Where(p => p.Dosage != null &&
                                               p.Dosage.ToString().Contains(searchDosage));
            }

            if (!string.IsNullOrWhiteSpace(searchDrug))
            {
                filtered = filtered.Where(p => p.Drug != null &&
                                               p.Drug.ToLower().Contains(searchDrug.ToLower()));
            }

            if (!string.IsNullOrWhiteSpace(searchPatient))
            {
                filtered = filtered.Where(p => p.Patient != null &&
                                               p.Patient.ToLower().Contains(searchPatient.ToLower()));
            }
            return filtered.ToList();
        }
    }
}

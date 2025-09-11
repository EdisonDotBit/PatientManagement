using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EL;
using DAL;

namespace BLL
{
    public class PatientBLL
    {
        private readonly PatientDAL patientDAL = new PatientDAL();

        public List<PatientEntity> GetPatients()
        {
            return patientDAL.GetPatients();
        }

        public ResultEntity CreatePatient(PatientEntity patient)
        {
            // Set the date automatically
            patient.ModifiedDate = DateTime.Now;

            // Check for duplicate
            if (patientDAL.IsDuplicate(patient))
            {
                return new ResultEntity { Success = false, Message = "Cannot add same drug to a patient on the same day." };

            }

            // If passed, insert into database
            patientDAL.CreatePatient(patient);
            return new ResultEntity { Success = true, Message = "Record successfully saved."};
        }
    }
}

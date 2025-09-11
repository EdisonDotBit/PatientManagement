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

        public ResultEntity CreatePatient(PatientEntity patientEntity)
        {
            // Set the date automatically
            patientEntity.ModifiedDate = DateTime.Now;

            // Check for duplicate
            if (patientDAL.IsDuplicate(patientEntity))
            {
                return new ResultEntity { Success = false, Message = "Cannot add same drug to a patient on the same day." };

            }

            // If passed, insert into database
            patientDAL.CreatePatient(patientEntity);
            return new ResultEntity { Success = true, Message = "Record successfully saved."};
        }

        public ResultEntity EditPatient(PatientEntity patientEntity)
        {
            patientEntity.ModifiedDate = DateTime.Now;

            // Optional: Prevent duplicates on update (exclude current ID)
            if (patientDAL.IsUpdateDuplicate(patientEntity))
            {
                return new ResultEntity { Success = false, Message = "Cannot update to a duplicate drug for this patient on the same day." };
            }

            patientDAL.EditPatient(patientEntity);
            return new ResultEntity { Success = true, Message = "Record successfully updated." };
        }

    }
}

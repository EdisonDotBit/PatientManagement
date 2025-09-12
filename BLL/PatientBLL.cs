using DAL;
using EL;
using System;
using System.Collections.Generic;
using System.Linq;
using UL;

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
            patientEntity.ModifiedDate = DateTime.Now;

            if (patientDAL.IsDuplicate(patientEntity))
            {
                return new ResultEntity { Success = false, Message = ResultUtil.Duplicate};

            }

            patientDAL.CreatePatient(patientEntity);
            return new ResultEntity { Success = true, Message = ResultUtil.Saved};
        }

        public ResultEntity EditPatient(PatientEntity patientEntity)
        {
            patientEntity.ModifiedDate = DateTime.Now;

            var existingPatient = patientDAL.GetPatients().FirstOrDefault(p => p.ID == patientEntity.ID);
            if (existingPatient == null)
                return new ResultEntity { Success = false, Message = ResultUtil.NotFound };

            if (patientDAL.IsUpdateDuplicate(patientEntity))
            {
                return new ResultEntity { Success = false, Message = ResultUtil.UpdateDuplicate};
            }

            if (existingPatient.Patient == patientEntity.Patient &&
                existingPatient.Drug == patientEntity.Drug &&
                existingPatient.Dosage == patientEntity.Dosage)
            {
                return new ResultEntity { Success = false, Message = ResultUtil.NoChanges };
            }

            patientDAL.EditPatient(patientEntity);
            return new ResultEntity { Success = true, Message = ResultUtil.Updated };
        }

        public ResultEntity DeletePatient(int ID)
        {
            try
            {
                patientDAL.DeletePatient(ID);
                return new ResultEntity { Success = true, Message = ResultUtil.Deleted };
            } catch (Exception ex)
            {
                return new ResultEntity { Success = false, Message = ResultUtil.DeleteError(ex.Message)};
            }
        }
    }
}

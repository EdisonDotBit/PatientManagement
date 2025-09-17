using DAL;
using EL;
using System;
using System.Linq;
using UL;

namespace BLL
{
    public class PatientValidateBLL
    {
        private readonly PatientValidateDAL patientValidateDAL = new PatientValidateDAL();
        private readonly PatientDAL patientDAL = new PatientDAL();
        public ResultEntity IsAddDuplicate(PatientEntity patientEntity)
        {
            try
            {
                patientEntity.ModifiedDate = DateTime.Now;

                if (patientValidateDAL.IsAddExactDuplicate(patientEntity))
                    return new ResultEntity { Success = false, Message = ResultUtil.ExactDuplicate };

                if (patientValidateDAL.IsAddDrugDuplicate(patientEntity))
                    return new ResultEntity { Success = false, Message = ResultUtil.DrugDuplicate };

                return new ResultEntity { Success = true, Message = ResultUtil.NoDuplicateFound };
            }
            catch (Exception ex)
            {
                return new ResultEntity { Success = false, Message = ResultUtil.DuplicateError(ex.Message) };
            }
        }
        public ResultEntity IsUpdateDuplicate(PatientEntity patientEntity)
        {
            try
            {
                patientEntity.ModifiedDate = DateTime.Now;

                if (patientValidateDAL.IsUpdateExactDuplicate(patientEntity))
                    return new ResultEntity { Success = false, Message = ResultUtil.ExactDuplicate };

                if (patientValidateDAL.IsUpdateDrugDuplicate(patientEntity))
                    return new ResultEntity { Success = false, Message = ResultUtil.UpdateDrugDuplicate };

                return new ResultEntity { Success = true, Message = ResultUtil.NoDuplicateFound };
            }
            catch (Exception ex)
            {
                return new ResultEntity { Success = false, Message = ResultUtil.DuplicateError(ex.Message) };
            }
        }
        public ResultEntity HasChanges(PatientEntity patientEntity)
        {
            try
            {
                patientEntity.ModifiedDate = DateTime.Now;
                var existingPatient = patientDAL.GetPatients().FirstOrDefault(p => p.ID == patientEntity.ID);

                if (existingPatient == null)
                {
                    return new ResultEntity { Success = false, Message = ResultUtil.NotFound };
                }
                    
                if (existingPatient.Patient == patientEntity.Patient &&
                    existingPatient.Drug == patientEntity.Drug &&
                    existingPatient.Dosage == patientEntity.Dosage)
                {
                    return new ResultEntity { Success = false, Message = ResultUtil.NoChanges };
                }
                return new ResultEntity { Success = true, Message = ResultUtil.HasChanges };
            }
            catch (Exception ex)
            {
                return new ResultEntity { Success = false, Message = ResultUtil.GetError(ex.Message) };
            }
        }
    }
}

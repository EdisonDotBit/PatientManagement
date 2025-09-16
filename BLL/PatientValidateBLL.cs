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
        public ResultEntity IsDuplicate(PatientEntity patientEntity)
        {
            try
            {
                if (patientEntity.ModifiedDate == default)
                {
                    patientEntity.ModifiedDate = DateTime.Now;
                }

                bool isDuplicate = patientValidateDAL.IsDuplicate(patientEntity);

                if (isDuplicate)
                {
                    return new ResultEntity { Success = false, Message = ResultUtil.Duplicate };
                }
                else
                {
                    return new ResultEntity { Success = true, Message = ResultUtil.NoDuplicateFound };
                }
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
                bool isUpdateDuplicate = patientValidateDAL.IsUpdateDuplicate(patientEntity);

                if (isUpdateDuplicate)
                {
                    return new ResultEntity { Success = false, Message = ResultUtil.UpdateDuplicate };
                } else
                {
                    return new ResultEntity { Success = true, Message = ResultUtil.NoDuplicateFound };
                }       
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

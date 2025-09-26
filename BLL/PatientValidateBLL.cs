using DAL;
using EL;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
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
                {
                    return new ResultEntity 
                    { 
                        IsValid = false, 
                        Message = ResultUtil.ExactDuplicate,
                        Fields = new List<string> { "Patient", "Drug", "Dosage" }
                    };
                }

                if (patientValidateDAL.IsAddDrugDuplicate(patientEntity))
                {
                    return new ResultEntity 
                    { 
                        IsValid = false, 
                        Message = ResultUtil.DrugDuplicate,
                        Fields = new List<string> { "Drug" }
                    };
                }
                return new ResultEntity { IsValid = true, Message = ResultUtil.NoDuplicateFound };
            }
            catch (Exception ex)
            {
                return new ResultEntity { IsValid = false, Message = ResultUtil.DuplicateError(ex.Message) };
            }
        }
        public ResultEntity IsUpdateDuplicate(PatientEntity patientEntity)
        {
            try
            {
                patientEntity.ModifiedDate = DateTime.Now;

                if (patientValidateDAL.IsUpdateExactDuplicate(patientEntity))
                {
                    return new ResultEntity 
                    { 
                        IsValid = false, 
                        Message = ResultUtil.ExactDuplicate,
                        Fields = new List<string> { "Patient", "Drug", "Dosage" }
                    };
                }
                if (patientValidateDAL.IsUpdateDrugDuplicate(patientEntity))
                {
                    return new ResultEntity 
                    { 
                        IsValid = false, 
                        Message = ResultUtil.DrugDuplicate,
                        Fields = new List<string> { "Drug" }
                    };
                }                  
                return new ResultEntity { IsValid = true, Message = ResultUtil.NoDuplicateFound };
            }
            catch (Exception ex)
            {
                return new ResultEntity { IsValid = false, Message = ResultUtil.DuplicateError(ex.Message) };
            }
        }
        public ResultEntity HasChanges(PatientEntity patientEntity)
        {
            try
            {
                var existingPatient = patientValidateDAL.GetPatientByID(patientEntity.ID);

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
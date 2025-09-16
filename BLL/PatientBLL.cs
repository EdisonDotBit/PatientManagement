using DAL;
using EL;
using System;
using System.Collections.Generic;
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
            try
            {
                patientEntity.ModifiedDate = DateTime.Now;

                bool created = patientDAL.CreatePatient(patientEntity);
                
                if(created)
                {
                    return new ResultEntity { Success = true, Message = ResultUtil.Saved };
                } else
                {
                    return new ResultEntity { Success = false, Message = ResultUtil.UnexpectedError };
                }
               
            } catch (Exception ex) 
            {
                return new ResultEntity { Success = false, Message = ResultUtil.CreateError(ex.Message) };
            }  
        }

        public ResultEntity EditPatient(PatientEntity patientEntity)
        {
           try
            {
                patientEntity.ModifiedDate = DateTime.Now;
                bool updated = patientDAL.EditPatient(patientEntity);
                
                if(updated)
                {
                    return new ResultEntity { Success = true, Message = ResultUtil.Updated };
                } else
                {
                    return new ResultEntity { Success = false, Message = ResultUtil.UnexpectedError };
                }

            } catch (Exception ex)
            {
                return new ResultEntity { Success = false, Message = ResultUtil.UpdateError(ex.Message) };
            }
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

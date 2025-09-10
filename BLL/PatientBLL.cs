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
    }
}

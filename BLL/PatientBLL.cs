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
        private readonly PatientDAO patientDAO = new PatientDAO();

        public List<PatientEntity> GetPatients()
        {
            return patientDAO.GetPatients();
        } 
    }
}

using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class PatientContextDAL
    {
        protected readonly string connectionString = ConfigurationManager.ConnectionStrings["PatientManagement"].ConnectionString;
    }
}

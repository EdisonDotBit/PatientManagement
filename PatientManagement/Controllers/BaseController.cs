using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PatientManagement.Controllers
{
    public class BaseController : Controller
    {
        // GET: Base
        protected string connectionString = ConfigurationManager.ConnectionStrings["PatientManager"].ConnectionString;
    }
}
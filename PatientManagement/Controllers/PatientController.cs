using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BLL;
using EL;

namespace PatientManagement.Controllers
{
    public class PatientController : Controller
    {

        // Initialize object to use call BLL methods in the controller
        PatientBLL patientBLL = new PatientBLL();

        // GET: Patient
        public ActionResult Index()
        {
            List<PatientDTO> patientlist = patientBLL.GetPatients();
            return View();
        }
    }
}
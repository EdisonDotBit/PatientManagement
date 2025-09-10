using BLL;
using EL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PatientManagement.Controllers
{
    public class PatientController : Controller
    {

        // Initialize object to use call BLL methods in the controller
        PatientBLL patientBLL = new PatientBLL();

        // GET: Patient
        public ActionResult Index()
        {
            List<PatientEntity> patientList = patientBLL.GetPatients();
            return View(patientList);
        }      
    }
}
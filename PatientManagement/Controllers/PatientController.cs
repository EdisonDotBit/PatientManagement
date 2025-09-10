using BLL;
using EL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using UL;

namespace PatientManagement.Controllers
{
    public class PatientController : Controller
    {

        // Initialize object to use call BLL methods in the controller
        PatientBLL patientBLL = new PatientBLL();

        // GET: Patient
        public ActionResult Index(string searchDate, string searchDosage, string searchDrug, string searchPatient)
        {
            List<PatientEntity> patientList = patientBLL.GetPatients();

            // Filter patients using utility class
            patientList = PatientFilterTable.FilterPatients(patientList, searchDate, searchDosage, searchDrug, searchPatient);

            return View(patientList);
        }


    }
}
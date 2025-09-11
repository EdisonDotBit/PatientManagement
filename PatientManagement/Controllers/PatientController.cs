using BLL;
using EL;
using System;
using System.Collections.Generic;
using System.Globalization;
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

        [HttpGet]
        public JsonResult Search(string Date, string Dosage, string Drug, string Patient)
        {
            var patients = patientBLL.GetPatients();

            // Filter by Date
            if (!string.IsNullOrEmpty(Date) && DateTime.TryParse(Date, out DateTime filterDate))
            {
                patients = patients.Where(p => p.ModifiedDate.Date == filterDate.Date).ToList();
            }

            // Filter by Dosage
            if (!string.IsNullOrEmpty(Dosage) && decimal.TryParse(Dosage, NumberStyles.Any, CultureInfo.InvariantCulture, out decimal filterDosage))
            {
                patients = patients.Where(p => p.Dosage == filterDosage).ToList();
            }

            // Filter by Drug
            if (!string.IsNullOrEmpty(Drug))
            {
                patients = patients.Where(p => p.Drug.IndexOf(Drug, StringComparison.OrdinalIgnoreCase) >= 0).ToList();
            }

            // Filter by Patient
            if (!string.IsNullOrEmpty(Patient))
            {
                patients = patients.Where(p => p.Patient.IndexOf(Patient, StringComparison.OrdinalIgnoreCase) >= 0).ToList();
            }

            // Return JSON
            return Json(patients, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Create()
        {
            return View(new PatientEntity());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult Create(PatientEntity model)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return Json(new { success = false, message = string.Join("<br />", errors) });
            }

            ResultEntity result = patientBLL.CreatePatient(model);
          
            return Json(new { success = result.Success, message = result.Message});
        }
    }
}
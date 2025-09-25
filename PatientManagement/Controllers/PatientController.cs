using BLL;
using EL;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web.Mvc;

namespace PatientManagement.Controllers
{
    public class PatientController : Controller
    {
        // Initialize object to use call BLL methods in the controller
        PatientBLL patientBLL = new PatientBLL();
        PatientValidateBLL patientValidateBLL = new PatientValidateBLL();
        public ActionResult Index()
        {
            List<PatientEntity> patientList = patientBLL.GetPatients();
            return View(patientList);
        }

        public ActionResult Create()
        {
            return View(new PatientEntity());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult CheckDuplicate(PatientEntity patientEntity)
        {
            ResultEntity result = patientValidateBLL.IsAddDuplicate(patientEntity);
            return Json(new { isDuplicate = !result.IsValid, message = result.Message });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult Create(PatientEntity patientEntity)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                return Json(new { success = false, message = string.Join("<br />", errors) });
            }
            ResultEntity result = patientBLL.CreatePatient(patientEntity);
            return Json(new { success = result.Success, message = result.Message});
        }

        public ActionResult Edit(int ID)
        {
            PatientEntity patientEntity = patientBLL.GetPatients().FirstOrDefault(p => p.ID == ID);
            if (patientEntity == null)
            {
                return RedirectToAction("RouteNotFound", "Home");
            }
            return View(patientEntity);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult CheckHasChanges(PatientEntity patientEntity)
        {
            ResultEntity result = patientValidateBLL.HasChanges(patientEntity);
            return Json(new { success = result.Success, message = result.Message });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult CheckUpdateDuplicate(PatientEntity patientEntity)
        {
            ResultEntity result = patientValidateBLL.IsUpdateDuplicate(patientEntity);
            return Json(new { isDuplicate = !result.IsValid, message = result.Message });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(PatientEntity patientEntity)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                return Json(new { success = false, message = string.Join("<br />", errors) });
            }
            ResultEntity result = patientBLL.EditPatient(patientEntity);
            return Json(new { success = result.Success, message = result.Message });
        }

        [HttpPost]
        public ActionResult Delete(int ID)  
        {
            ResultEntity result = patientBLL.DeletePatient(ID);
            return Json(new { success = result.Success, message = result.Message });
        }
    }
}
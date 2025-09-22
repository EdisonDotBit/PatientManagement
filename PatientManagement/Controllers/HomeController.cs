using BLL;
using EL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PatientManagement.Controllers
{
    public class HomeController : Controller
    { 
        private PatientBLL patientBLL = new PatientBLL();
        // GET: Home
        public ActionResult Index()
        {
            List<PatientEntity> patients = patientBLL.GetPatients();

            List<DailyRecordEntity> dailyRecords = patients
                .GroupBy(p => p.ModifiedDate.Date)
                .Select(g => new DailyRecordEntity { Date = g.Key.ToString("MM/dd"), Count = g.Count() })
                .OrderBy(x => x.Date)
                .ToList();

            List<DrugDistributionEntity> drugDistribution = patients
                .GroupBy(p => p.Drug)
                .Select(g => new DrugDistributionEntity { Drug = g.Key, Count = g.Count() })
                .ToList();

            List<DrugDistributionEntity> topDrugs = drugDistribution.Take(5).ToList();
            int othersCount = drugDistribution.Skip(5).Sum(x => x.Count);
            if (othersCount > 0)
            {
                topDrugs.Add(new DrugDistributionEntity { Drug = "Others", Count = othersCount });
            }

            ViewBag.TotalPatients = patients.Count;
            ViewBag.TotalDrugs = patients.Select(p => p.Drug).Distinct().Count();
            ViewBag.DailyRecords = dailyRecords;
            ViewBag.DrugDistribution = topDrugs;
            ViewBag.TopDrugs = topDrugs.Take(5).ToList();

            return View();
        }
    
        public ActionResult RouteNotFound()
        {
            return View();
        }

    }
}
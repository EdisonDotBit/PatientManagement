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
        public ActionResult RouteNotFound()
        {
            return View();
        }

    }
}
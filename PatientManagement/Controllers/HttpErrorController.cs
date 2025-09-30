using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PatientManagement.Controllers
{
    public class HttpErrorController : Controller
    {
        // GET: HttpError
        public ActionResult RouteNotFound()
        {
            Response.StatusCode = 404;
            return View();
        }
    }
}
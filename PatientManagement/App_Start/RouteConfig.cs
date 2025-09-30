using System.Web.Mvc;
using System.Web.Routing;

namespace PatientManagement
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            // Create
            routes.MapRoute(
                name: "PatientCreate",
                url: "Patient/Create",
                defaults: new { controller = "Patient", action = "Create" }
            );

            // Edit with numeric ID
            routes.MapRoute(
                name: "PatientEdit",
                url: "Patient/Edit/{id}",
                defaults: new { controller = "Patient", action = "Edit" },
                constraints: new { id = @"\d+" }
            );

            // Edit without id
            routes.MapRoute(
                name: "PatientEditNoId",
                url: "Patient/Edit",
                defaults: new { controller = "HttpError", action = "RouteNotFound" }
            );

            // Create with extra path
            routes.MapRoute(
                name: "PatientCreateBlock",
                url: "Patient/Create/{*anything}",
                defaults: new { controller = "HttpError", action = "RouteNotFound" }
            );

            // Default route 
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Patient", action = "Index", id = UrlParameter.Optional }
            );

            // Catch-all 404
            routes.MapRoute(
                name: "NotFound",
                url: "{*url}",
                defaults: new { controller = "HttpError", action = "RouteNotFound" }
            );
        }
    }
}
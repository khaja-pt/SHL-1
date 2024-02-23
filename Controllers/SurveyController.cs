using Microsoft.AspNetCore.Mvc;
using SHL_Platform.Data;
using SHL_Platform.Models;
using Newtonsoft.Json;
using SHL_Platform.Services;

namespace SHL_Platform.Controllers
{
    public class SurveyController(ApplicationContext context) : Controller
    {
        private readonly ApplicationContext _context = context;
        public IActionResult NewSurvey()
        {
            return View();
        }
        [HttpPost]
        public IActionResult NewSurvey([FromBody] Dictionary<string, object> formData)
        {
            if (formData != null)
            {
                // Serialize the formData dictionary to JSON
                string formDataJson = JsonConvert.SerializeObject(formData);

                // Create a new Survey object
                Survey newSurvey = new()
                {
                    FormDataJson = formDataJson
                };
                // Add the newSurvey object to the database
                _context.Surveys.Add(newSurvey);
                //_context.SaveChanges();
                // Return a JSON response indicating success
                return Json(new { success = true, redirectUrl = Url.Action("SendSurvey") });
            }

            // Return a JSON response indicating failure
            return BadRequest(new { success = false });
        }

        public IActionResult SendSurvey()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> SendSurveyAsync(string email, [FromServices] EmailService emailservices)
        {

            var emailBody = "Your Survey Link: ";
            // Send survey link 
            await emailservices.SendEmailAsync(email, "Your New Survey", emailBody);
            _context.SaveChanges();
            // Redirect to a page after survey sent
            return RedirectToAction("UserPage", "Home");

        }

    }
}

using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SHL_Platform.Data;

public class HomeController : Controller
{
    private readonly ApplicationContext _context;

    public HomeController(ApplicationContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
        var nonAdminUsers = _context.Users
            .Where(u => !u.IsAdmin)
            .Include(u => u.Country) // Include the Country navigation property
            .ToList();
        return View(nonAdminUsers);
    }

    [HttpPost]
    public IActionResult DeleteUser(int userId)
    {
        var user = _context.Users.Find(userId);
        if (user != null)
        {
            _context.Users.Remove(user);
            _context.SaveChanges();
        }
        return RedirectToAction("Index");
    }

    public IActionResult UserPage() {
        return View();
    }
}

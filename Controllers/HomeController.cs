using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using SalesReporting.Models;
using PowerBiEmbed.Services;
namespace SalesReporting.Controllers;

public class HomeController : Controller
{
    private PowerBiApiService _powerBiApiService;

    public HomeController(PowerBiApiService powerBiServiceApi)
    {
        _powerBiApiService = powerBiServiceApi;
    }

    public async Task<IActionResult> Index()
    {
        var viewModel = await _powerBiApiService.GetReportsEmbeddingData();
        return View(viewModel);
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}

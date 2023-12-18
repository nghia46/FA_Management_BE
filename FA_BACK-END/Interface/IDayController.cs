using Microsoft.AspNetCore.Mvc;
using ModelViews.ViewModels;

namespace FA_BACK_END.Interface
{
	public interface IDayController
	{
		Task<IActionResult> GetAll();
		Task<IActionResult> AddOneDay(DayView dayView);
		Task<IActionResult> DeleteDay(string id);
		Task<IActionResult> UpdateDay(string id, DayView dayView);
		Task<IActionResult> GetDayById(string id);
	}
}


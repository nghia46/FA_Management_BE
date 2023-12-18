using Microsoft.AspNetCore.Mvc;
using ModelViews.ViewModels;

namespace FA_BACK_END.Interface
{
	public interface IMaterialController
	{
		Task<IActionResult> GetAll();
		Task<IActionResult> AddMaterial(MaterialCreateView materialCreateView);
		Task<IActionResult> DeleteMaterial(string id);
		Task<IActionResult> GetMaterialById(string id);
	}
}
 
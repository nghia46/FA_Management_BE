using Microsoft.AspNetCore.Mvc;
using ModelViews.ViewModels;

namespace FA_BACK_END.Interface
{
    public interface IUnitController
    {
        public Task<IActionResult> GetAllUnits();
        public Task<IActionResult> GetUnit(string id);
        public Task<IActionResult> AddOneUnit(UnitView unitView);
        public Task<IActionResult> UpdateUnit(string id, UnitView unitView);
        public Task<IActionResult> GetUnitsByDayId(string dayId);
        public Task<IActionResult> DeleteUnit(string id);
    }
}
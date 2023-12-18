using Microsoft.AspNetCore.Mvc;
using ModelViews.ViewModels;

namespace FA_BACK_END.Interface
{
    public interface ITraineeController
    {
        Task<IActionResult> GetAll();
        Task<IActionResult> AddTrainee(TraineeView traineeView);
        Task<IActionResult> ToggleTraineeStatus(string id);
        Task<IActionResult> UpdateTrainee(string id, TraineeView traineeView);
        Task<IActionResult> GetTraineeById(string id);
    }
}

using Microsoft.AspNetCore.Mvc;
using ModelViews.ViewModels;

namespace FA_BACK_END.Interface
{
    public interface ITrainingProgramController
    {
        Task<IActionResult> GetAllTrainingProgram();
        Task<IActionResult> AddTrainingProgram(TrainingProgramView trainingProgramView);
        Task<IActionResult> UpdateTrainingProgram(string id, TrainingProgramView trainingProgramView);
        Task<IActionResult> DeleteTrainingProgram(string id);
        Task<IActionResult> GetTrainingProgramById(string id);
    }
}

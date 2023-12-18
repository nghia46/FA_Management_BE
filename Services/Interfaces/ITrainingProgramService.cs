using Models.Models;
using ModelViews.ViewModels;

namespace Services.Interfaces
{
public interface ITrainingProgramService
    {
        Task<IEnumerable<TrainingProgram>> GetTrainingPrograms();
        Task<TrainingProgram> AddTrainingProgram(TrainingProgramView trainingProgramView, string userId);
        Task<bool> RemoveTrainingProgram(string trainingProgramId);
        Task<TrainingProgram> UpdateTrainingProgram(string id ,TrainingProgramView trainingProgramView);
        Task<TrainingProgram> GetTrainingProgramsById(string id);
    }
}

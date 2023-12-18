using Models.Models;
using ModelViews.ViewModels;

namespace Services.Interfaces
{
    public  interface ITraineeService
    {
        Task<IEnumerable<Trainee>> GetAllTrainees();
        Task<Trainee> GetTraineeById(string id);
        Task<Trainee> AddTrainee(TraineeView trainee);
        Task<Trainee> UpdateTrainee(string id, TraineeView trainee);
        Task<Trainee> ToggleTraineeById(string id);
        Task<IEnumerable<Trainee>> GetPagedTrainees(int page, int pageSize);

    }
}

using AutoMapper;
using Models.Models;
using ModelViews.ViewModels;
using MongoDB.Driver;
using Repository.Service;
using Tools.Tools;
using Services.Interfaces;
using Repository.Interface;

namespace Services.Services
{
    public class TraineeService : ITraineeService
    {
        private readonly IMapper _mapper;

        private readonly IRepository<Trainee> _traineeRepos;
        public TraineeService(IRepository<Trainee> traineeRepo, IMapper mapper)
        {
            _mapper = mapper;
            _traineeRepos = traineeRepo;
        }

        public TraineeService(IMapper mapper, IRepository<Trainee> traineerepo) 
        {
            this._mapper = mapper;
            this._traineeRepos = traineerepo;
        }
        public async Task<Trainee> AddTrainee(TraineeView traineeview)
        {
            Trainee trainee = _mapper.Map<Trainee>(traineeview);
            trainee.Id = IdGenerator.GenerateId();
            return await _traineeRepos.AddOneItem(trainee);
        }

        public async Task<Trainee> ToggleTraineeById(string id)
        {
            IEnumerable<Trainee> trainees = await _traineeRepos.GetByFilterAsync(x => x.Id == id);
            if (!trainees.Any())
            {
                throw new Tools.Tools.CustomException.DataNotFoundException($"Trainee with Id {id} not found");
            }
            return await _traineeRepos.ChangeStatus(id, !trainees.First().Status);
        }
        public async Task<IEnumerable<Trainee>> GetAllTrainees()
        {
            return await _traineeRepos.GetAllAsync();
        }

        public async Task<IEnumerable<Trainee>> GetPagedTrainees(int page, int pageSize)
        {
            int skip = (page - 1) * pageSize;
            IEnumerable<Trainee> trainees = await _traineeRepos.GetAllAsync();
            var traineesInPage = trainees.Skip(skip).Take(pageSize).ToList();
            return traineesInPage;
        }

        public async Task<Trainee> GetTraineeById(string id)
        {
            IEnumerable<Trainee> filtedTraineeList = await _traineeRepos.GetByFilterAsync(t => t.Id.Equals(id));
            if (!filtedTraineeList.Any())
            {
                throw new Tools.Tools.CustomException.DataNotFoundException($"Trainee with id {id} not found");
            }
            return filtedTraineeList.First();
        }
        public async Task<Trainee> UpdateTrainee(string id, TraineeView traineeview)
        {
            Trainee trainee = _mapper.Map<Trainee>(traineeview);
            trainee.Id = id;
            return await _traineeRepos.UpdateItemByValue(id, trainee);
        }
    }
}

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
    public class TrainingProgramService : ITrainingProgramService
    {
        private readonly IMapper _mapper;
        private readonly IRepository<TrainingProgram> _trainingProgramRepos;
        private readonly IUserRepository _userRepository;
        private readonly IRepository<Syllabus> _syllabusRepo;
        public TrainingProgramService(IRepository<TrainingProgram> programRepo, IUserRepository userRepo, IMapper mapper, IRepository<Syllabus> syllabusRepo)
        {
            _mapper = mapper;
            _trainingProgramRepos = programRepo;
            _userRepository = userRepo;
            _syllabusRepo = syllabusRepo;
        }

        public async Task<TrainingProgram> AddTrainingProgram(TrainingProgramView trainingProgramView, string userId)
        {
            IEnumerable<User> users = await _userRepository.GetByFilterAsync(u => u.Id.Equals(userId));
            if (!users.Any())
            {
                throw new Tools.Tools.CustomException.InternalServerErrorException($"User with id {userId} not found");
            }
            IEnumerable<Syllabus> syllabuses = await _syllabusRepo.GetAllAsync();
            int duration = 0;
            foreach (string syllabusId in trainingProgramView.Syllabuses)
            {
                Syllabus syllabus = syllabuses.FirstOrDefault(s => s.Id.Equals(syllabusId));
                if (syllabus == null)
                {
                    throw new CustomException.InvalidDataException($"Syllabus with id {syllabusId} does not exist!");
                }
                else
                {
                    duration += syllabus.TrainingTime;
                }
            }
            string trainingprogarmId = IdGenerator.GenerateId();
            TrainingProgram trainingProgram = _mapper.Map<TrainingProgram>(trainingProgramView);
            if (!trainingProgram.Syllabuses.Any())
            {
                throw new Tools.Tools.CustomException.InvalidDataException("Syllabuses is empty");
            }
            trainingProgram.Duration = duration;
            trainingProgram.Id = trainingprogarmId;
            trainingProgram.CreateBy = new UserCreate { Id = users.First().Id, Name = users.First().Name };
            trainingProgram.CreateOn = DateOnly.FromDateTime(DateTime.Now);
            return await _trainingProgramRepos.AddOneItem(trainingProgram);
        }

        public async Task<IEnumerable<TrainingProgram>> GetTrainingPrograms()
        {
            return await _trainingProgramRepos.GetAllAsync();
        }

        public async Task<TrainingProgram> GetTrainingProgramsById(string id)
        {
            IEnumerable<TrainingProgram> checkId = await _trainingProgramRepos.GetByFilterAsync(x => x.Id.Equals(id));
            if (!checkId.Any())
            {
                throw new Tools.Tools.CustomException.DataNotFoundException($"Training program with id {id} not found");
            }

            return checkId.First();
        }

        public async Task<bool> RemoveTrainingProgram(string id)
        {
            IEnumerable<TrainingProgram> programs = await _trainingProgramRepos.GetByFilterAsync(t => t.Id == id);
            if (!programs.Any())
            {
                throw new Tools.Tools.CustomException.DataNotFoundException($"Training program with id {id} not found");
            }
            return await _trainingProgramRepos.RemoveItemByValue(id);
        }



        public async Task<TrainingProgram> UpdateTrainingProgram(string id, TrainingProgramView trainingProgramView)
        {
            IEnumerable<TrainingProgram> programs = await _trainingProgramRepos.GetByFilterAsync(t => t.Id == id);
            if (!programs.Any())
            {
                throw new Tools.Tools.CustomException.DataNotFoundException($"Training program with id {id} not found");
            }
            IEnumerable<Syllabus> syllabuses = await _syllabusRepo.GetAllAsync();
            int duration = 0;
            foreach (string syllabusId in trainingProgramView.Syllabuses)
            {
                Syllabus syllabus = syllabuses.FirstOrDefault(s => s.Id.Equals(syllabusId));
                if (syllabus == null)
                {
                    throw new CustomException.InvalidDataException($"Syllabus with id {syllabusId} does not exist!");
                }
                else
                {
                    duration += syllabus.TrainingTime;
                }
            }
            TrainingProgram trainingProgram = _mapper.Map<TrainingProgram>(trainingProgramView);
            if (!trainingProgram.Syllabuses.Any())
            {
                throw new Tools.Tools.CustomException.InvalidDataException("Syllabuses is empty");
            }
            trainingProgram.Duration = duration;
            trainingProgram.Id = id;
            trainingProgram.CreateOn = programs.First().CreateOn;
            trainingProgram.CreateBy = programs.First().CreateBy;
            return await _trainingProgramRepos.UpdateItemByValue(id, trainingProgram);
        }
    }
}

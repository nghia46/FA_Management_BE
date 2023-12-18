using System.Collections;
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
    public class ClassService : IClassService
    {
        private readonly IMapper _mapper;

        private readonly IRepository<Class> _classRepos;
        private readonly IRepository<Location> _locationRepos;
        private readonly IUserRepository _userRepository;
        private readonly IRepository<Attendee> _attendeeRepos;

        public ClassService(IMapper mapper, IRepository<Class> classRepos, IRepository<Location> locationRepos,
            IUserRepository userRepository, IRepository<Attendee> attendeeRepos)
        {
            _mapper = mapper;
            _classRepos = classRepos;
            _locationRepos = locationRepos;
            _userRepository = userRepository;
            _attendeeRepos = attendeeRepos;
        }

        public async Task<IEnumerable<Class>> GetAllClass()
        {
            return await _classRepos.GetAllAsync();
        }

        public async Task<Class> GetClassById(string id)
        {
            IEnumerable<Class> classes = await _classRepos.GetByFilterAsync(x => x.Id == id);
            if (!classes.Any())
            {
                throw new Tools.Tools.CustomException.DataNotFoundException($"Class with id {id} not found");
            }

            return classes.First();
        }

        public async Task<Class> UpdateClass(string id, ClassView classView)
        {
            IEnumerable<Class> classes = await _classRepos.GetByFilterAsync(x => x.Id == id);
            if (!classes.Any())
            {
                throw new Tools.Tools.CustomException.DataNotFoundException($"Class with id {id} not found");
            }

            Class newClass = _mapper.Map<Class>(classView);
            newClass.Id = id;
            newClass.FSU = classes.First().FSU;
            return await _classRepos.UpdateItemByValue(id, newClass);
        }

        public async Task<bool> RemoveClassById(string id)
        {
            IEnumerable<Class> classes = await _classRepos.GetByFilterAsync(x => x.Id == id);
            if (!classes.Any())
            {
                throw new Tools.Tools.CustomException.DataNotFoundException($"Class with id {id} not found");
            }

            return await _classRepos.RemoveItemByValue(id);
        }

        public async Task<Class> AddClass(ClassView classView, string userId)
        {
            IEnumerable<Location> locations = await _locationRepos.GetByFilterAsync(x => x.Id == classView.LocationId);
            if (!locations.Any())
            {
                throw new Tools.Tools.CustomException.DataNotFoundException(
                    $"Location with id {classView.LocationId} not found");
            }

            IEnumerable<User> users = await _userRepository.GetByFilterAsync(x => x.Id == userId);
            IEnumerable<Attendee> attendees = await _attendeeRepos.GetByFilterAsync(x => x.Id == classView.AttendeeId);
            Class @class = _mapper.Map<Class>(classView);
            @class.Location = new LocationClass
                { LocationId = locations.First().Id, LocationName = locations.First().Name };
            @class.CreatedByUserId = new UserCrate { UserId = users.First().Id, UserName = users.First().Name };
            @class.Id = IdGenerator.GenerateId();
            @class.Attendee = new ShowAttendee
                { AttendeeId = attendees.First().Id, AttendeeName = attendees.First().Name };
            return await _classRepos.AddOneItem(@class);
        }
    }
}
using Models.Models;
using ModelViews.ViewModels;
using MongoDB.Driver;
using Tools.Tools;
using AutoMapper;
using Services.Interfaces;
using Repository.Interface;

namespace Services.Services
{
    public class AttendeeService : IAttendeeService
    {
        private readonly IMapper _mapper;
        private readonly IRepository<Attendee> _attendeeRepos;
        public AttendeeService(IRepository<Attendee> attendeeRepo, IMapper mapper)
        {
            _mapper = mapper;
            _attendeeRepos = attendeeRepo;
        }
        public async Task<Attendee> AddOneAttendee(AttendeeView attendeeView)
        {      
            Attendee attendee = _mapper.Map<Attendee>(attendeeView);
            attendee.Id = IdGenerator.GenerateId();
            return await _attendeeRepos.AddOneItem(attendee);
        }

        public async Task<bool> DeleteAttendee(string id)
        {
            IEnumerable<Attendee> selectedAttendee = await _attendeeRepos.GetByFilterAsync(a => a.Id.Equals(id));
            if (!selectedAttendee.Any())
            {
                throw new Tools.Tools.CustomException.DataNotFoundException($"Attendee with id {id} not found");
            }
            return await _attendeeRepos.RemoveItemByValue(id);
        }

        public async Task<IEnumerable<Attendee>> GetAllAttendee()
        {
            return await _attendeeRepos.GetAllAsync(); 
        }

        public async Task<Attendee> UpdateNameAttendee(string id, AttendeeView attendeeView)
        {
            IEnumerable<Attendee> selectedAttendee = await _attendeeRepos.GetByFilterAsync(a=>a.Id.Equals(id));
            if (!selectedAttendee.Any())
            {
                throw new Tools.Tools.CustomException.DataNotFoundException($"Attendee with id {id} not found");
            }
            Attendee attendee = _mapper.Map<Attendee>(attendeeView);
            attendee.Id = id;
            return await _attendeeRepos.UpdateItemByValue(id, attendee);
        }
        public async Task<IEnumerable<Attendee>> GetAttendeeByName(string name)
        {
            return await _attendeeRepos.GetByFilterAsync(a => a.Name.Equals(name));
        }
    }
}

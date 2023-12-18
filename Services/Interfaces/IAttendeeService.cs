using Models.Models;
using ModelViews.ViewModels;

namespace Services.Interfaces
{
    public interface IAttendeeService
    {
        public Task<IEnumerable<Attendee>> GetAllAttendee();
        public Task<Attendee> AddOneAttendee(AttendeeView attendeeView);
        public Task<Attendee> UpdateNameAttendee(string id, AttendeeView attendeeView);
        public Task<bool> DeleteAttendee(string id);
    }
}

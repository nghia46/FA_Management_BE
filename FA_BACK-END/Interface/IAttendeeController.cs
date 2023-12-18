using Microsoft.AspNetCore.Mvc;
using ModelViews.ViewModels;

namespace FA_BACK_END.Interface
{
    public interface IAttendeeController
    {
        public Task<IActionResult> GetAllAttendee();
        public Task<IActionResult> AddOneAttendee(AttendeeView attendeeView); 
        public Task<IActionResult> UpdateNameAttendee(string id, AttendeeView attendeeView);
        public Task<IActionResult> DeleteAttendee(string id);
    }
}
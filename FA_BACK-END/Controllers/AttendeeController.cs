using FA_BACK_END.Interface;
using Microsoft.AspNetCore.Mvc;
using Models.Models;
using ModelViews.ViewModels;
using Services.Interfaces;

namespace FA_BACK_END.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttendeeController : ControllerBase, IAttendeeController
    {

        private readonly IAttendeeService _attendeeService;
        public AttendeeController(IAttendeeService attendeeService)
        {
            _attendeeService = attendeeService;
        }

        [HttpGet("Get-All")]
        public async Task<IActionResult> GetAllAttendee()
        {
            IEnumerable<Attendee> attendees = await _attendeeService.GetAllAttendee();
            return Ok(attendees);

        }
        [HttpPost("Add")]
        public async Task<IActionResult> AddOneAttendee(AttendeeView attendeeView)
        {
            Attendee attendee = await _attendeeService.AddOneAttendee(attendeeView);
            return Ok(attendee);
        }
        [HttpPut("Update")]
        public async Task<IActionResult> UpdateNameAttendee(string id, AttendeeView attendeeView)
        {
            Attendee attendee = await _attendeeService.UpdateNameAttendee(id, attendeeView);
            return Ok(attendee);
        }
        [HttpDelete("Delete")]
        public async Task<IActionResult> DeleteAttendee(string id)
        {
            bool isDeleted = await _attendeeService.DeleteAttendee(id);
            if (isDeleted)
            {
                return Ok();
            }
            return BadRequest();
        }
    }
}

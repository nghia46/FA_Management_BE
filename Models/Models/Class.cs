using MongoDB.Bson.Serialization.Attributes;

namespace Models.Models
{
    public class Class
    {
        [BsonId] public required string Id { get; set; }
        [BsonElement] public required string Name { get; set; }
        [BsonElement] public required string Code { get; set; }
        [BsonElement] public required LocationClass Location { get; set; }
        [BsonElement] public required string FSU { get; set; }
        [BsonElement] public DateOnly StartDate { get; set; }
        [BsonElement] public DateOnly EndDate { get; set; }
        [BsonElement] public required UserCrate CreatedByUserId { get; set; }
        [BsonElement] public required ShowAttendee Attendee { get; set; }
        [BsonElement] public required StatusClass Status { get; set; }
        [BsonElement] public required int Planned { get; set; }
        [BsonElement] public required int Accepted { get; set; }
        [BsonElement] public required int Actual { get; set; }
        [BsonElement] public required List<string> Trainer { get; set; }
        [BsonElement] public required List<string> Admin { get; set; }
        [BsonElement] public required TimeOnly ClassTime { get; set; }
    }

    public struct LocationClass
    {
        public string LocationId { get; set; }
        public string LocationName { get; set; }
    }

    public struct UserCrate
    {
        public string UserId { get; set; }
        public string UserName { get; set; }
    }

    public struct ShowAttendee
    {
        public string AttendeeId { get; set; }
        public string AttendeeName { get; set; }
    }

    public enum StatusClass
    {
        Planning,
        Opening,
        Closed
    }
}
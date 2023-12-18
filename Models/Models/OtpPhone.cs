using MongoDB.Bson.Serialization.Attributes;

namespace Models.Models
{
    public class OtpPhone
    {
        [BsonId]
        public required string Id { get; set; }
        [BsonElement]
        public string PhoneNumber { get; set; }
        [BsonElement]
        public string Otp { get; set; }
        [BsonElement]
        public DateTime ExpiryTime { get; set; }

    }

}
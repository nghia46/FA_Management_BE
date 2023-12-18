using MongoDB.Bson.Serialization.Attributes;

namespace Models.Models
{
    public class TrainingProgram
    {
        [BsonId]
        public required string Id { get; set; }
        [BsonElement]
        public required string Name { get; set; }
        [BsonElement]
        public required string Information { get; set; }
        [BsonElement]
        public required List<string> Syllabuses { get; set; }
        [BsonElement]
        public DateOnly CreateOn { get; set; }
        [BsonElement]
        public required UserCreate CreateBy { get; set; }
        [BsonElement]
        public required int Duration { get; set; }
    }

    public struct UserCreate
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }
}

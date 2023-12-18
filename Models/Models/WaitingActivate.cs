using MongoDB.Bson.Serialization.Attributes;

namespace Models.Models;

public class WaitingActivate
{
    [BsonId]
    public required string Id { get; set; }
    [BsonElement]
    public required DateTime CreateAt { get; set; }
}
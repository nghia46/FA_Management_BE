using MongoDB.Bson.Serialization.Attributes;
namespace Models.Models
{
    public class UserRole
    {
        [BsonId]
        public required string Id {get;set;}
        [BsonElement]
        public required string Name {get;set;}
        [BsonElement]
        public required Dictionary<string,string> FeatureAccessPermission { get; set; }
    }
}
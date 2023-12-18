using Models.Models;
using MongoDB.Driver;
using Repository.Interface;

namespace Repository.Service
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(IMongoClient client) : base(client) { }

        public async Task<IEnumerable<User>> GetPagedFilteredAsync(
            int skip,
            int pageSize,
            bool isAsc,
            string sortField,
            DateOnly? startDate,
            DateOnly? endDate,
            List<bool>? genderList,
            List<string>? userTypeList,
            string? searchValue)
        {
            var filterBuilder = Builders<User>.Filter;
            var filter = filterBuilder.Empty;
            if (startDate.HasValue)
            {
                filter &= filterBuilder.Gte(u => u.Dob, startDate);
            }
            if (endDate.HasValue)
            {
                filter &= filterBuilder.Lte(u => u.Dob, endDate);
            }
            if (genderList != null && genderList.Count > 0)
            {
                filter &= filterBuilder.In(u => u.Gender, genderList);
            }
            if (userTypeList != null && userTypeList.Count > 0)
            {
                filter &= filterBuilder.In(u => u.RoleId, userTypeList);
            }
            if (!string.IsNullOrWhiteSpace(searchValue))
            {
                filter &= filterBuilder.Regex(s => s.Name, new MongoDB.Bson.BsonRegularExpression($".*{searchValue}.*", "i"));
            }
            var sortDefinition = isAsc
                    ? Builders<User>.Sort.Ascending(sortField)
                    : Builders<User>.Sort.Descending(sortField);
            var result = await _collection
                .Find(filter)
                .Sort(sortDefinition)
                .Skip(skip)
                .Limit(pageSize)
                .ToListAsync();

            return result;
        }
        public async Task<long> CountFilteredAsync(
            DateOnly? startDate,
            DateOnly? endDate,
            List<bool>? genderList,
            List<string>? userTypeList,
            string? searchValue)
        {
            var filterBuilder = Builders<User>.Filter;
            var filter = filterBuilder.Empty;
            if (startDate.HasValue)
            {
                filter &= filterBuilder.Gte(u => u.Dob, startDate);
            }
            if (endDate.HasValue)
            {
                filter &= filterBuilder.Lte(u => u.Dob, endDate);
            }
            if (genderList != null && genderList.Count > 0)
            {
                filter &= filterBuilder.In(u => u.Gender, genderList);
            }
            if (userTypeList != null && userTypeList.Count > 0)
            {
                filter &= filterBuilder.In(u => u.RoleId, userTypeList);
            }
            if (!string.IsNullOrWhiteSpace(searchValue))
            {
                filter &= filterBuilder.Regex(s => s.Name, new MongoDB.Bson.BsonRegularExpression($".*{searchValue}.*", "i"));
            }
            return await _collection.CountDocumentsAsync(filter);
        }
    }
}

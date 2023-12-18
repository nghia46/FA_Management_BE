using Models.Models;
using MongoDB.Driver;
using Repository.Interface;
using Repository.Service;
using MongoDB.Bson;

namespace Repository.Repositories
{
    public class SyllabusRepository : Repository<Syllabus>, ISyllabusRepository
    {
        public SyllabusRepository(IMongoClient client) : base(client)
        {
        }
        public async Task<IEnumerable<Syllabus>> GetPagedFilteredAsync(
            int skip,
            int pageSize,
            bool isAsc,
            string sortField,
            DateOnly? startDate,
            DateOnly? endDate,
            IEnumerable<string>? searchValues)
        {
            var filterBuilder = Builders<Syllabus>.Filter;
            var filter = filterBuilder.Empty;
            if (startDate.HasValue)
            {
                filter &= filterBuilder.Gte(s => s.ModifiedOn, startDate);
            }
            if (endDate.HasValue)
            {
                filter &= filterBuilder.Lte(s => s.ModifiedOn, endDate);
            }
            if (searchValues != null && searchValues.Any())
            {
                var searchFilter = filterBuilder.And(
                        searchValues
                        .Where(s=>!string.IsNullOrEmpty(s))
                        .Select(searchValue => filterBuilder.Regex(s => s.Name, new BsonRegularExpression($".*{searchValue}.*", "i")))
                    );
                filter &= searchFilter;
            }
            var sortDefinition = isAsc
                    ? Builders<Syllabus>.Sort.Ascending(sortField)
                    : Builders<Syllabus>.Sort.Descending(sortField);
            var result = await _collection
                .Find(filter)
                .Sort(sortDefinition)
                .Skip(skip)
                .Limit(pageSize)
                .ToListAsync();

            return result;
        }
        public async Task<long> CountPagedFilteredAsync(DateOnly? startDate, DateOnly? endDate, IEnumerable<string>? searchValues)
        {
            var filterBuilder = Builders<Syllabus>.Filter;
            var filter = filterBuilder.Empty;
            if (startDate.HasValue)
            {
                filter &= filterBuilder.Gte(s => s.ModifiedOn, startDate);
            }
            if (endDate.HasValue)
            {
                filter &= filterBuilder.Lte(s => s.ModifiedOn, endDate);
            }
            if (searchValues != null && searchValues.Any())
            {
                var searchFilter = filterBuilder.And(
                        searchValues
                        .Where(s => !string.IsNullOrEmpty(s))
                        .Select(searchValue => filterBuilder.Regex(s => s.Name, new BsonRegularExpression($".*{searchValue}.*", "i")))
                    );
                filter &= searchFilter;
            }
            long result = await _collection.CountDocumentsAsync(filter);
            return result;
        }
        public async Task<Syllabus> GetSyllabusByNameAndCodeAsync(string? name, string? code)
        {
            var filterBuilder = Builders<Syllabus>.Filter;
            var filter = filterBuilder.Empty;
            if (!string.IsNullOrWhiteSpace(name))
            {
                filter &= filterBuilder.Eq(s => s.Name, name);
            }
            if (!string.IsNullOrWhiteSpace(code))
            {
                filter &= filterBuilder.Eq(s => s.Code, code);
            }
            Syllabus result = await _collection
                .Find(filter)
                .Limit(1)
                .FirstAsync();
            return result;
        }
        public async Task<long> CountSyllabusByNameAndCodeAsync(string? name, string? code)
        {
            var filterBuilder = Builders<Syllabus>.Filter;
            var filter = filterBuilder.Empty;
            if (!string.IsNullOrWhiteSpace(name))
            {
                filter &= filterBuilder.Eq(s => s.Name, name);
            }
            if (!string.IsNullOrWhiteSpace(code))
            {
                filter &= filterBuilder.Eq(s => s.Code, code);
            }
            long result = await _collection.CountDocumentsAsync(filter);

            return result;
        }
    }
}

using MongoDB.Bson;
using MongoDB.Driver;
using Repository.Interface;
using System.Linq.Expressions;


namespace Repository.Service
{
    public class Repository<T> : IRepository<T>
    {
        internal readonly IMongoCollection<T> _collection;
        internal readonly string databasename =  "FADB";
        internal readonly string idFieldName = "_id";
        internal readonly string statusFieldName = "Status";
        public Repository(IMongoClient client)
        {
            var database = client.GetDatabase(databasename);
            _collection = database.GetCollection<T>(typeof(T).Name);
        }
        public async Task<T> AddOneItem(T item)
        {
            await _collection.InsertOneAsync(item);
            return item;

        }
        public async Task<List<T>> AddManyItem(List<T> items)
        {
            await _collection.InsertManyAsync(items);
            return items;
        }
        public async Task<List<T>> GetAllAsync()
        {
            List<T> itemList = await _collection.Find(_ => true).ToListAsync();
            return itemList;
        }
        public async Task<IEnumerable<T>> GetByFilterAsync(Expression<Func<T, bool>> filterExpression)
        {
            return await _collection.Find(filterExpression).ToListAsync();
        }
        public async Task<bool> RemoveItemByValue(string id)
        {
            var filter = Builders<T>.Filter.Eq(idFieldName, id); // Assuming "ID" is the field in your MongoDB documents
            var result = await _collection.DeleteOneAsync(filter);
            return result.DeletedCount > 0;
        }
        public async Task<T> UpdateItemByValue(string id, T replacement)
        {
            var filter = Builders<T>.Filter.Eq(idFieldName, id);
            var result = await _collection.ReplaceOneAsync(filter, replacement);
            if (result.MatchedCount > 0)
            {
                T updatedItem = await _collection.Find(filter).FirstOrDefaultAsync();
                return updatedItem;
            }
            else
            {
                throw new Exception("Failed to update item.");
            }
        }

        public async Task<T> ChangeStatus(string id, bool status)
        {
            var filter = Builders<T>.Filter.Eq(idFieldName, id);
            var update = Builders<T>.Update.Set(statusFieldName, status); // Assuming "Status" is the field you want to update
            var changeResult = await _collection.UpdateOneAsync(filter, update);
            if (changeResult.ModifiedCount > 0)
            {
                T updatedItem = await _collection.Find(filter).FirstOrDefaultAsync();
                return updatedItem;
            }
            else
            {
                throw new Exception("Failed to update item.");
            }
        }
        public async Task<IEnumerable<T>> GetPagedAsync(int skip, int pageSize, bool isAsc, string sortField)
        {
            var sortDefinition = isAsc
                ? Builders<T>.Sort.Ascending(sortField)
                : Builders<T>.Sort.Descending(sortField);
            var result = await _collection
                .Find(_ => true)
                .Sort(sortDefinition)
                .Skip(skip)
                .Limit(pageSize)
                .ToListAsync();

            return result;
        }
        public async Task<long> CountAsync()
        {
            return await _collection.CountDocumentsAsync(new BsonDocument());
        }
    }
}

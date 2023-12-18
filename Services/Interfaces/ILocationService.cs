using Models.Models;
using ModelViews.ViewModels;

namespace Services.Interfaces
{
    public interface ILocationService
    {
        Task<IEnumerable<Location>> GetLocation();
        Task<Location> AddLocation(LocationView locationView);
        Task<bool> RemoveLocation(string locationId);
        Task<Location> UpdateLocation(String id,LocationView locationView);
    }
}
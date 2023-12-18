using AutoMapper;
using Models.Models;
using ModelViews.ViewModels;
using MongoDB.Driver;
using Repository.Service;
using Tools.Tools;
using Services.Interfaces;
using Repository.Interface;

namespace Services.Services
{
    public class LocationService : ILocationService
    {
        private readonly IMapper _mapper;

        private readonly IRepository<Location> _locationRepos;
        public LocationService(IRepository<Location> locationRepos, IMapper mapper)
        {
            _mapper = mapper;
            _locationRepos = locationRepos;
        }
        public async Task<IEnumerable<Location>> GetLocation()
        {
            return await _locationRepos.GetAllAsync();
        }
        public async Task<Location> AddLocation(LocationView locationView)
        {
            Location location = _mapper.Map<Location>(locationView);
            location.Id = IdGenerator.GenerateId();
            return await _locationRepos.AddOneItem(location);
        }

        public async Task<bool> RemoveLocation(string locationId)
        {
            IEnumerable<Location> locations = await _locationRepos.GetByFilterAsync(l=>l.Id.Equals(locationId));
            if (!locations.Any())
            {
                throw new Tools.Tools.CustomException.DataNotFoundException($"Location with id {locationId} not found");
            }
            return await _locationRepos.RemoveItemByValue(locationId);
        }

        public async Task<Location> UpdateLocation(string id, LocationView locationView)
        {
            IEnumerable<Location> locations = await _locationRepos.GetByFilterAsync(l => l.Id.Equals(id));
            if (!locations.Any())
            {
                throw new Tools.Tools.CustomException.DataNotFoundException($"Location with id {id} not found");
            }
            Location location = _mapper.Map<Location>(locationView);
            location.Id = id;
            return await _locationRepos.UpdateItemByValue(id, location);
        }
    }
}

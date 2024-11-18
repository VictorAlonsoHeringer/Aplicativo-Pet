// AnimalService.cs
using MongoDB.Driver;
using Backend.Models;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class AnimalService
    {
        private readonly IMongoCollection<Animal> _animals;

        public AnimalService(IMongoClient mongoClient, IOptions<MongoDBSettings> settings)
        {
            var database = mongoClient.GetDatabase(settings.Value.DatabaseName);
            _animals = database.GetCollection<Animal>("Animals");
        }

        public async Task<Animal?> GetByIdAsync(string id) =>
            await _animals.Find(animal => animal.Id == id).FirstOrDefaultAsync();

        public async Task<List<Animal>> GetByTutorIdAsync(string tutorId) =>
            await _animals.Find(animal => animal.TutorId == tutorId).ToListAsync();

        public async Task CreateAsync(Animal animal) =>
            await _animals.InsertOneAsync(animal);
    }
}

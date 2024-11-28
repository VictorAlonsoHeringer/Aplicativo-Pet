using Backend.Models;
using MongoDB.Driver;
using Microsoft.Extensions.Options;

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

        // Retorna um animal pelo ID
        public async Task<Animal?> GetByIdAsync(string id)
        {
            try
            {
                return await _animals.Find(animal => animal.Id == id).FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao buscar animal por ID: {ex.Message}");
                throw new InvalidOperationException("Erro ao buscar animal no servidor.", ex);
            }
        }

        // Retorna todos os animais associados a um tutor
        public async Task<List<Animal>> GetByTutorIdAsync(string tutorId)
        {
            try
            {
                return await _animals.Find(animal => animal.TutorId == tutorId).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao buscar animais do tutor: {ex.Message}");
                throw new InvalidOperationException("Erro ao buscar animais do tutor no servidor.", ex);
            }
        }

        // Cria um novo animal
        public async Task CreateAsync(Animal animal)
        {
            try
            {
                await _animals.InsertOneAsync(animal);
                Console.WriteLine("Animal criado com sucesso.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao criar animal: {ex.Message}");
                throw new InvalidOperationException("Erro ao criar animal no servidor.", ex);
            }
        }
    }
}

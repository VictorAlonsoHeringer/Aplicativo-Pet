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

        // Atualiza um animal existente
        public async Task UpdateAsync(string id, Animal updatedAnimal)
        {
            try
            {
                var result = await _animals.ReplaceOneAsync(animal => animal.Id == id, updatedAnimal);

                if (result.MatchedCount == 0)
                {
                    throw new InvalidOperationException("Nenhum animal encontrado com o ID especificado.");
                }

                Console.WriteLine("Animal atualizado com sucesso.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao atualizar animal: {ex.Message}");
                throw new InvalidOperationException("Erro ao atualizar animal no servidor.", ex);
            }
        }

        // Remove um animal existente
        public async Task DeleteAsync(string id)
        {
            try
            {
                var result = await _animals.DeleteOneAsync(animal => animal.Id == id);

                if (result.DeletedCount == 0)
                {
                    throw new InvalidOperationException("Nenhum animal encontrado com o ID especificado.");
                }

                Console.WriteLine("Animal removido com sucesso.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao remover animal: {ex.Message}");
                throw new InvalidOperationException("Erro ao remover animal no servidor.", ex);
            }
        }
    }
}

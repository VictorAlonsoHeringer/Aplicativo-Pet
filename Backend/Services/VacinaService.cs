using Backend.Models;
using MongoDB.Driver;
using Microsoft.Extensions.Options;

namespace Backend.Services
{
    public class VacinaService
    {
        private readonly IMongoCollection<Vacina> _vacinas;

        public VacinaService(IMongoClient mongoClient, IOptions<MongoDBSettings> settings)
        {
            var database = mongoClient.GetDatabase(settings.Value.DatabaseName);
            _vacinas = database.GetCollection<Vacina>("Vacinas");
        }

        public async Task<List<Vacina>> GetAllByVeterinarioAsync(string veterinarioId)
        {
            if (string.IsNullOrEmpty(veterinarioId))
            {
                throw new ArgumentException("VeterinarioId não pode ser vazio.");
            }

            try
            {
                return await _vacinas.Find(v => v.VeterinarioId == veterinarioId).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao buscar vacinas para o veterinário: {ex.Message}");
                throw new InvalidOperationException("Erro ao buscar vacinas no servidor.", ex);
            }
        }

        public async Task<Vacina?> GetByIdAsync(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                throw new ArgumentException("ID não pode ser vazio.");
            }

            try
            {
                return await _vacinas.Find(v => v.Id == id).FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao buscar vacina por ID: {ex.Message}");
                throw new InvalidOperationException("Erro ao buscar vacina no servidor.", ex);
            }
        }

        public async Task CreateAsync(Vacina vacina)
        {
            if (string.IsNullOrEmpty(vacina.VeterinarioId) ||
                string.IsNullOrEmpty(vacina.Nome) ||
                string.IsNullOrEmpty(vacina.Tipo) ||
                vacina.Validade == default)
            {
                throw new InvalidOperationException("Todos os campos obrigatórios devem ser preenchidos.");
            }

            try
            {
                await _vacinas.InsertOneAsync(vacina);
                Console.WriteLine("Vacina criada com sucesso.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao criar vacina: {ex.Message}");
                throw new InvalidOperationException("Erro ao criar vacina no servidor.", ex);
            }
        }

        public async Task RemoveAsync(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                throw new ArgumentException("ID não pode ser vazio.");
            }

            try
            {
                var result = await _vacinas.DeleteOneAsync(v => v.Id == id);
                if (result.DeletedCount == 0)
                {
                    throw new InvalidOperationException($"Nenhuma vacina encontrada com o ID: {id}");
                }
                Console.WriteLine($"Vacina com ID={id} removida com sucesso.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao remover vacina: {ex.Message}");
                throw new InvalidOperationException("Erro ao remover vacina no servidor.", ex);
            }
        }
    }
}

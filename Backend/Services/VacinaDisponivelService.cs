using Backend.Models;
using MongoDB.Driver;
using Microsoft.Extensions.Options;

namespace Backend.Services
{
    public class VacinaDisponivelService
    {
        private readonly IMongoCollection<VacinaDisponivel> _vacinasDisponiveis;

        public VacinaDisponivelService(IMongoClient mongoClient, IOptions<MongoDBSettings> settings)
        {
            var database = mongoClient.GetDatabase(settings.Value.DatabaseName);
            _vacinasDisponiveis = database.GetCollection<VacinaDisponivel>("VacinasDisponiveis");
        }

        public async Task<List<VacinaDisponivel>> GetAllAsync()
        {
            try
            {
                return await _vacinasDisponiveis.Find(_ => true).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao buscar vacinas disponíveis: {ex.Message}");
                throw new InvalidOperationException("Erro ao buscar vacinas disponíveis no servidor.", ex);
            }
        }

        public async Task<VacinaDisponivel?> GetByIdAsync(string id)
        {
            try
            {
                return await _vacinasDisponiveis.Find(v => v.Id == id).FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao buscar vacina por ID: {ex.Message}");
                throw new InvalidOperationException("Erro ao buscar vacina por ID no servidor.", ex);
            }
        }

        public async Task<List<VacinaDisponivel>> GetByClinicaAsync(string clinica)
        {
            try
            {
                return await _vacinasDisponiveis.Find(v => v.Clinica == clinica).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao buscar vacinas pela clínica: {ex.Message}");
                throw new InvalidOperationException("Erro ao buscar vacinas pela clínica no servidor.", ex);
            }
        }

        public async Task CreateAsync(VacinaDisponivel vacinaDisponivel)
        {
            try
            {
                if (string.IsNullOrEmpty(vacinaDisponivel.VeterinarioId))
                {
                    throw new InvalidOperationException("VeterinarioId é obrigatório para criar uma vacina disponível.");
                }

                await _vacinasDisponiveis.InsertOneAsync(vacinaDisponivel);
                Console.WriteLine("Vacina disponível criada com sucesso.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao criar vacina disponível: {ex.Message}");
                throw new InvalidOperationException("Erro ao criar vacina disponível no servidor.", ex);
            }
        }
    }
}

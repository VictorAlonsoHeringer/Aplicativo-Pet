using Backend.Models;
using MongoDB.Driver;
using Microsoft.Extensions.Options;
using System;

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
        try
        {
            if (string.IsNullOrEmpty(veterinarioId))
            {
                throw new ArgumentException("VeterinarioId não pode ser vazio.");
            }

            Console.WriteLine($"Buscando vacinas para VeterinarioId={veterinarioId}");
            var vacinas = await _vacinas.Find(v => v.VeterinarioId == veterinarioId).ToListAsync();
            return vacinas;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erro ao buscar vacinas: {ex.Message}");
            throw new InvalidOperationException("Erro ao buscar vacinas no servidor.", ex);
        }
    }

    public async Task CreateAsync(Vacina vacina)
    {
        try
        {
            if (string.IsNullOrEmpty(vacina.VeterinarioId) || 
                string.IsNullOrEmpty(vacina.Nome) || 
                string.IsNullOrEmpty(vacina.Tipo) || 
                vacina.Validade == default)
            {
                Console.WriteLine($"Dados inválidos: Nome={vacina.Nome}, Tipo={vacina.Tipo}, Validade={vacina.Validade}, VeterinarioId={vacina.VeterinarioId}");
                throw new InvalidOperationException("Todos os campos obrigatórios devem ser preenchidos.");
            }

            Console.WriteLine($"Criando vacina: Nome={vacina.Nome}, Tipo={vacina.Tipo}, Validade={vacina.Validade}, VeterinarioId={vacina.VeterinarioId}");
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
        try
        {
            Console.WriteLine($"Removendo vacina com ID={id}");
            var result = await _vacinas.DeleteOneAsync(v => v.Id == id);
            if (result.DeletedCount == 0)
            {
                throw new InvalidOperationException($"Nenhuma vacina encontrada com o ID: {id}");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erro ao remover vacina: {ex.Message}");
            throw new InvalidOperationException("Erro ao remover vacina no servidor.", ex);
        }
    }
}

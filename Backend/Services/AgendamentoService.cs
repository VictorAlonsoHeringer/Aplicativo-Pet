using Backend.Models;
using MongoDB.Driver;
using Microsoft.Extensions.Options;

public class AgendamentoService
{
    private readonly IMongoCollection<Agendamento> _agendamentos;
    private readonly SolicitacaoAgendamentoService _solicitacaoService;

    public AgendamentoService(IMongoClient mongoClient, 
                              IOptions<MongoDBSettings> settings, 
                              SolicitacaoAgendamentoService solicitacaoService)
    {
        var database = mongoClient.GetDatabase(settings.Value.DatabaseName);
        _agendamentos = database.GetCollection<Agendamento>("Agendamentos");
        _solicitacaoService = solicitacaoService;
    }

    public async Task CreateAsync(Agendamento agendamento)
    {
        if (agendamento == null)
        {
            Console.WriteLine("[ERRO] Tentativa de criar um agendamento nulo.");
            throw new ArgumentNullException(nameof(agendamento));
        }

        Console.WriteLine($"[LOG] Criando agendamento para TutorId: {agendamento.TutorId}");

        try
        {
            await _agendamentos.InsertOneAsync(agendamento);
            Console.WriteLine($"[LOG] Agendamento criado com sucesso: ID {agendamento.Id}");

            var solicitacao = new SolicitacaoAgendamento
            {
                NomeTutor = agendamento.NomeTutor,
                TutorId = agendamento.TutorId,
                NomeAnimal = agendamento.NomeAnimal,
                Vacina = agendamento.NomeVacina,
                VacinaId = agendamento.VacinaId,
                EnderecoClinica = agendamento.EnderecoClinica,
                VeterinarioId = agendamento.VeterinarioId,
                Data = agendamento.Data,
                Horario = agendamento.Horario,
                Status = "Pendente",
                AgendamentoId = agendamento.Id
            };

            await _solicitacaoService.CreateAsync(solicitacao);
            Console.WriteLine($"[LOG] Solicitação correspondente criada com sucesso para VeterinarioId: {agendamento.VeterinarioId}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[ERRO] Falha ao criar agendamento ou solicitação: {ex.Message}");
            throw new Exception("Erro ao criar agendamento e solicitação no banco de dados.", ex);
        }
    }

    public async Task<List<Agendamento>> GetByTutorIdAsync(string tutorId)
    {
        if (string.IsNullOrEmpty(tutorId))
        {
            Console.WriteLine("[ERRO] TutorId não pode ser vazio.");
            throw new ArgumentException("TutorId inválido.");
        }

        Console.WriteLine($"[LOG] Buscando agendamentos para TutorId: {tutorId}");

        try
        {
            var agendamentos = await _agendamentos.Find(a => a.TutorId == tutorId).ToListAsync();
            Console.WriteLine($"[LOG] Total de agendamentos encontrados para TutorId {tutorId}: {agendamentos.Count}");
            return agendamentos;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[ERRO] Falha ao buscar agendamentos: {ex.Message}");
            throw new Exception("Erro ao buscar agendamentos no banco de dados.", ex);
        }
    }
}

using Backend.Models;
using MongoDB.Driver;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public class SolicitacaoAgendamentoService
{
    private readonly IMongoCollection<SolicitacaoAgendamento> _solicitacoes;
    private readonly IMongoCollection<Agendamento> _agendamentos;

    public SolicitacaoAgendamentoService(IMongoClient mongoClient, IOptions<MongoDBSettings> settings)
    {
        var database = mongoClient.GetDatabase(settings.Value.DatabaseName);
        _solicitacoes = database.GetCollection<SolicitacaoAgendamento>("SolicitacoesAgendamentos");
        _agendamentos = database.GetCollection<Agendamento>("Agendamentos");
    }

    // Busca solicitações pendentes para um VeterinarioId específico
    public async Task<List<SolicitacaoAgendamento>> GetAtivasAsync(string veterinarioId)
    {
        if (string.IsNullOrWhiteSpace(veterinarioId))
        {
            Console.WriteLine("[ERRO] VeterinarioId não pode ser vazio.");
            return new List<SolicitacaoAgendamento>();
        }

        Console.WriteLine($"[LOG] Buscando solicitações pendentes para VeterinarioId: {veterinarioId}");

        try
        {
            var solicitacoes = await _solicitacoes
                .Find(s => s.VeterinarioId == veterinarioId.Trim() && s.Status == "Pendente")
                .ToListAsync();

            Console.WriteLine($"[LOG] Total de solicitações pendentes encontradas para {veterinarioId}: {solicitacoes.Count}");
            return solicitacoes;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[ERRO] Falha ao buscar solicitações no banco: {ex.Message}");
            throw new Exception("Erro ao buscar solicitações do banco de dados.", ex);
        }
    }

    // Cria uma nova solicitação no banco de dados
    public async Task CreateAsync(SolicitacaoAgendamento solicitacao)
    {
        if (solicitacao == null)
        {
            Console.WriteLine("[ERRO] Tentativa de criar uma solicitação nula.");
            throw new ArgumentNullException(nameof(solicitacao));
        }

        Console.WriteLine($"[LOG] Criando nova solicitação para VeterinarioId: {solicitacao.VeterinarioId}");

        solicitacao.Status = "Pendente"; // Garante que o status seja "Pendente"

        try
        {
            await _solicitacoes.InsertOneAsync(solicitacao);
            Console.WriteLine($"[LOG] Solicitação criada com sucesso: ID {solicitacao.Id}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[ERRO] Falha ao criar solicitação: {ex.Message}");
            throw new Exception("Erro ao criar solicitação no banco de dados.", ex);
        }
    }

    // Atualiza o status de uma solicitação e sincroniza com a coleção de Agendamentos
    public async Task UpdateStatusAsync(string solicitacaoId, string status)
    {
        if (string.IsNullOrWhiteSpace(solicitacaoId))
        {
            Console.WriteLine("[ERRO] ID da solicitação para atualização não pode ser vazio.");
            throw new ArgumentException("ID inválido.");
        }

        Console.WriteLine($"[LOG] Atualizando status da solicitação ID {solicitacaoId} para '{status}'");

        try
        {
            var solicitacao = await _solicitacoes.Find(s => s.Id == solicitacaoId).FirstOrDefaultAsync();

            if (solicitacao == null)
            {
                Console.WriteLine($"[ERRO] Solicitação com ID {solicitacaoId} não encontrada.");
                return;
            }

            solicitacao.Status = status;

            await _solicitacoes.ReplaceOneAsync(s => s.Id == solicitacaoId, solicitacao);
            Console.WriteLine($"[LOG] Status da solicitação ID {solicitacaoId} atualizado para '{status}'");

            // Atualizar o status correspondente na coleção Agendamentos usando AgendamentoId
            var agendamentoResult = await _agendamentos.UpdateOneAsync(
                a => a.Id == solicitacao.AgendamentoId,
                Builders<Agendamento>.Update.Set(a => a.Status, status)
            );

            if (agendamentoResult.ModifiedCount > 0)
            {
                Console.WriteLine($"[LOG] Status do agendamento correspondente atualizado para '{status}'");
            }
            else
            {
                Console.WriteLine($"[ERRO] Agendamento correspondente com ID {solicitacao.AgendamentoId} não encontrado para atualização.");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[ERRO] Falha ao atualizar status da solicitação: {ex.Message}");
            throw;
        }
    }
}

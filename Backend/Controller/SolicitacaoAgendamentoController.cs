using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Services;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/solicitacaoagendamento")]
    public class SolicitacaoAgendamentoController : ControllerBase
    {
        private readonly SolicitacaoAgendamentoService _solicitacaoService;

        public SolicitacaoAgendamentoController(SolicitacaoAgendamentoService solicitacaoService)
        {
            _solicitacaoService = solicitacaoService;
        }

        [HttpGet("{veterinarioId}")]
        public async Task<IActionResult> GetSolicitacoes(string veterinarioId)
        {
            if (string.IsNullOrWhiteSpace(veterinarioId))
            {
                Console.WriteLine("[ERRO] VeterinarioId não fornecido.");
                return BadRequest(new { message = "Veterinário ID não fornecido." });
            }

            Console.WriteLine($"[LOG] Iniciando consulta de solicitações para VeterinarioId: {veterinarioId}");

            try
            {
                var solicitacoes = await _solicitacaoService.GetAtivasAsync(veterinarioId);

                if (!solicitacoes.Any())
                {
                    Console.WriteLine($"[LOG] Nenhuma solicitação encontrada para VeterinarioId: {veterinarioId}");
                    return Ok(new List<SolicitacaoAgendamento>()); // Retorna uma lista vazia
                }

                Console.WriteLine($"[LOG] {solicitacoes.Count} solicitações encontradas para VeterinarioId: {veterinarioId}");
                return Ok(solicitacoes);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERRO] Falha ao buscar solicitações: {ex.Message}");
                return StatusCode(500, new { message = "Erro ao buscar solicitações." });
            }
        }

        [HttpPost("aprovar/{id}")]
        public async Task<IActionResult> AprovarSolicitacao(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                return BadRequest(new { message = "ID da solicitação não fornecido." });
            }

            Console.WriteLine($"[LOG] Aprovando solicitação com ID: {id}");

            try
            {
                await _solicitacaoService.UpdateStatusAsync(id, "Aprovado");
                Console.WriteLine($"[LOG] Solicitação ID {id} aprovada com sucesso.");
                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERRO] Falha ao aprovar solicitação: {ex.Message}");
                return StatusCode(500, new { message = "Erro ao aprovar solicitação." });
            }
        }

        [HttpPost("recusar/{id}")]
        public async Task<IActionResult> RecusarSolicitacao(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                return BadRequest(new { message = "ID da solicitação não fornecido." });
            }

            Console.WriteLine($"[LOG] Recusando solicitação com ID: {id}");

            try
            {
                await _solicitacaoService.UpdateStatusAsync(id, "Recusado");
                Console.WriteLine($"[LOG] Solicitação ID {id} recusada com sucesso.");
                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERRO] Falha ao recusar solicitação: {ex.Message}");
                return StatusCode(500, new { message = "Erro ao recusar solicitação." });
            }
        }
    }
}

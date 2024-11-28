using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Services;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/agendamentos")]
    public class AgendamentoController : ControllerBase
    {
        private readonly AgendamentoService _agendamentoService;

        public AgendamentoController(AgendamentoService agendamentoService)
        {
            _agendamentoService = agendamentoService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Agendamento agendamento)
        {
            if (string.IsNullOrWhiteSpace(agendamento.TutorId) ||
                string.IsNullOrWhiteSpace(agendamento.NomeAnimal) ||
                string.IsNullOrWhiteSpace(agendamento.VacinaId) ||
                agendamento.Data == default ||
                string.IsNullOrWhiteSpace(agendamento.Horario))
            {
                return BadRequest(new { message = "Preencha todos os campos obrigatórios." });
            }

            try
            {
                await _agendamentoService.CreateAsync(agendamento);
                return CreatedAtAction(nameof(GetByTutorId), new { tutorId = agendamento.TutorId }, agendamento);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERRO] Falha ao criar agendamento: {ex.Message}");
                return StatusCode(500, new { message = "Erro ao criar agendamento. Tente novamente mais tarde." });
            }
        }

        [HttpGet("{tutorId}")]
        public async Task<IActionResult> GetByTutorId(string tutorId)
        {
            if (string.IsNullOrWhiteSpace(tutorId))
            {
                return BadRequest(new { message = "TutorId é obrigatório." });
            }

            try
            {
                var agendamentos = await _agendamentoService.GetByTutorIdAsync(tutorId);

                if (!agendamentos.Any())
                {
                    return NotFound(new { message = "Nenhum agendamento encontrado para este tutor." });
                }

                return Ok(agendamentos);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERRO] Falha ao buscar agendamentos para TutorId {tutorId}: {ex.Message}");
                return StatusCode(500, new { message = "Erro ao buscar agendamentos. Tente novamente mais tarde." });
            }
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Services;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VacinaController : ControllerBase
    {
        private readonly VacinaService _vacinaService;
        private readonly VeterinarioService _veterinarioService;
        private readonly VacinaDisponivelService _vacinaDisponivelService;

        public VacinaController(
            VacinaService vacinaService,
            VeterinarioService veterinarioService,
            VacinaDisponivelService vacinaDisponivelService)
        {
            _vacinaService = vacinaService;
            _veterinarioService = veterinarioService;
            _vacinaDisponivelService = vacinaDisponivelService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Vacina vacina)
        {
            try
            {
                if (string.IsNullOrEmpty(vacina.VeterinarioId))
                {
                    return BadRequest(new { message = "VeterinarioId é obrigatório." });
                }

                var veterinario = await _veterinarioService.GetAsync(vacina.VeterinarioId);
                if (veterinario == null)
                {
                    return BadRequest(new { message = "Veterinário não encontrado." });
                }

                vacina.NomeVeterinario = veterinario.Nome;
                vacina.Clinica = veterinario.Clinicas.FirstOrDefault() ?? "Clínica não especificada";

                await _vacinaService.CreateAsync(vacina);

                var vacinaDisponivel = new VacinaDisponivel
                {
                    Nome = vacina.Nome,
                    Tipo = vacina.Tipo,
                    Clinica = vacina.Clinica,
                    Endereco = veterinario.Endereco ?? "Endereço não especificado",
                    Veterinario = vacina.NomeVeterinario,
                    VeterinarioId = vacina.VeterinarioId,
                    DataDisponivel = vacina.Validade
                };

                await _vacinaDisponivelService.CreateAsync(vacinaDisponivel);

                return CreatedAtAction(nameof(Create), new { id = vacina.Id }, vacina);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao criar vacina: {ex.Message}");
                return StatusCode(500, new { message = "Erro ao cadastrar vacina." });
            }
        }

        [HttpGet("veterinario/{veterinarioId}")]
        public async Task<IActionResult> GetByVeterinario(string veterinarioId)
        {
            try
            {
                var vacinas = await _vacinaService.GetAllByVeterinarioAsync(veterinarioId);
                return Ok(vacinas);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao buscar vacinas: {ex.Message}");
                return StatusCode(500, new { message = "Erro ao buscar vacinas." });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                var vacina = await _vacinaService.GetByIdAsync(id);

                if (vacina == null)
                {
                    return NotFound(new { message = "Vacina não encontrada." });
                }

                return Ok(vacina);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao buscar vacina por ID: {ex.Message}");
                return StatusCode(500, new { message = "Erro ao buscar vacina." });
            }
        }
    }
}

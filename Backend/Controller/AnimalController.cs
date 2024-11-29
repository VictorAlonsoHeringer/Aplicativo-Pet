using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnimalController : ControllerBase
    {
        private readonly AnimalService _animalService;

        public AnimalController(AnimalService animalService)
        {
            _animalService = animalService;
        }

        // Método para obter um animal por ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Animal>> GetById(string id)
        {
            var animal = await _animalService.GetByIdAsync(id);

            if (animal == null)
            {
                return NotFound(new { message = "Animal não encontrado." });
            }

            return Ok(animal);
        }

        // Método para obter todos os animais de um tutor por TutorId
        [HttpGet("tutor/{tutorId}")]
        public async Task<ActionResult<List<Animal>>> GetByTutorId(string tutorId)
        {
            var animals = await _animalService.GetByTutorIdAsync(tutorId);

            if (animals == null || animals.Count == 0)
            {
                return NotFound(new { message = "Nenhum animal encontrado para este tutor." });
            }

            return animals;
        }


        // Método para criar um novo animal
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Animal animal)
        {
            if (string.IsNullOrEmpty(animal.TutorId))
            {
                return BadRequest(new { message = "TutorId é obrigatório." });
            }

            if (string.IsNullOrEmpty(animal.Nome))
            {
                return BadRequest(new { message = "O nome do animal é obrigatório." });
            }

            await _animalService.CreateAsync(animal);
            return CreatedAtAction(nameof(GetById), new { id = animal.Id }, animal);
        }

        // Atualizar um animal
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] Animal updatedAnimal)
        {
            var animal = await _animalService.GetByIdAsync(id);

            if (animal == null)
            {
                return NotFound(new { message = "Animal não encontrado." });
            }

            updatedAnimal.Id = id; // Garante que o ID seja mantido
            await _animalService.UpdateAsync(id, updatedAnimal);

            return NoContent();
        }

        // Deletar um animal
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var animal = await _animalService.GetByIdAsync(id);

            if (animal == null)
            {
                return NotFound(new { message = "Animal não encontrado." });
            }

            await _animalService.DeleteAsync(id);

            return NoContent();
        }


    }
}

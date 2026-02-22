using Microsoft.AspNetCore.Mvc;
using FlightAPI.Models;
using FlightAPI.Data;

namespace FlightAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FlightsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FlightsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAllFlights()
        {
            var flights = _context.Flights.ToList();
            return Ok(flights);
        }

        [HttpGet("{ticketId}")]
        public IActionResult GetFlightById(string ticketId)
        {
            var flight = _context.Flights.FirstOrDefault(f => f.TicketId == ticketId);
            if (flight == null) return NotFound(new { Message = $"Ticket {ticketId} not found." });
            return Ok(flight);
        }

        [HttpGet("date/{date}")]
        public IActionResult GetFlightsByDate(string date)
        {
            var flights = _context.Flights.Where(f => f.DepartureTime != null && f.DepartureTime.StartsWith(date)).ToList();
            if (flights.Count == 0) return NotFound(new { Message = $"No flights found for date {date}." });
            return Ok(flights);
        }

        // 🌟 NEW DOORWAY: The Intake Tray for Booking Flights!
        [HttpPost]
        public IActionResult BookNewFlight([FromBody] Flight newFlight)
        {
            // 1. Check if the ticket ID already exists in the cabinet
            if (_context.Flights.Any(f => f.TicketId == newFlight.TicketId))
            {
                return BadRequest(new { Message = "A ticket with this ID already exists!" });
            }

            // 2. Set the default status
            newFlight.Status = "Scheduled";

            // 3. Put it in the drawer and lock the cabinet (Save)
            _context.Flights.Add(newFlight);
            _context.SaveChanges();

            // 4. Return a success message!
            return Ok(newFlight);
        }
    }
}
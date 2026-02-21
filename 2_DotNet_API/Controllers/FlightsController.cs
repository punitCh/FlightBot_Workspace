using Microsoft.AspNetCore.Mvc;
using FlightAPI.Models;

namespace FlightAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FlightsController : ControllerBase
    {
        // Our dummy database for learning purposes
        private static readonly List<Flight> DummyFlights = new List<Flight>
        {
            new Flight { TicketId = "TX-101", PassengerName = "Ankit", Origin = "DEL", Destination = "JFK", DepartureTime = "2026-03-01T08:00:00", Status = "On Time" },
            new Flight { TicketId = "TX-202", PassengerName = "Sarah", Origin = "LHR", Destination = "DXB", DepartureTime = "2026-03-05T14:30:00", Status = "Delayed" },
            new Flight { TicketId = "TX-303", PassengerName = "Ankit", Origin = "JFK", Destination = "DEL", DepartureTime = "2026-03-15T22:15:00", Status = "Scheduled" }
        };

        [HttpGet]
        public IActionResult GetAllFlights()
        {
            return Ok(DummyFlights);
        }

        [HttpGet("{ticketId}")]
        public IActionResult GetFlightById(string ticketId)
        {
            var flight = DummyFlights.FirstOrDefault(f => f.TicketId.Equals(ticketId, StringComparison.OrdinalIgnoreCase));
            
            if (flight == null)
            {
                return NotFound(new { Message = $"Ticket {ticketId} not found." });
            }

            return Ok(flight);
        }
    }
}
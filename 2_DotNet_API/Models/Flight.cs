namespace FlightAPI.Models
{
    public class Flight
    {
        public string TicketId { get; set; }
        public string PassengerName { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string DepartureTime { get; set; }
        public string Status { get; set; }
    }
}
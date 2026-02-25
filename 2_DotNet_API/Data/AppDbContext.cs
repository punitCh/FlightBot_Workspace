using Microsoft.EntityFrameworkCore;
using FlightAPI.Models;

namespace FlightAPI.Data
{
    // The DbContext is the official bridge between your C# app and the Database
    public class AppDbContext : DbContext
    {   
        public DbSet<User> Users { get; set; }
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // This tells the database to create a table called "Flights"
        public DbSet<Flight> Flights { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Tell the database that TicketId is our unique Primary Key
            modelBuilder.Entity<Flight>().HasKey(f => f.TicketId);

            // Seed the database with our starting data!
            modelBuilder.Entity<Flight>().HasData(
                new Flight { TicketId = "TX-101", PassengerName = "Ankit", Origin = "DEL", Destination = "JFK", DepartureTime = "2026-03-01T08:00:00", Status = "On Time" },
                new Flight { TicketId = "TX-202", PassengerName = "Sarah", Origin = "LHR", Destination = "DXB", DepartureTime = "2026-03-05T14:30:00", Status = "Delayed" },
                new Flight { TicketId = "TX-404", PassengerName = "Priya", Origin = "BOM", Destination = "LHR", DepartureTime = "2026-03-01T10:30:00", Status = "On Time" }
            );
        }
    }
}
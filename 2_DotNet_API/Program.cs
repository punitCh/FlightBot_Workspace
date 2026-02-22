using Microsoft.EntityFrameworkCore;
using FlightAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// 🌟 NEW: Tell the app to build a SQLite database named "flights.db"
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=flights.db"));

// 1. ADD CORS POLICY (The Permission Slip)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// 2. TELL THE APP TO USE THE CORS POLICY
app.UseCors("AllowAll");

app.MapControllers();

app.Run();
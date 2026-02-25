# 1. Grab a Linux computer with the Microsoft .NET 8 tools installed
FROM mcr.microsoft.com/dotnet/sdk:10.0

# 2. Create a folder inside the container
WORKDIR /app

# 3. Copy everything! (This includes your C# code AND your flights.db file)
COPY . .

# 4. Have the robot download any missing C# tools
RUN dotnet restore

# 5. Force the container to use Port 5048 (so your Python AI can still find it!)
ENV ASPNETCORE_URLS=http://0.0.0.0:5048
EXPOSE 5048

# 6. The final command to start the Vault!
CMD ["dotnet", "run"]
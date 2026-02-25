# 1. Use a lightweight Python environment
FROM python:3.11-slim

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy your requirements and install them
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. Copy your agent.py and other files
COPY . .

# 5. Start the agent
CMD ["python", "agent.py"]
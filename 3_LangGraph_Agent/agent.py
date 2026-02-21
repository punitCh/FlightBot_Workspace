import requests
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from langchain_core.tools import tool
from langchain_ollama import ChatOllama
from langgraph.prebuilt import create_react_agent

# 1. SETUP FASTAPI (The Telephone Line)
app = FastAPI()

# Allow React (which will run on a different port) to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In a real app, you'd put your React URL here
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the shape of the message coming from React
class ChatRequest(BaseModel):
    message: str

# 2. THE TOOL
@tool
def fetch_flight_ticket(ticket_id: str) -> str:
    """Use this tool to fetch flight ticket details using a ticket ID (like TX-101 or TX-202)."""
    print(f"\n[🔧 TOOL ACTIVATED] Fetching data from .NET API for: {ticket_id}...")
    url = f"http://localhost:5048/api/flights/{ticket_id}"
    response = requests.get(url)
    
    if response.status_code == 200:
        return response.text
    else:
        return f"Sorry, could not find a ticket with ID {ticket_id}."

# 3. THE LLM & GRAPH
llm = ChatOllama(model="llama3.2", temperature=0)
tools = [fetch_flight_ticket]
agent_executor = create_react_agent(llm, tools)

# 4. THE ENDPOINT (The phone number React will call)
@app.post("/chat")
def chat_with_agent(request: ChatRequest):
    print(f"Received message: {request.message}")
    
    # Run the graph with the message from the user
    result = agent_executor.invoke(
        {"messages": [("user", request.message)]}
    )
    
    # Extract just the final text response from the AI
    final_answer = result["messages"][-1].content
    return {"response": final_answer}
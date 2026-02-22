import requests
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from langchain_core.tools import tool
from langchain_ollama import ChatOllama
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

# ---------------------------------------------------------
# 🛠️ THE DETECTIVE'S TOOLBELT
# ---------------------------------------------------------
@tool
def fetch_flight_ticket(ticket_id: str) -> str:
    """Use this tool to fetch flight ticket details using a ticket ID (like TX-101)."""
    url = f"http://localhost:5048/api/flights/{ticket_id}"
    response = requests.get(url)
    if response.status_code == 200: return response.text
    return f"Sorry, could not find a ticket with ID {ticket_id}."

@tool
def search_flights_by_date(date: str) -> str:
    """Use this tool to find all available flights on a specific date (YYYY-MM-DD)."""
    url = f"http://localhost:5048/api/flights/date/{date}"
    response = requests.get(url)
    if response.status_code == 200: return response.text
    return f"Sorry, no flights found for the date {date}."

# 🌟 NEW TOOL: The Pen and Stamp to book flights!
@tool
def book_new_flight(ticket_id: str, passenger_name: str, origin: str, destination: str, departure_time: str) -> str:
    """Use this tool to book a brand new flight in the database. 
    departure_time MUST be in format: YYYY-MM-DDTHH:MM:SS
    """
    print(f"\n[🔧 TOOL 3] Booking flight for {passenger_name}...")
    url = "http://localhost:5048/api/flights"
    
    # Pack the envelope with the new flight details
    payload = {
        "ticketId": ticket_id,
        "passengerName": passenger_name,
        "origin": origin,
        "destination": destination,
        "departureTime": departure_time,
        "status": "Scheduled"
    }
    
    # Send it to the .NET Intake Tray!
    response = requests.post(url, json=payload)
    
    if response.status_code == 200:
        return "SUCCESS! Flight booked. Details: " + response.text
    return "FAILED to book flight. " + response.text

# ---------------------------------------------------------
# 🧠 THE AI BRAIN & MEMORY
# ---------------------------------------------------------
llm = ChatOllama(model="llama3.2", temperature=0)

# 🌟 Don't forget to add the new tool to the belt!
tools = [fetch_flight_ticket, search_flights_by_date, book_new_flight]
agent_memory = MemorySaver()
agent_executor = create_react_agent(llm, tools, checkpointer=agent_memory)

# ---------------------------------------------------------
# 📞 THE TELEPHONE LINE
# ---------------------------------------------------------
@app.post("/chat")
def chat_with_agent(request: ChatRequest):
    config = {"configurable": {"thread_id": "ankit_session"}}
    
    system_prompt = """
    You are a helpful AI flight assistant. The current year is 2026. 
    If a user wants to book a flight, ask them for their name, origin, destination, and date/time if they didn't provide it.
    If they do not provide a Ticket ID, make one up starting with 'TX-' and a random 3 digit number.
    Format dates as 'YYYY-MM-DDTHH:MM:SS' before booking.
    """
    
    result = agent_executor.invoke(
        {"messages": [("system", system_prompt), ("user", request.message)]},
        config=config
    )
    
    return {"response": result["messages"][-1].content}
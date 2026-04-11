from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.ai_parser import get_groq_client

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    tone: str = "normal"


@router.post("/chat")
async def chat(request: ChatRequest):
    """Chat endpoint for AI coaching with tone support."""
    try:
        client = get_groq_client()

        # System prompt based on tone
        if request.tone == "genz":
            system_prompt = """You are a Gen-Z study coach helping students with their syllabus deadlines and assignments. 
Respond in Gen-Z slang and style. Use casual language like 'bro', 'lowkey', 'fr fr', 'no cap', 'it's giving', 'get cooked', etc.
Be sarcastic but actually helpful. Keep responses concise (1-3 sentences max).
You're supportive but not preachy. You roast bad habits but then help them fix it."""
        else:
            system_prompt = """You are a helpful study coach assisting students with their syllabus deadlines and time management.
Provide clear, practical advice. Be supportive and encouraging. Keep responses concise."""

        message = request.message

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            max_tokens=256,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message},
            ],
            temperature=0.7,
        )

        reply = response.choices[0].message.content
        return {"reply": reply}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")

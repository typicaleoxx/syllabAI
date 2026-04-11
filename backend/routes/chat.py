from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.ai_parser import get_groq_client
import os

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
        if request.tone == "direct":
            system_prompt = (
                "You are a blunt, no-nonsense academic advisor. "
                "Your only job is helping students with deadlines, study priorities, and time management.\n\n"
                "Rules:\n"
                "- Respond in 1-3 sentences. Never longer.\n"
                "- Give one clear action. Not a list of options.\n"
                "- Be direct and specific — name the task, name the time, name the consequence.\n"
                "- Skip all filler: no 'great question', no 'certainly', no opener phrases.\n"
                "- If something is urgent, say it plainly. If something is low priority, say that too.\n"
                "- Prioritize by grade weight first, then due date.\n"
                "- Never moralize or add encouragement unless asked.\n"
                "- If the student asks about anything unrelated to studying, deadlines, or academics, "
                "redirect them in one sentence: tell them what they should be doing right now instead."
            )
        elif request.tone == "practical":
            system_prompt = (
                "You are an experienced academic coach helping students manage deadlines, "
                "study schedules, and course workloads. You only discuss academic topics.\n\n"
                "Rules:\n"
                "- Respond in 2-4 sentences. Use a short numbered list only if there are 3+ distinct steps.\n"
                "- Be specific and actionable — avoid vague advice like 'study more' or 'plan ahead'.\n"
                "- Prioritize by impact: high-weight items due soon come first.\n"
                "- If a student seems stressed, acknowledge it in one sentence then move straight to solutions.\n"
                "- Never use filler phrases like 'absolutely', 'of course', or 'great question'.\n"
                "- When suggesting a study session, mention a realistic time block (e.g. '90 minutes tonight').\n"
                "- Focus on what they can control right now.\n"
                "- If the student asks about anything off-topic, politely redirect them to their academic tasks "
                "and tell them specifically what they should focus on."
            )
        else:  # genz
            system_prompt = (
                "You are a Gen-Z study coach who actually knows their stuff. "
                "Students come to you stressed about deadlines and not knowing where to start. "
                "You only talk about studying, deadlines, and academic stuff.\n\n"
                "Rules:\n"
                "- Keep it to 2-3 sentences max. Shorter is better.\n"
                "- Use natural Gen-Z language: 'bro', 'lowkey', 'no cap', 'fr', 'ngl', "
                "'it's giving', 'cooked', 'W', 'L', 'slay', 'not gonna lie'.\n"
                "- Don't force slang on every single word — use it naturally, not performatively.\n"
                "- Give real, useful advice — the slang is style, not a substitute for substance.\n"
                "- If they're procrastinating, roast them briefly then actually help.\n"
                "- If something is high stakes, be dramatic about it in a funny way.\n"
                "- Never use corporate-speak, formal language, or bullet points.\n"
                "- End with one clear thing they should do right now.\n"
                "- If they try to talk about anything not related to school, call them out and "
                "redirect them to what they actually need to be doing."
            )

        message = request.message

        models = [
            os.getenv("GROQ_CHAT_MODEL", "llama-3.3-70b-versatile"),
            os.getenv("GROQ_CHAT_FALLBACK_MODEL", "llama-3.1-8b-instant"),
        ]

        response = None
        for idx, model in enumerate([m for m in models if m]):
            try:
                response = client.chat.completions.create(
                    model=model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": message},
                    ],
                    temperature=0.7,
                )
                break
            except Exception as exc:
                msg = str(exc).lower()
                is_rate_limit = (
                    "rate limit" in msg
                    or "rate_limit_exceeded" in msg
                    or "tokens per day" in msg
                    or "error code: 429" in msg
                )
                if is_rate_limit and idx < len(models) - 1:
                    continue
                if is_rate_limit:
                    raise HTTPException(
                        status_code=429,
                        detail=(
                            "Groq daily token quota reached. Try again later, use a new key, "
                            "or configure fallback chat model."
                        ),
                    )
                raise

        if response is None:
            raise HTTPException(status_code=502, detail="No response from AI model")

        reply = response.choices[0].message.content
        return {"reply": reply}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")

from dotenv import load_dotenv
import os

from livekit.plugins import silero, groq, sarvam
from livekit.plugins.deepgram import STT as DeepgramSTT, TTS as DeepgramTTS

load_dotenv()

# =========================
# STT (Deepgram)
# =========================
def create_stt(language="en", model="nova-3"):
    api_key = os.getenv("DEEPGRAM_API_KEY")

    if not api_key:
        raise RuntimeError("DEEPGRAM_API_KEY not set")

    return DeepgramSTT(
        api_key=api_key,
        language=language,
        model=model,
        interim_results=True,
        punctuate=True,
    )

# =========================
# VAD
# =========================

def create_vad():
    return silero.VAD.load()  # ✅ don't pass None


def create_tts():
    api_key = os.getenv("DEEPGRAM_API_KEY")
    if not api_key:
        raise RuntimeError("DEEPGRAM_API_KEY not set")

    return DeepgramTTS(
        api_key=api_key,
        model="aura-2-andromeda-en",  # English voice
    )


def create_llm():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY not set")
    return groq.LLM(
        api_key=api_key,
        model="llama-3.3-70b-versatile",  # ✅ valid Groq model
        temperature=0.2,
    )

def create_cerebras_llm(
    model: str = "qwen-3-235b-a22b-instruct-2507",
    temperature: float = 0.7,
    max_completion_tokens: int = 150,
    tool_choice: str = "auto",
    parallel_tool_calls: bool = False,
):
    import os
    from livekit.plugins.openai import LLM  # ✅ direct import

    api_key = os.getenv("CEREBRAS_API_KEY")

    if not api_key:
        raise ValueError("CEREBRAS_API_KEY not found")

    return LLM(
        model=model,
        api_key=api_key,
        base_url="https://api.cerebras.ai/v1",

        temperature=temperature,
        tool_choice=tool_choice,
        parallel_tool_calls=parallel_tool_calls,

        # 🔥 THIS is the real fix
        max_completion_tokens=max_completion_tokens,
    )
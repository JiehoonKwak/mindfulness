"""Music generation service using Gemini API.

Note: Requires GEMINI_API_KEY environment variable to be configured.
The Gemini 2.0 Flash model supports audio generation.
"""

import os
import time
from pathlib import Path
from typing import Optional

import httpx


class MusicGenService:
    """Service for AI music generation using Google Gemini."""

    def __init__(self):
        self.api_key = os.environ.get("GEMINI_API_KEY")
        self.output_dir = Path("./sounds/music/generated")
        self.output_dir.mkdir(parents=True, exist_ok=True)

    async def generate(self, prompt: str, duration_seconds: int = 120) -> Optional[str]:
        """Generate music based on a prompt.

        Returns the filename of the generated track, or None if generation fails.
        """
        if not self.api_key:
            return None

        try:
            full_prompt = f"""Generate ambient meditation music.
Style: {prompt}
Duration: {duration_seconds} seconds
Requirements: No vocals, slow tempo, calming, suitable for meditation and mindfulness practice.
The music should help listeners relax and focus on their breathing."""

            async with httpx.AsyncClient(timeout=120.0) as client:
                response = await client.post(
                    f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key={self.api_key}",
                    json={
                        "contents": [{"parts": [{"text": full_prompt}]}],
                        "generationConfig": {
                            "response_mime_type": "audio/mp3",
                        },
                    },
                )

                if response.status_code != 200:
                    print(f"Gemini API error: {response.status_code} - {response.text}")
                    return None

                data = response.json()

                # Extract audio data from response
                if "candidates" in data and len(data["candidates"]) > 0:
                    candidate = data["candidates"][0]
                    if "content" in candidate and "parts" in candidate["content"]:
                        for part in candidate["content"]["parts"]:
                            if "inlineData" in part:
                                import base64

                                audio_data = base64.b64decode(
                                    part["inlineData"]["data"]
                                )
                                filename = f"meditation_{int(time.time())}.mp3"
                                filepath = self.output_dir / filename

                                with open(filepath, "wb") as f:
                                    f.write(audio_data)

                                return filename

                return None

        except Exception as e:
            print(f"Music generation error: {e}")
            return None

    async def check_status(self, job_id: str) -> dict:
        """Check the status of a generation job."""
        return {"status": "not_implemented"}


# Global instance
music_gen_service = MusicGenService()


# Preset prompts for meditation music
MUSIC_PRESETS = [
    {
        "id": "ambient",
        "label": "Ambient",
        "prompt": "Calm ambient meditation music, soft pads, gentle drone, peaceful atmosphere",
    },
    {
        "id": "nature",
        "label": "Nature",
        "prompt": "Gentle nature sounds with soft music, birds, flowing water, forest ambience",
    },
    {
        "id": "tibetan",
        "label": "Tibetan",
        "prompt": "Tibetan singing bowls meditation, deep resonance, spiritual, harmonic overtones",
    },
    {
        "id": "binaural",
        "label": "Binaural",
        "prompt": "Binaural beats meditation, theta waves, deep focus, calm and centered",
    },
]

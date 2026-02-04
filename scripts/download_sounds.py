#!/usr/bin/env python3
"""Download CC0/CC-BY meditation sounds from various sources.

Sources:
- Freesound.org (CC0/CC-BY): https://freesound.org
- BigSoundBank (CC0): https://bigsoundbank.com
"""

import sys
from pathlib import Path
from urllib.request import Request, urlopen

# Sound URLs from Freesound.org previews (CC0/CC-BY licensed)
# Updated URLs verified working as of 2025
SOUNDS = {
    "bells": {
        # All CC0 licensed from Freesound.org
        "tibetan_bowl": "https://cdn.freesound.org/previews/411/411089_5121236-lq.mp3",
        "singing_bowl": "https://cdn.freesound.org/previews/536/536420_4921277-lq.mp3",
        "zen_gong": "https://cdn.freesound.org/previews/243/243749_3797507-lq.mp3",
        "soft_chime": "https://cdn.freesound.org/previews/455/455472_1719057-lq.mp3",
    },
    "ambient": {
        # All CC0 licensed from Freesound.org
        "rain_light": "https://cdn.freesound.org/previews/518/518863_3490256-lq.mp3",
        "ocean_waves": "https://cdn.freesound.org/previews/531/531015_9818404-lq.mp3",
        "forest": "https://cdn.freesound.org/previews/623/623160_13773535-lq.mp3",
    },
}


def download_sounds(output_dir: Path) -> None:
    """Download all sounds to output directory."""
    headers = {"User-Agent": "Mozilla/5.0 (Mindfulness App Sound Downloader)"}

    for category, sounds in SOUNDS.items():
        category_dir = output_dir / category
        category_dir.mkdir(parents=True, exist_ok=True)
        print(f"{category.title()}:")

        for name, url in sounds.items():
            filepath = category_dir / f"{name}.mp3"
            if filepath.exists():
                print(f"  [skip] {name} (exists)")
                continue

            print(f"  [download] {name}...")
            try:
                req = Request(url, headers=headers)
                with urlopen(req, timeout=30) as response:
                    data = response.read()
                filepath.write_bytes(data)
                print(f"    -> {filepath.name} ({len(data) // 1024}KB)")
            except Exception as e:
                print(f"    ERROR: {e}")


def main() -> int:
    """Main entry point."""
    # Determine output directory
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    output_dir = project_root / "frontend" / "public" / "sounds"

    print(f"Downloading sounds to: {output_dir}\n")
    download_sounds(output_dir)

    print()
    print("Done! Sound files saved to frontend/public/sounds/")
    return 0


if __name__ == "__main__":
    sys.exit(main())

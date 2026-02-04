from pathlib import Path
from functools import lru_cache

import yaml

CONFIG_PATH = Path(__file__).parent.parent.parent / "config" / "config.yaml"


@lru_cache
def get_config() -> dict:
    """Load and cache configuration from YAML file."""
    with open(CONFIG_PATH) as f:
        return yaml.safe_load(f)

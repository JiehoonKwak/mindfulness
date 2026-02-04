"""Export service for generating data exports in various formats."""

import csv
import io
import json
from datetime import datetime
from typing import List

from ..models.session import Session


def export_json(sessions: List[Session], stats: dict) -> str:
    """Export all data as JSON."""
    data = {
        "exported_at": datetime.utcnow().isoformat(),
        "stats": stats,
        "sessions": [
            {
                "id": s.id,
                "started_at": s.started_at.isoformat() if s.started_at else None,
                "ended_at": s.ended_at.isoformat() if s.ended_at else None,
                "planned_duration_seconds": s.planned_duration_seconds,
                "actual_duration_seconds": s.actual_duration_seconds,
                "completed": s.completed,
                "visual_type": s.visual_type,
                "mood_before": s.mood_before,
                "mood_after": s.mood_after,
                "note": s.note,
            }
            for s in sessions
        ],
    }
    return json.dumps(data, indent=2, ensure_ascii=False)


def export_csv(sessions: List[Session]) -> str:
    """Export sessions as CSV."""
    output = io.StringIO()
    writer = csv.writer(output)

    # Header
    writer.writerow(
        [
            "id",
            "started_at",
            "ended_at",
            "planned_duration_min",
            "actual_duration_min",
            "completed",
            "visual_type",
            "mood_before",
            "mood_after",
            "note",
        ]
    )

    # Data rows
    for s in sessions:
        writer.writerow(
            [
                s.id,
                s.started_at.isoformat() if s.started_at else "",
                s.ended_at.isoformat() if s.ended_at else "",
                s.planned_duration_seconds // 60 if s.planned_duration_seconds else "",
                s.actual_duration_seconds // 60 if s.actual_duration_seconds else "",
                "Yes" if s.completed else "No",
                s.visual_type or "",
                s.mood_before or "",
                s.mood_after or "",
                s.note or "",
            ]
        )

    return output.getvalue()


def export_ical(sessions: List[Session]) -> str:
    """Export sessions as iCal format."""
    lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Mindfulness App//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
    ]

    for s in sessions:
        if not s.started_at:
            continue

        duration_min = (s.actual_duration_seconds or s.planned_duration_seconds) // 60
        end_time = s.ended_at or s.started_at

        lines.extend(
            [
                "BEGIN:VEVENT",
                f"UID:mindfulness-{s.id}@app",
                f"DTSTART:{s.started_at.strftime('%Y%m%dT%H%M%SZ')}",
                f"DTEND:{end_time.strftime('%Y%m%dT%H%M%SZ')}",
                f"SUMMARY:Meditation ({duration_min} min)",
                f"DESCRIPTION:{s.note or 'Meditation session'}",
                "STATUS:CONFIRMED" if s.completed else "STATUS:TENTATIVE",
                "END:VEVENT",
            ]
        )

    lines.append("END:VCALENDAR")
    return "\r\n".join(lines)


def export_markdown(sessions: List[Session]) -> str:
    """Export as human-readable markdown journal."""
    lines = [
        "# Mindfulness Journal",
        "",
        f"*Exported on {datetime.utcnow().strftime('%Y-%m-%d')}*",
        "",
    ]

    # Group by date
    by_date: dict = {}
    for s in sessions:
        if not s.started_at:
            continue
        date_str = s.started_at.strftime("%Y-%m-%d")
        if date_str not in by_date:
            by_date[date_str] = []
        by_date[date_str].append(s)

    for date_str in sorted(by_date.keys(), reverse=True):
        lines.append(f"## {date_str}")
        lines.append("")

        for s in by_date[date_str]:
            duration_min = (
                s.actual_duration_seconds or s.planned_duration_seconds
            ) // 60
            time_str = s.started_at.strftime("%H:%M")
            status = "✓" if s.completed else "○"

            lines.append(f"### {time_str} - {duration_min} min {status}")
            if s.visual_type:
                lines.append(f"*Visual: {s.visual_type}*")
            if s.mood_after:
                lines.append(f"*Mood: {s.mood_after}*")
            if s.note:
                lines.append("")
                lines.append(s.note)
            lines.append("")

    return "\n".join(lines)

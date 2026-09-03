"""
Seed script to populate initial support tickets for testing and development.
"""
from database import SessionLocal, init_db
import models

SAMPLE_TICKETS = [
    {
        "title": "Cannot access VPN from remote office",
        "description": "Whenever I try to connect to the corporate VPN using OpenVPN client, I get error code 403 'Authentication Failed'. Resetting password did not resolve the issue.",
        "priority": "High",
        "status": "Open",
        "requesterName": "Alice Johnson",
    },
    {
        "title": "Dual-monitor display setup flickering",
        "description": "The secondary Dell monitor connected via HDMI flickers black every 20-30 seconds during screen sharing or spreadsheet work. Replaced cable but problem persists.",
        "priority": "Medium",
        "status": "In Progress",
        "requesterName": "Marcus Sterling",
    },
    {
        "title": "Request Figma Enterprise license access",
        "description": "Joined the design systems squad this week and require edit permissions in the design workspace. Manager approval attached in ticket notes.",
        "priority": "Low",
        "status": "Resolved",
        "requesterName": "Elena Rostova",
    },
    {
        "title": "Database connection pool timeouts in staging",
        "description": "Staging backend service is logging 'PoolTimeout: QueuePool limit of size 5 overflow 10 reached' under simulated load test. Needs pool configuration bump.",
        "priority": "High",
        "status": "In Progress",
        "requesterName": "David Kim",
    },
    {
        "title": "Keyboard spacebar sticking intermittently",
        "description": "Mechanical keyboard keycap on spacebar is sticking after extended typing sessions. Requesting replacement keyboard or cleaning kit.",
        "priority": "Low",
        "status": "Open",
        "requesterName": "Sarah Connor",
    },
]


def seed():
    init_db()
    db = SessionLocal()
    try:
        # Check existing count
        count = db.query(models.Ticket).count()
        if count > 0:
            print(f"Database already has {count} tickets. Skipping seed to prevent duplicate data.")
            return

        print("Seeding database with sample tickets...")
        for ticket_data in SAMPLE_TICKETS:
            ticket = models.Ticket(**ticket_data)
            db.add(ticket)
        db.commit()
        print(f"Successfully added {len(SAMPLE_TICKETS)} sample tickets.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()

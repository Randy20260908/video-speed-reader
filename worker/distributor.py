"""
M1 distributor: polls jobs.status='pending' every 10 s and spawns one worker.py
process per pending job. The worker flips the status to 'downloading' right away,
so the next poll skips it.

Reads SUPABASE_URL + SUPABASE_SECRET_KEY from AWS Secrets Manager (same auth
model as worker.py — the EC2's IAM instance profile).

Known M1 limitation: if worker.py dies BEFORE flipping to 'downloading', the
next poll spawns it again. To keep that from becoming a tight loop, a job is
only re-spawned once its previous worker process has exited.
"""
import os
import subprocess
import sys
import time
from pathlib import Path

import boto3
from supabase import create_client


def _load_secrets() -> dict[str, str]:
    sm = boto3.client("secretsmanager")
    get = lambda name: sm.get_secret_value(SecretId=name)["SecretString"].strip()
    return {"SUPABASE_URL": get("supabase-url"), "SUPABASE_SECRET_KEY": get("supabase-secret-key")}


_secrets = _load_secrets()
db = create_client(_secrets["SUPABASE_URL"], _secrets["SUPABASE_SECRET_KEY"])

WORKER = Path(__file__).parent / "worker.py"
PYTHON = sys.executable  # same venv we're running in
running: dict[str, subprocess.Popen] = {}


def poll_once() -> None:
    # Forget workers that have finished.
    for job_id, proc in list(running.items()):
        if proc.poll() is not None:
            del running[job_id]

    rows = db.table("jobs").select("id").eq("status", "pending").execute().data
    for row in rows:
        if row["id"] in running:
            continue
        env = {**os.environ, "JOB_ID": row["id"]}
        running[row["id"]] = subprocess.Popen([PYTHON, str(WORKER)], env=env)
        print(f"spawned worker for job {row['id']}", flush=True)


def main() -> None:
    print("distributor: polling every 10s. Ctrl+C to stop.", flush=True)
    while True:
        try:
            poll_once()
        except Exception as e:
            print(f"poll error: {e}", file=sys.stderr, flush=True)
        time.sleep(10)


if __name__ == "__main__":
    main()

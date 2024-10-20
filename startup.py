import subprocess
import os
import time
import webbrowser


def delay_launch_localhost(delay_time=4, port=5173):
    time.sleep(delay_time)
    webbrowser.open(f"http://localhost:{port}")


# Paths to frontend and backend directories
frontend_dir = os.path.join(os.getcwd(), "frontend")
backend_dir = os.path.join(os.getcwd(), "backend")

# Commands to run
commands = [
    f"Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd {backend_dir}; pnpm run dev-debug'",
    f"Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd {frontend_dir}; pnpx vite dev'",
]


# Execute each command in a new PowerShell process
for cmd in commands:
    subprocess.run(["powershell", "-ExecutionPolicy", "Bypass", "-Command", cmd])

delay_launch_localhost()

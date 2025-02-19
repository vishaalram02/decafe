from modal import App, Image, asgi_app
from web import app as fastapi_app

image = (
    Image.from_registry("ubuntu:24.04", add_python="3.11")
    .pip_install_from_requirements("requirements.txt")
    .run_commands(
        "apt-get update",
        "apt-get install -y file gcc g++ libstdc++6"
    )
    .add_local_file("./decafe", "/usr/local/bin/decafe")
)

app = App("decafe")

@app.function(image=image, cpu=0.125, keep_warm=1)
@asgi_app()
def decafe_server():
    return fastapi_app
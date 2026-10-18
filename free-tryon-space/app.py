import subprocess
import sys
from pathlib import Path

import gradio as gr
import spaces

ROOT = Path(__file__).parent
SOURCE = ROOT / "fashn-vton-1.5"
WEIGHTS = ROOT / "weights"
PIPELINE = None

# Download official inference helper and model weights during Space startup.
# The package itself is installed at build time from requirements.txt.
if not SOURCE.exists():
    subprocess.run(
        ["git", "clone", "--depth", "1", "https://github.com/fashn-AI/fashn-vton-1.5.git", str(SOURCE)],
        check=True,
        timeout=180,
    )
subprocess.run(
    [sys.executable, str(SOURCE / "scripts" / "download_weights.py"), "--weights-dir", str(WEIGHTS)],
    check=True,
    timeout=1800,
)

@spaces.GPU(duration=120)
def generate(person, garment, category):
    global PIPELINE
    if person is None or garment is None:
        raise gr.Error("Upload both a full-body person photo and a clear garment photo.")
    if PIPELINE is None:
        from fashn_vton import TryOnPipeline
        PIPELINE = TryOnPipeline(weights_dir=str(WEIGHTS))
    result = PIPELINE(
        person_image=person.convert("RGB"),
        garment_image=garment.convert("RGB"),
        category=category,
    )
    if not result.images:
        raise gr.Error("The model did not return an image. Please try different photos.")
    return result.images[0]

with gr.Blocks(title="Smart Tailor — Free AI Try-On", theme=gr.themes.Soft()) as demo:
    gr.Markdown(
        "# Smart Tailor — Free AI Try-On\n"
        "Open-source FASHN VTON v1.5 running in this Space. Upload a person photo and a garment reference image. "
        "Use only photos you have permission to process. The model may change garment details and is not a fit guarantee."
    )
    with gr.Row():
        person = gr.Image(type="pil", label="Person photo (prefer full body)")
        garment = gr.Image(type="pil", label="Garment photo (clear front view)")
    category = gr.Radio(
        choices=[("Blouse / top", "tops"), ("Dress / gown / one-piece", "one-pieces"), ("Bottoms", "bottoms")],
        value="tops",
        label="Garment category",
    )
    run = gr.Button("Generate try-on", variant="primary")
    output = gr.Image(type="pil", label="Generated preview")
    run.click(generate, inputs=[person, garment, category], outputs=output)
    gr.Markdown(
        "### Free-tier notes\n"
        "- Community GPU quota applies; queues and daily limits apply.\n"
        "- First startup downloads roughly 2 GB of model weights and can take several minutes.\n"
        "- Uploaded images are processed by the hosted Space runtime.\n"
        "- The 3D tailoring workspace remains on Smart Tailor; this page only generates a visual try-on."
    )

demo.queue(default_concurrency_limit=1, max_size=4).launch()

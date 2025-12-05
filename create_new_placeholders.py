"""
Create placeholder images for Valak and Pinhead agents
"""
from PIL import Image, ImageDraw, ImageFont
import os

def create_agent_placeholder(name, icon, color, filename):
    """Create a placeholder image for an agent"""
    # Create 400x400 image
    img = Image.new('RGB', (400, 400), color=color)
    draw = ImageDraw.Draw(img)

    # Try to use a font, fallback to default if not available
    try:
        font_large = ImageFont.truetype("arial.ttf", 80)
        font_small = ImageFont.truetype("arial.ttf", 40)
    except:
        font_large = ImageFont.load_default()
        font_small = ImageFont.load_default()

    # Draw icon
    bbox = draw.textbbox((0, 0), icon, font=font_large)
    icon_width = bbox[2] - bbox[0]
    icon_height = bbox[3] - bbox[1]
    draw.text(((400 - icon_width) / 2, 120), icon, fill='white', font=font_large)

    # Draw name
    bbox = draw.textbbox((0, 0), name, font=font_small)
    name_width = bbox[2] - bbox[0]
    draw.text(((400 - name_width) / 2, 250), name, fill='white', font=font_small)

    # Save image
    output_path = os.path.join('public', 'agents', filename)
    img.save(output_path, 'JPEG', quality=95)
    print(f"Created: {output_path}")

# Create placeholders
create_agent_placeholder('VALAK', '📿', '#4B0082', 'valak.jpg')  # Indigo/purple for the nun
create_agent_placeholder('PINHEAD', '⛓️', '#2C2C2C', 'pinhead.jpg')  # Dark gray for cenobite

print("\n✅ All placeholder images created successfully!")

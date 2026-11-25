import bpy
import math
import os
import sys
from mathutils import Vector


def arg_after(flag, default):
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    return argv[argv.index(flag) + 1] if flag in argv else default


PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
OUT_DIR = arg_after("--out-dir", os.path.join(PROJECT_ROOT, "output", "imagegen", "styles-blender"))
if not os.path.isabs(OUT_DIR):
    OUT_DIR = os.path.join(PROJECT_ROOT, OUT_DIR)
OUT_DIR = os.path.abspath(OUT_DIR)
ONLY_STYLE = arg_after("--only", "all")
ONLY_STYLES = set(ONLY_STYLE.split(","))
PRODUCTION = "--production" in (sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else [])
os.makedirs(OUT_DIR, exist_ok=True)

STYLES = [
    {
        "id": "01-handcrafted-stop-motion",
        "wall": (0.13, 0.20, 0.15, 1), "wall_alt": (0.30, 0.37, 0.25, 1),
        "wood": (0.20, 0.105, 0.062, 1), "wood_light": (0.39, 0.22, 0.12, 1),
        "floor": (0.22, 0.19, 0.14, 1), "coat": (0.19, 0.29, 0.23, 1),
        "accent": (0.76, 0.49, 0.20, 1), "metal": (0.52, 0.37, 0.18, 1),
        "paper": False, "lowpoly": False, "lamp": (1.0, 0.70, 0.32),
        "spot": (1.0, 0.80, 0.50), "world": (0.025, 0.035, 0.032),
    },
    {
        "id": "02-layered-paper-storybook",
        "wall": (0.24, 0.38, 0.34, 1), "wall_alt": (0.49, 0.61, 0.49, 1),
        "wood": (0.42, 0.28, 0.18, 1), "wood_light": (0.66, 0.48, 0.29, 1),
        "floor": (0.38, 0.31, 0.23, 1), "coat": (0.22, 0.40, 0.37, 1),
        "accent": (0.77, 0.49, 0.37, 1), "metal": (0.58, 0.44, 0.25, 1),
        "paper": True, "lowpoly": False, "lamp": (1.0, 0.78, 0.43),
        "spot": (0.92, 0.90, 0.68), "world": (0.055, 0.075, 0.070),
    },
    {
        "id": "03-stylized-low-poly-cinema",
        "wall": (0.035, 0.095, 0.21, 1), "wall_alt": (0.10, 0.25, 0.48, 1),
        "wood": (0.095, 0.075, 0.16, 1), "wood_light": (0.34, 0.24, 0.45, 1),
        "floor": (0.055, 0.085, 0.16, 1), "coat": (0.08, 0.29, 0.58, 1),
        "accent": (0.96, 0.38, 0.14, 1), "metal": (0.36, 0.58, 0.82, 1),
        "paper": False, "lowpoly": True, "lamp": (1.0, 0.62, 0.22),
        "spot": (0.62, 0.82, 1.0), "world": (0.012, 0.026, 0.085),
    },
]


def mat(name, color, rough=0.78, metallic=0.0, texture=False):
    m = bpy.data.materials.new(name)
    m.diffuse_color = color
    m.use_nodes = True
    bs = m.node_tree.nodes.get("Principled BSDF")
    bs.inputs["Base Color"].default_value = color
    bs.inputs["Roughness"].default_value = rough
    bs.inputs["Metallic"].default_value = metallic
    if texture:
        nodes = m.node_tree.nodes
        links = m.node_tree.links
        texcoord = nodes.new("ShaderNodeTexCoord")
        mapping = nodes.new("ShaderNodeVectorMath")
        mapping.operation = "MULTIPLY"
        mapping.inputs[1].default_value = (2.0, 12.0, 1.8)
        links.new(texcoord.outputs["Generated"], mapping.inputs[0])
        noise = nodes.new("ShaderNodeTexNoise")
        noise.inputs["Scale"].default_value = 3.2
        noise.inputs["Detail"].default_value = 5.0
        links.new(mapping.outputs["Vector"], noise.inputs["Vector"])
        color_ramp = nodes.new("ShaderNodeValToRGB")
        low_color = tuple(max(0, c * 0.72) for c in color[:3]) + (1,)
        high_color = tuple(min(1, c * 1.13 + 0.015) for c in color[:3]) + (1,)
        color_ramp.color_ramp.elements[0].position = 0.12
        color_ramp.color_ramp.elements[0].color = low_color
        color_ramp.color_ramp.elements[1].position = 0.88
        color_ramp.color_ramp.elements[1].color = high_color
        links.new(noise.outputs["Fac"], color_ramp.inputs["Fac"])
        links.new(color_ramp.outputs["Color"], bs.inputs["Base Color"])
        bump = nodes.new("ShaderNodeBump")
        bump.inputs["Strength"].default_value = 0.11
        bump.inputs["Distance"].default_value = 0.035
        links.new(noise.outputs["Fac"], bump.inputs["Height"])
        links.new(bump.outputs["Normal"], bs.inputs["Normal"])
    return m


def bevel(obj, width=0.045, segments=3):
    if width <= 0:
        return
    mod = obj.modifiers.new("Soft handmade edges", "BEVEL")
    mod.width = width
    mod.segments = segments
    normal = obj.modifiers.new("Weighted corner normals", "WEIGHTED_NORMAL")
    normal.keep_sharp = True


def box(name, loc, dims, material, edge=0.04, segments=3):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    o = bpy.context.object
    o.name = name
    o.dimensions = dims
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    o.data.materials.append(material)
    bevel(o, edge, segments)
    return o


def uv(name, loc, scale, material, segments=24, rings=12, smooth=True):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=rings, radius=1, location=loc)
    o = bpy.context.object
    o.name = name
    o.scale = scale
    o.data.materials.append(material)
    if smooth:
        for p in o.data.polygons:
            p.use_smooth = True
    return o


def cylinder(name, loc, radius, depth, material, vertices=32, rot=None):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=loc,
                                        rotation=rot or (0, 0, 0))
    o = bpy.context.object
    o.name = name
    o.data.materials.append(material)
    bevel(o, min(0.035, depth * 0.12), 2)
    return o


def cone(name, loc, r1, r2, depth, material, vertices=32):
    bpy.ops.mesh.primitive_cone_add(vertices=vertices, radius1=r1, radius2=r2, depth=depth, location=loc)
    o = bpy.context.object
    o.name = name
    o.data.materials.append(material)
    bevel(o, 0.025, 2)
    return o


def torus(name, loc, major, minor, material, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_torus_add(major_radius=major, minor_radius=minor, major_segments=32,
                                     minor_segments=8, location=loc, rotation=rot)
    o = bpy.context.object
    o.name = name
    o.data.materials.append(material)
    return o


def aim(obj, point):
    obj.rotation_euler = (Vector(point) - obj.location).to_track_quat("-Z", "Y").to_euler()


def area_light(name, loc, target, power, color, size):
    data = bpy.data.lights.new(name, "AREA")
    data.energy = power
    data.color = color
    data.shape = "DISK"
    data.size = size
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.location = loc
    aim(obj, target)
    return obj


def point_light(name, loc, power, color, radius):
    data = bpy.data.lights.new(name, "POINT")
    data.energy = power
    data.color = color
    data.shadow_soft_size = radius
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.location = loc
    return obj


def spot_light(name, loc, target, power, color, cone_angle, blend=0.4):
    data = bpy.data.lights.new(name, "SPOT")
    data.energy = power
    data.color = color
    data.spot_size = cone_angle
    data.spot_blend = blend
    data.shadow_soft_size = 0.22
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.location = loc
    aim(obj, target)
    return obj


def make_wall_pattern(style, tile, dark, light):
    verts, faces, mids = [], [], []
    for iz in range(10):
        z = 0.65 + iz * 0.86
        for ix in range(20):
            x = -8.3 + ix * 0.86 + (iz % 2) * 0.43
            r = 0.25
            base = len(verts)
            verts.extend([(x, 2.274, z + r), (x + r * 0.72, 2.274, z),
                          (x, 2.274, z - r), (x - r * 0.72, 2.274, z)])
            faces.append((base, base + 1, base + 2, base + 3))
            mids.append(1 if (ix + iz) % 3 == 0 else 0)
            if (ix + iz) % 2 == 0:
                # Four small paper/paint petals build an original repeating medallion.
                rr = 0.055 if style["paper"] else 0.045
                for dx, dz in [(0, rr * 1.7), (rr * 1.7, 0), (0, -rr * 1.7), (-rr * 1.7, 0)]:
                    b = len(verts)
                    verts.extend([(x + dx, 2.25, z + dz + rr), (x + dx + rr, 2.25, z + dz),
                                  (x + dx, 2.25, z + dz - rr), (x + dx - rr, 2.25, z + dz)])
                    faces.append((b, b + 1, b + 2, b + 3))
                    mids.append(2)
    mesh = bpy.data.meshes.new("Repeating engraved wallpaper pattern")
    mesh.from_pydata(verts, [], faces)
    mesh.materials.append(dark)
    mesh.materials.append(light)
    mesh.materials.append(tile)
    ob = bpy.data.objects.new("Hand-detailed repeating dream wallpaper", mesh)
    bpy.context.collection.objects.link(ob)
    for poly, mi in zip(mesh.polygons, mids):
        poly.material_index = mi


def build_scene(style):
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for datablocks in (bpy.data.materials, bpy.data.curves, bpy.data.meshes, bpy.data.cameras, bpy.data.lights):
        for block in list(datablocks):
            if block.users == 0:
                datablocks.remove(block)

    low = style["lowpoly"]
    edge = 0.018 if low else (0.075 if style["paper"] else 0.055)
    segs = 1 if low else (2 if style["paper"] else 4)
    wall = mat("Deep patinated wall", style["wall"], 0.9, texture=not style["paper"] and not low)
    wallpaper_dark = mat("Wallpaper base motif", style["wall_alt"], 0.88)
    wallpaper_light = mat("Wallpaper ink detail", tuple(min(1, c * 1.08) for c in style["wall_alt"][:3]) + (1,), 0.92)
    trim = mat("Worn skirting and carved trim", style["wood_light"], 0.84, texture=not low)
    wood = mat("Old walnut furniture", style["wood"], 0.76 if not style["paper"] else 0.9, texture=not style["paper"] and not low)
    wood_hi = mat("Drawer front patina", style["wood_light"], 0.78 if not style["paper"] else 0.9, texture=not style["paper"] and not low)
    floor = mat("Dark aged floorboards", style["floor"], 0.9, texture=not low)
    coat = mat("Little traveler's coat", style["coat"], 0.9, texture=not low)
    skin = mat("Warm ceramic face", (0.61, 0.43, 0.30, 1), 0.8)
    hood = mat("Hood shadow", (0.075, 0.085, 0.075, 1), 0.95)
    pack = mat("Woven pocket satchel", style["accent"], 0.94, texture=True)
    brass = mat("Old brass", style["metal"], 0.3, 0.68)
    glowing = mat("Lantern glass", (1.0, 0.63, 0.22, 1), 0.18, 0.05)
    coin = mat("Goal tokens", (0.94, 0.67, 0.23, 1), 0.32, 0.52)
    ceramic = mat("Clouded porcelain", (0.65, 0.67, 0.58, 1), 0.24)
    dark = mat("Deep shadow", (0.035, 0.045, 0.04, 1), 0.95)

    # Room shell: original harbor archive with a dramatic room-scale cabinet.
    box("Aged oak floor", (0, -3.2, -0.25), (18, 16, 0.5), floor, 0.09, segs)
    for i in range(15):
        y = -10.3 + i * 0.96
        box("Floorboard seam %02d" % i, (0, y, 0.014), (17.8, 0.018, 0.012), trim, 0, 1)
    box("Back wall", (0, 2.65, 5.2), (18, 0.42, 10.4), wall, 0.08, segs)
    box("Left return wall", (-8.82, -3.2, 5.2), (0.36, 12, 10.4), wall, 0.05, segs)
    box("Right return wall", (8.82, -3.2, 5.2), (0.36, 12, 10.4), wall, 0.05, segs)
    box("Back wall dado rail", (0, 2.38, 2.25), (17.6, 0.11, 0.16), trim, edge, segs)
    box("Back wall upper cornice", (0, 2.34, 9.65), (17.6, 0.15, 0.25), trim, edge, segs)
    make_wall_pattern(style, wallpaper_light, wallpaper_dark, wallpaper_light)

    # Giant goal drawer cabinet, five rows of hand-detailed drawers.
    cx, cy = 3.25, 1.40
    box("Monumental goal-drawer carcass", (cx, cy, 4.28), (3.75, 1.30, 8.45), wood, edge, segs)
    box("Cabinet left stile", (cx - 1.77, cy - 0.71, 4.3), (0.20, 0.11, 8.05), trim, edge * .45, segs)
    box("Cabinet right stile", (cx + 1.77, cy - 0.71, 4.3), (0.20, 0.11, 8.05), trim, edge * .45, segs)
    for row in range(6):
        z = 1.0 + row * 1.30
        for col in range(2):
            x = cx - 0.84 + col * 1.68
            box("Deep drawer %d-%d" % (row, col), (x, cy - 0.74, z), (1.48, 0.18, 1.05), wood_hi, edge * .55, segs)
            box("Inset drawer panel %d-%d" % (row, col), (x, cy - 0.845, z), (1.23, 0.04, 0.77), wood, edge * .35, segs)
            for hx in (-0.27, 0.27):
                cylinder("Hand-cast brass pull", (x + hx, cy - 0.91, z), 0.072, 0.10, brass, 16, (math.pi / 2, 0, 0))
                uv("Brass pull end", (x + hx, cy - 0.98, z), (0.045, 0.032, 0.045), brass, 12, 8, False)
    box("Cabinet crown", (cx, cy - 0.05, 8.65), (4.15, 1.72, 0.30), trim, edge, segs)
    box("Cabinet foot plinth", (cx, cy, 0.35), (4.0, 1.5, 0.48), wood_hi, edge, segs)

    # Signature open savings drawer with a handful of luminous unbranded tokens.
    box("Open saving drawer tray", (cx, 0.49, 0.65), (2.52, 1.08, 0.20), wood_hi, edge, segs)
    box("Drawer dark interior", (cx, 0.40, 0.78), (2.23, 0.78, 0.08), dark, edge * .4, segs)
    for j, xoff in enumerate([-0.72, -0.25, 0.24, 0.69]):
        cylinder("Goal coin %d" % j, (cx + xoff, 0.28, 0.89), 0.18, 0.08, coin, 32)

    # Side furnishings, huge in scale but distinct from the provided reference.
    # Left wall: cupboard, floating shelf, framed map, hanging lamp.
    box("Left archive cupboard", (-6.4, 1.40, 3.1), (2.45, 1.35, 6.1), wood, edge, segs)
    for row in range(4):
        z = 1.0 + row * 1.32
        box("Archive cupboard door", (-6.4, 0.68, z), (2.08, 0.12, 1.05), wood_hi, edge * .5, segs)
        for xoff in (-0.36, 0.36):
            uv("Cupboard handle", (-6.4 + xoff, 0.57, z), (0.06, 0.035, 0.06), brass, 12, 8, False)
    box("Floating wall shelf", (-5.75, 1.68, 7.85), (4.4, 1.05, 0.32), wood_hi, edge, segs)
    box("Shelf shadow bracket", (-5.75, 1.94, 7.55), (3.8, 0.20, 0.72), wood, edge, segs)
    for i, x in enumerate([-7.15, -6.2, -5.25, -4.3]):
        cylinder("Old atlas %d" % i, (x, 1.05, 8.32), 0.19, 0.78, trim if i % 2 else wood_hi, 20)
    # Framed oval relief.
    torus("Oval brass portrait rim", (-2.35, 2.26, 6.85), 0.57, 0.075, brass, (math.pi / 2, 0, 0))
    uv("Faded portrait cameo", (-2.35, 2.30, 6.85), (0.51, 0.06, 0.68), ceramic, 32, 20)
    uv("Cameo silhouette", (-2.35, 2.22, 6.88), (0.18, 0.05, 0.33), trim, 20, 12)
    # A hanging harbor lamp casts the secondary pool of light.
    cylinder("Lamp ceiling chain", (-4.25, 0.6, 7.9), 0.025, 1.25, brass, 10)
    torus("Harbor lamp cage", (-4.25, 0.6, 7.1), 0.36, 0.045, brass)
    uv("Warm hanging lamp glass", (-4.25, 0.6, 7.1), (0.29, 0.29, 0.42), glowing, 20, 12)
    point_light("Soft harbor lamp", (-4.25, 0.35, 6.85), 180, style["lamp"], 0.6)

    # Right side: old fabric cabinet, towels, framed mirror, narrow drawers.
    box("Tall linen press", (6.30, 1.55, 3.55), (2.70, 1.25, 7.0), wood, edge, segs)
    box("Linen press inset", (6.30, 0.88, 3.75), (2.25, 0.10, 4.7), wood_hi, edge, segs)
    for row in range(4):
        z = 2.0 + row * 1.12
        box("Folded linen stack", (6.30, 0.68, z), (1.54, 0.38, 0.62), ceramic, edge * .55, segs)
    for row in range(5):
        z = 0.90 + row * 1.1
        box("Narrow side drawer", (4.85, 0.72, z), (0.55, 0.19, 0.80), wood_hi, edge * .5, segs)
        uv("Narrow drawer knob", (4.85, 0.59, z), (0.055, 0.038, 0.055), brass, 12, 8, False)

    # Small child traveler: original design, hood, coat, pocket satchel and hand lantern.
    tx, ty = -0.20, -2.25
    cone("Little traveler coat", (tx, ty, 0.84), 0.46, 0.24, 1.18, coat, 12 if low else 24)
    uv("Traveler's face", (tx, ty - 0.015, 1.72), (0.27, 0.25, 0.30), skin, 16 if low else 24, 12)
    # Hood shapes surround a simple face; no detailed facial identity.
    uv("Hood back", (tx, ty + 0.07, 1.78), (0.37, 0.30, 0.39), hood, 16 if low else 24, 12)
    uv("Visible face", (tx, ty - 0.245, 1.69), (0.20, 0.075, 0.20), skin, 16, 10)
    uv("Small dark eye", (tx - 0.065, ty - 0.312, 1.72), (0.025, 0.018, 0.030), dark, 12, 8, False)
    uv("Small dark eye", (tx + 0.065, ty - 0.312, 1.72), (0.025, 0.018, 0.030), dark, 12, 8, False)
    box("Worn pocket backpack", (tx - 0.35, ty + 0.03, 1.03), (0.42, 0.35, 0.58), pack, edge, segs)
    box("Backpack flap", (tx - 0.35, ty - 0.16, 1.30), (0.36, 0.055, 0.18), trim, edge * .6, segs)
    # Legs and arms kept readable at small scale.
    for side in (-1, 1):
        uv("Traveler boot", (tx + side * 0.19, ty - 0.03, 0.13), (0.15, 0.25, 0.12), hood, 16, 8)
        uv("Coat sleeve", (tx + side * 0.43, ty - 0.02, 0.96), (0.13, 0.14, 0.42), coat, 16, 10)
    cylinder("Lantern handle", (tx + 0.64, ty - 0.11, 0.98), 0.16, 0.035, brass, 20, (math.pi / 2, 0, 0))
    uv("Hand lantern body", (tx + 0.64, ty - 0.13, 0.75), (0.16, 0.14, 0.22), glowing, 16, 10)
    torus("Lantern crown", (tx + 0.64, ty - 0.13, 0.91), 0.15, 0.026, brass)
    point_light("Traveler lantern glow", (tx + 0.64, ty - 0.45, 0.78), 45, style["lamp"], 0.35)

    # Three stepping stones and forked routes make the lesson visible in the room.
    stone = mat("Path stone", style["metal"], 0.52)
    for idx, (x, y, s) in enumerate([(-2.3, -8.5, 0.70), (-1.2, -7.3, 0.62), (0.25, -6.3, 0.56),
                                    (1.25, -5.0, 0.52), (2.0, -3.9, 0.46)]):
        bpy.ops.mesh.primitive_cylinder_add(vertices=7 if low else 12, radius=s, depth=0.14,
                                            location=(x, y, 0.10))
        o = bpy.context.object
        o.name = "Distant stepping token %02d" % idx
        o.data.materials.append(stone)
        bevel(o, 0.035, 2)
        if idx in (1, 3):
            cylinder("Small path coin %02d" % idx, (x, y, 0.19), s * 0.35, 0.06, coin, 24)
    # A tray with split glowing stones signals risk-spreading without showing financial products.
    box("Three-path token tray", (-3.6, -0.8, 0.20), (1.35, 0.85, 0.24), wood_hi, edge, segs)
    for i, x in enumerate([-4.0, -3.6, -3.2]):
        uv("Light-stone token %02d" % i, (x, -0.80, 0.42), (0.14, 0.14, 0.10), coin, 16, 8)

    # Far threshold lamp: the goal that the savings drawer helps illuminate.
    box("Far harbor doorway", (-0.4, 2.35, 3.25), (1.85, 0.18, 5.65), dark, edge, segs)
    box("Door reveal", (-0.4, 2.22, 3.3), (1.52, 0.08, 5.26), wood_hi, edge, segs)
    box("Door shadow", (-0.4, 2.15, 3.25), (1.21, 0.08, 4.86), dark, edge * .4, segs)
    uv("Home-light beacon", (-0.4, 2.02, 5.75), (0.23, 0.13, 0.30), glowing, 20, 12)
    point_light("Distant home glow", (-0.4, 1.55, 5.7), 135, style["lamp"], 0.55)

    # Dramatic but soft lighting, low camera and deep framing shadows.
    spot_light("Narrow cinematic shaft through the room", (-1.5, -2.0, 11.2),
               (1.8, 0.8, 2.0), 1850, style["spot"], math.radians(44), 0.55)
    area_light("Cabinet soft reveal", (3.8, -2.2, 9.8), (3.2, 1.0, 4.0), 560,
               style["lamp"], 2.2)
    area_light("Cool rim through haze", (7.0, 1.0, 8.2), (0, 0, 2.6), 300,
               (0.40, 0.64, 0.60), 3.2)
    area_light("Traveler soft fill", (-2.5, -5.0, 3.8), (0, 0, 1.2), 38,
               (0.66, 0.76, 0.64), 1.6)

    bpy.ops.object.camera_add(location=(-3.6, -18.8, 2.55))
    camera = bpy.context.object
    camera.name = "Shared low-angle comparison camera"
    aim(camera, (0.75, 0.3, 4.35))
    camera.data.lens = 34
    camera.data.dof.use_dof = True
    camera.data.dof.focus_object = bpy.data.objects.get("Monumental goal-drawer carcass")
    camera.data.dof.aperture_fstop = 9.0
    bpy.context.scene.camera = camera

    world = bpy.data.worlds.new("Dream harbor night") if not bpy.data.worlds else bpy.data.worlds[0]
    bpy.context.scene.world = world
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs["Color"].default_value = (*style["world"], 1)
    world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.08

    # Fine atmospheric haze catches the spot light without washing out the room.
    fog = bpy.data.materials.new("Thin cinematic harbor haze")
    fog.use_nodes = True
    fog.node_tree.nodes.clear()
    volume = fog.node_tree.nodes.new("ShaderNodeVolumePrincipled")
    volume.inputs["Density"].default_value = 0.011
    volume.inputs["Color"].default_value = (0.48, 0.56, 0.46, 1)
    output = fog.node_tree.nodes.new("ShaderNodeOutputMaterial")
    fog.node_tree.links.new(volume.outputs["Volume"], output.inputs["Volume"])
    haze = box("Thin atmosphere for visible light shafts", (0, -1.0, 5.0), (17.2, 9.0, 9.8), fog, 0, 1)
    haze.display_type = "WIRE"

    scene = bpy.context.scene
    if low:
        for obj in scene.objects:
            if obj.type == "MESH":
                for polygon in obj.data.polygons:
                    polygon.use_smooth = False
    scene.render.engine = "CYCLES"
    scene.render.resolution_x = 1600
    scene.render.resolution_y = 900
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.film_transparent = False
    scene.render.engine = "CYCLES"
    scene.render.filepath = os.path.join(OUT_DIR, style["id"] + ".png")
    scene.render.image_settings.color_mode = "RGBA"

    if PRODUCTION and style["id"] == "02-layered-paper-storybook":
        # A small, looping storybook idle: a soft breathing/bobbing traveler.
        # Model remains editable in Blender and the action exports with the GLB.
        root = bpy.data.objects.new("Traveler_Idle_Root", None)
        bpy.context.collection.objects.link(root)
        root.empty_display_type = "PLAIN_AXES"
        child_names = (
            "Little traveler coat", "Traveler's face", "Hood back", "Visible face",
            "Small dark eye", "Worn pocket backpack", "Backpack flap", "Traveler boot",
            "Coat sleeve", "Lantern handle", "Hand lantern body", "Lantern crown",
            "Traveler lantern glow",
        )
        for obj in list(scene.objects):
            if any(obj.name.startswith(name) for name in child_names):
                world_matrix = obj.matrix_world.copy()
                obj.parent = root
                obj.matrix_world = world_matrix
        scene.frame_start = 1
        scene.frame_end = 72
        for frame, z, lean in ((1, 0.0, 0.0), (18, 0.045, 0.025),
                               (36, 0.0, 0.0), (54, 0.045, -0.025), (72, 0.0, 0.0)):
            scene.frame_set(frame)
            root.location = (0.0, 0.0, z)
            root.rotation_euler[1] = lean
            root.keyframe_insert(data_path="location", frame=frame, group="Soft idle")
            root.keyframe_insert(data_path="rotation_euler", frame=frame, group="Soft idle")
        action = root.animation_data.action
        action.name = "Traveler · gentle paper-storybook idle"
        # Blender 5.0+ uses layered actions instead of the legacy Action.fcurves
        # collection. The explicit 72-frame endpoints make the idle loop cleanly.
        scene.frame_set(1)
    scene.render.resolution_percentage = 100
    scene.view_settings.view_transform = "AgX"
    scene.view_settings.look = "AgX - Medium High Contrast"
    scene.view_settings.exposure = -0.65 if style["paper"] else (0.0 if low else -0.45)
    scene.view_settings.gamma = 1.0
    scene.camera.data.lens = 34
    scene.render.image_settings.color_depth = "8"
    scene.render.use_file_extension = True
    scene.render.resolution_percentage = 100
    scene.cycles.samples = 48
    scene.cycles.use_denoising = True
    scene.render.filepath = os.path.join(OUT_DIR, style["id"] + ".png")
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"


for style in (s for s in STYLES if ONLY_STYLE == "all" or s["id"] in ONLY_STYLES):
    build_scene(style)
    print("Rendering high-fidelity Blender style concept:", style["id"], flush=True)
    bpy.ops.render.render(write_still=True)
    image_path = os.path.join(OUT_DIR, style["id"] + ".png")
    if not os.path.isfile(image_path):
        raise RuntimeError("Blender did not write expected render: " + image_path)
    if PRODUCTION and style["id"] == "02-layered-paper-storybook":
        asset_dir = os.path.join(PROJECT_ROOT, "assets", "3d")
        os.makedirs(asset_dir, exist_ok=True)
        blend_path = os.path.join(asset_dir, "dream-tide-paper-harbor.blend")
        glb_path = os.path.join(asset_dir, "dream-tide-paper-harbor.glb")
        bpy.ops.wm.save_as_mainfile(filepath=blend_path)
        bpy.ops.export_scene.gltf(filepath=glb_path, export_format="GLB",
                                  export_animations=True, export_apply=True,
                                  export_cameras=False, export_lights=False,
                                  export_materials="EXPORT", use_selection=False)
        print("Saved production Blender scene:", blend_path, flush=True)
        print("Exported animated web model:", glb_path, flush=True)

print("Completed Blender style concept renders in", OUT_DIR, flush=True)

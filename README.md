# Collision Kit

A 3D collision extension for TurboWarp/Scratch. Works best with Simple 3D, but can be used with any rendering engine as it's completely separated from rendering.

## ⚠️ !!! Disclaimer !!! ⚠️

This extension is in early development! Expect bugs, inconsistencies, and unfinished examples. I will release an official documentation for the extension soon, and make better examples...

## Features

- Sphere vs Triangle Mesh collision
- Sphere vs AABB collision
- Collision normal output
- Fast triangle preprocessing
- Scratch list based mesh loading

## Usage

1. Import the extension into TurboWarp
2. Create a list containing triangle vertices:
x1 y1 z1
x2 y2 z2
x3 y3 z3
3. Add the mesh:
add trimesh from list [mesh]
4. Test collision:
trimesh collision

(Triangle normals depend on vertex order.)

## Performance

Approximate limits:

| Triangle count | Performance |
|-|-|
| <10k | Excellent |
| 10k-50k | Good |
| 50k+ | Depends on hardware |

Memory:
~0.5-0.7 KB per triangle

## Version

v0.1.0

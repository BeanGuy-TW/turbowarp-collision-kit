//========================
// Helper functions
//========================
function dot(ax, ay, az, bx, by, bz) {
    return ax * bx + ay * by + az * bz;
};

function distSq(ax, ay, az, bx, by, bz) {
    const dx = ax - bx;
    const dy = ay - by;
    const dz = az - bz;

    return dx*dx + dy*dy + dz*dz;
}

function closestPointOnSegment(px, py, pz, ax, ay, az, bx, by, bz) {
    const abx = bx - ax;
    const aby = by - ay;
    const abz = bz - az;

    const lenSq = dot(abx, aby, abz, abx, aby, abz);

    if (lenSq < 0.000001) {
        return {
            x: ax,
            y: ay,
            z: az
        };
    }

    let t = dot(
        px - ax,
        py - ay,
        pz - az,
        abx,
        aby,
        abz
    ) / lenSq;

    t = Math.max(0, Math.min(1, t));

    return {
        x: ax + abx * t,
        y: ay + aby * t,
        z: az + abz * t
    };
}

function closestPointOnTriangle(px, py, pz, tri) {

    const dist = dot(
        px - tri.ax,
        py - tri.ay,
        pz - tri.az,

        tri.nnx,
        tri.nny,
        tri.nnz
    );

    const projX = px - tri.nnx * dist;
    const projY = py - tri.nny * dist;
    const projZ = pz - tri.nnz * dist;

    const wx = projX - tri.ax;
    const wy = projY - tri.ay;
    const wz = projZ - tri.az;

    const d20 = dot(wx, wy, wz, tri.ux, tri.uy, tri.uz);

    const d21 = dot(wx, wy, wz, tri.vx, tri.vy, tri.vz);

    const denom = tri.d00 * tri.d11 - tri.d01 * tri.d01;

    const v = (tri.d11 * d20 - tri.d01 * d21) / denom;
    const w = (tri.d00 * d21 - tri.d01 * d20) / denom;
    const u = 1 - v - w;

    if (u >= 0 && v >= 0 && w >= 0) {
        return {
            x: projX,
            y: projY,
            z: projZ
        };
    }

    const ab = closestPointOnSegment(
        px, py, pz,

        tri.ax, tri.ay, tri.az,
        tri.bx, tri.by, tri.bz
    );

    const bc = closestPointOnSegment(
        px, py, pz,

        tri.bx, tri.by, tri.bz,
        tri.cx, tri.cy, tri.cz
    );

    const ca = closestPointOnSegment(
        px, py, pz,

        tri.cx, tri.cy, tri.cz,
        tri.ax, tri.ay, tri.az
    );

    const dab = distSq(px,py,pz, ab.x,ab.y,ab.z);
    const dbc = distSq(px,py,pz, bc.x,bc.y,bc.z);
    const dca = distSq(px,py,pz, ca.x,ca.y,ca.z);

    let best = ab;
    let bestDist = dab;

    if (dbc < bestDist) {
        best = bc;
        bestDist = dbc;
    }

    if (dca < bestDist) {
        best = ca;
    }

    return best;
}

//========================
// Calculate collision
//========================
function calculate_collision(px, py, pz, radius, tri) {

    const p = closestPointOnTriangle(px, py, pz, tri);

    const dx = px - p.x;
    const dy = py - p.y;
    const dz = pz - p.z;

    if (dx*dx + dy*dy + dz*dz <= radius * radius) {
        const len = Math.sqrt(dx*dx + dy*dy + dz*dz);

        if (len < 0.000001) {
            return {
                nx: tri.nnx,
                ny: tri.nny,
                nz: tri.nnz
            };
        }

        return {
            nx: dx / len,
            ny: dy / len,
            nz: dz / len
        };
    }

    return null;
}

//========================
// AABB collision
//========================
function AABBColl(px, py, pz, r, aabb) {
    return (
        px >= aabb[0] - r &&
        px <= aabb[1] + r&&

        py >= aabb[2] - r&&
        py <= aabb[3] + r&&

        pz >= aabb[4] - r&&
        pz <= aabb[5] + r
    );
}

class CollisionKit {
    getInfo() {
        return {
            id: "collisionkit",
            name: "Collision Kit",

            blocks: [
                {
                    opcode: "reset",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "reset all",
                },
                {
                    opcode: "isCollidingTri",
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: "trimesh collision | point x:[X] y:[Y] z:[Z] radius:[R]",

                    arguments: {
                        X: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        Y: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        Z: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        R: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: "isCollidingAABB",
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: "AABB collision | point x:[X] y:[Y] z:[Z] radius:[R] | AABB min x:[MinX] y:[MinY] z:[MinZ] max x:[MaxX] y:[MaxY] z:[MaxZ]",

                    arguments: {
                        X: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        Y: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        Z: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        R: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        MinX: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: -1
                        },
                        MinY: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: -1
                        },
                        MinZ: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: -1
                        },
                        MaxX: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        MaxY: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        MaxZ: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                    }
                },
                {
                    opcode: "addTri",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "add trimesh from list [LIST]",

                    arguments: {
                        LIST: {
                            type: Scratch.ArgumentType.STRING,
                            menu: "lists"
                        }
                    }
                },
                {
                    opcode: "collisionNormal",
                    blockType: Scratch.BlockType.REPORTER,
                    text: "[AXIS] of collision normal",

                    arguments: {
                        AXIS: {
                            type: Scratch.ArgumentType.STRING,
                            menu: "axis"
                        }
                    }
                },
            ],

            menus: {
                lists: {
                    acceptReporters: true,
                    items: "_getLists"
                },
                axis: {
                    acceptReporters: false,
                    items: ["x", "y", "z"]
                }
            }
        };
    }

    //================================
    // Get global lists in project
    //================================
    _getLists() {
        const stage = Scratch.vm.runtime.getTargetForStage();
        if (!stage) {
            return [{
                text: "No lists",
                value: ""
            }];
        }

        const result = [];

        for (const id in stage.variables) {
            const variable = stage.variables[id];

            if (variable.type === "list") {
                result.push({
                    text: variable.name,
                    value: id
                });
            }
        }

        if (result.length === 0) {
            result.push({
                text: "No lists",
                value: ""
            });
        }

        return result;
    }

    //================================
    // Constructor
    //================================
    constructor() {
        this.triangles = [];

        this.normalX = 0;
        this.normalY = 0;
        this.normalZ = 0;
    }

    //================================
    // Clear trimesh
    //================================
    reset() {
        this.triangles = [];

        this.normalX = 0;
        this.normalY = 0;
        this.normalZ = 0;
    }

    //================================
    // Generate trimesh
    //================================
    addTri(args) {
        if (!args.LIST) return;

        const stage = Scratch.vm.runtime.getTargetForStage();

        const list = stage.variables[args.LIST];

        if (!list) return;

        for (let i = 0; i + 8 < list.value.length; i += 9) {

            // Get triangle points
            const ax = Number(list.value[i]);
            const ay = Number(list.value[i + 1]);
            const az = Number(list.value[i + 2]);

            const bx = Number(list.value[i + 3]);
            const by = Number(list.value[i + 4]);
            const bz = Number(list.value[i + 5]);

            const cx = Number(list.value[i + 6]);
            const cy = Number(list.value[i + 7]);
            const cz = Number(list.value[i + 8]);

            // Calculate triangle AABB
            const minX = Math.min(ax,bx,cx);
            const maxX = Math.max(ax,bx,cx);

            const minY = Math.min(ay,by,cy);
            const maxY = Math.max(ay,by,cy);

            const minZ = Math.min(az,bz,cz);
            const maxZ = Math.max(az,bz,cz);

            // Precalculate triangle constant
            const ux = bx - ax;
            const uy = by - ay;
            const uz = bz - az;

            const vx = cx - ax;
            const vy = cy - ay;
            const vz = cz - az;

            const nx = uy * vz - uz * vy;
            const ny = uz * vx - ux * vz;
            const nz = ux * vy - uy * vx;

            const len = Math.sqrt(nx * nx + ny * ny + nz * nz);

            if (len < 0.000001) continue; // if triangle is too small, skip it

            const nnx = nx / len;
            const nny = ny / len;
            const nnz = nz / len;

            const d00 = dot(ux, uy, uz, ux, uy, uz);
            const d01 = dot(ux, uy, uz, vx, vy, vz);
            const d11 = dot(vx, vy, vz, vx, vy, vz);

            this.triangles.push({
                ax: ax, ay: ay, az: az,
                bx: bx, by: by, bz: bz,
                cx: cx, cy: cy, cz: cz,
                aabb: [minX, maxX, minY, maxY, minZ, maxZ],
                ux, uy, uz,
                vx, vy, vz,
                nnx, nny, nnz,
                d00,d01,d11
            });
        }
    }

    //================================
    // Get collision normal
    //================================
    collisionNormal(args) {
        switch(args.AXIS) {
            case "x": return this.normalX;
            case "y": return this.normalY;
            case "z": return this.normalZ;
        }
        return 0;
    }

    //================================
    // point/sphere vs AABB collision
    //================================
    isCollidingAABB(args) {
        const px = Number(args.X);
        const py = Number(args.Y);
        const pz = Number(args.Z);

        const r = Number(args.R);

        const minX = Number(args.MinX);
        const minY = Number(args.MinY);
        const minZ = Number(args.MinZ);

        const maxX = Number(args.MaxX);
        const maxY = Number(args.MaxY);
        const maxZ = Number(args.MaxZ);

        return AABBColl(px, py, pz, r, [minX, maxX, minY, maxY, minZ, maxZ]);
    }

    //================================
    // point/sphere vs tri collision
    //================================
    isCollidingTri(args) {
        const px = Number(args.X);
        const py = Number(args.Y);
        const pz = Number(args.Z);

        const r = Number(args.R);

        for (const tri of this.triangles) {
            // first check if point is in triangle AABB
            if (!AABBColl(px, py, pz, r, tri.aabb)) continue;

            // then check triangle collision
            const result = calculate_collision(px, py, pz, r, tri);

            if (result) {
                this.normalX = result.nx;
                this.normalY = result.ny;
                this.normalZ = result.nz;
                return true;
            }
        }

        return false;
    }
}

Scratch.extensions.register(new CollisionKit());

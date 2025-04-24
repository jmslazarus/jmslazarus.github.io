// CollisionSystem class
function CollisionSystem(parent) {
    this.objects = [];
    this.parent = parent;
}

// Register an object in the collision system
CollisionSystem.prototype.register = function(object, callback) {
    if ([undefined, 'sector', 'star', 'planet', 'roidfield', 'player'].includes(object.type)) {
        return;
    }
    const boundingOvoid = this._computeBoundingOvoid(object);
    console.log("### registered object", object.type, object.name, object, boundingOvoid);
    this.objects.push({ object: object, boundingOvoid: boundingOvoid, callback: callback });
};

// Update bounding ovoids and check for collisions
CollisionSystem.prototype.update = function(deltaTime) {
    for (let i = 0; i < this.objects.length; i++) {
        const objA = this.objects[i];
        if (objA.object.visible !== undefined && !objA.object.visible) {
            continue; // Skip invisible objects
        }

        // Recompute bounding ovoid in case object or its mesh has moved
        objA.boundingOvoid = this._computeBoundingOvoid(objA.object);

        for (let j = i + 1; j < this.objects.length; j++) {
            const objB = this.objects[j];
            if (objB.object.visible !== undefined && !objB.object.visible) {
                continue; // Skip invisible objects
            }
            const collision = this._intersectsOvoid(objA.boundingOvoid, objB.boundingOvoid)//, 10, deltaTime);
            
            // Check for collisions between objA and objB
            if (collision.collided) {
                console.log('///', objA.object.visible, objB.object.visible, objA.object.name, objB.object.name, {objA, objB}, collision);
                if (typeof objA.object.collision === 'function') {
                    objA.object.collision.call(
                        objA.object, 
                        ...[
                            objA.object, 
                            collision.normal, 
                            objB
                        ]
                    );
                }
                
                if (typeof objB.object.collision === 'function') {
                    objB.object.collision.call(
                        objB.object, 
                        ...[
                            objB.object, 
                            collision.normal, 
                            objA
                        ]
                    );
                }
            }
        }
    }
};

// Computes a bounding ovoid (ellipsoid) for an object
CollisionSystem.prototype._computeBoundingOvoid = function(object) {
    const geometry = object.mesh?.geometry || object.geometry;

    // Check if geometry and vertices are valid
    if (!geometry) {
        // console.warn("No geometry. Fallback to parameters or unsupported type.", object.name, object.type, object);
        return { 
            center: new THREE.Vector3(
                object.position.x, object.position.y, object.position.z
            ), 
            radii: { x: 0, y: 0, z: 0 }, 
            velocity: new THREE.Vector3(0, 0, 0)
        }; // Fallback
    }
    const vertices = geometry.vertices;
    if (!vertices) {
        console.warn("Geometry does not use vertices. Fallback to parameters or unsupported type.");
        return { 
            center: new THREE.Vector3(object.position.x, 
            object.position.y, object.position.z), 
            radii: { x: 0, y: 0, z: 0 }, 
            velocity: new THREE.Vector3(0, 0, 0)
        }; // Fallback
    }

    // Determine the scale to use
    const scale = object.mesh ? object.mesh.scale : object.scale;

    // Initialize min and max as valid Vector3 instances
    const min = new THREE.Vector3(Infinity, Infinity, Infinity);
    const max = new THREE.Vector3(-Infinity, -Infinity, -Infinity);

    // Iterate through vertices
    for (let i = 0; i < vertices.length; i++) {
        const vertexData = vertices[i]?.position || vertices[i];
        if (!vertexData || typeof vertexData.x !== "number" || typeof vertexData.y !== "number" || typeof vertexData.z !== "number") {
            console.warn(`Skipping invalid vertex at index ${i}:`, vertices[i]);
            continue; // Skip invalid vertex
        }

        // Combine vertex coordinates with the object's mesh scale and position
        const worldVertex = new THREE.Vector3(
            vertexData.x * scale.x + object.position.x,
            vertexData.y * scale.y + object.position.y,
            vertexData.z * scale.z + object.position.z
        );

        // Update min and max
        min.x = Math.min(min.x, worldVertex.x);
        min.y = Math.min(min.y, worldVertex.y);
        min.z = Math.min(min.z, worldVertex.z);

        max.x = Math.max(max.x, worldVertex.x);
        max.y = Math.max(max.y, worldVertex.y);
        max.z = Math.max(max.z, worldVertex.z);
    }

    // Calculate the center of the ovoid
    const center = new THREE.Vector3(
        (min.x + max.x) / 2,
        (min.y + max.y) / 2,
        (min.z + max.z) / 2
    );

    // Calculate the radii along each axis
    const radii = {
        x: (max.x - min.x) / 2,
        y: (max.y - min.y) / 2,
        z: (max.z - min.z) / 2
    };

    return { 
        center: center, 
        radii: radii, 
        velocity: new THREE.Vector3(0, 0, 0) 
    };
};

// Checks for intersection between two ovoids and calculates the impact normal
CollisionSystem.prototype._intersectsOvoid = function(ovoidA, ovoidB, deltaTime) {
    // Calculate the distance between centers
    // const centerDistance = ovoidA.center.distanceTo(ovoidB.center);

    // Combine radii along each axis to determine overlap
    const radiiSum = new THREE.Vector3(
        ovoidA.radii.x + ovoidB.radii.x,
        ovoidA.radii.y + ovoidB.radii.y,
        ovoidA.radii.z + ovoidB.radii.z
    );

    // Check overlap on each axis
    const overlapX = Math.abs(ovoidA.center.x - ovoidB.center.x) < radiiSum.x;
    const overlapY = Math.abs(ovoidA.center.y - ovoidB.center.y) < radiiSum.y;
    const overlapZ = Math.abs(ovoidA.center.z - ovoidB.center.z) < radiiSum.z;
    // If there's overlap, compute the normal of the collision point
    if (overlapX && overlapY && overlapZ) {
        // console.log({overlapX, overlapY, overlapZ, ovoidA, ovoidB, radiiSum})
        const collisionPoint = new THREE.Vector3(
            (ovoidA.center.x + ovoidB.center.x) / 2,
            (ovoidA.center.y + ovoidB.center.y) / 2,
            (ovoidA.center.z + ovoidB.center.z) / 2
        );

        // Calculate the normal of the collision on ovoidA
        const normal = new THREE.Vector3(
            (collisionPoint.x - ovoidA.center.x) / (ovoidA.radii.x || 1),
            (collisionPoint.y - ovoidA.center.y) / (ovoidA.radii.y || 1),
            (collisionPoint.z - ovoidA.center.z) / (ovoidA.radii.z || 1)
        ).normalize();

        // Return true for collision and include the normal
        return { collided: true, normal: normal };
    }

    return { collided: false, normal: null };
};


function interpolatePosition(startPos, endPos, factor) {
    return new THREE.Vector3(
        startPos.x + factor * (endPos.x - startPos.x),
        startPos.y + factor * (endPos.y - startPos.y),
        startPos.z + factor * (endPos.z - startPos.z)
    );
}

CollisionSystem.prototype._detectInterpolatedCollision = function(objectA, objectB, steps = 10, deltaTime = 0.016) {
    for (let i = 0; i <= steps; i++) {
        const factor = i / steps; // Interpolation factor

        objectA.startPosition = objectA.center.clone(); // Position at the start of the frame
        objectA.endPosition = new THREE.Vector3(
            objectA.center.x + objectA.velocity.x * deltaTime,
            objectA.center.y + objectA.velocity.y * deltaTime,
            objectA.center.z + objectA.velocity.z * deltaTime
        );

        objectB.startPosition = objectB.center.clone(); // Position at the start of the frame
        objectB.endPosition = new THREE.Vector3(
            objectB.center.x + objectB.velocity.x * deltaTime,
            objectB.center.y + objectB.velocity.y * deltaTime,
            objectB.center.z + objectB.velocity.z * deltaTime
        );

        // console.log(factor, objectA, objectB)

        const interpolatedPosA = interpolatePosition(objectA.startPosition, objectA.endPosition, factor);
        const interpolatedPosB = interpolatePosition(objectB.startPosition, objectB.endPosition, factor);

        const ovoidA = this._computeBoundingOvoid({
            ...objectA,
            position: interpolatedPosA
        });
        const ovoidB = this._computeBoundingOvoid({
            ...objectB,
            position: interpolatedPosB
        });

        var obj = this._intersectsOvoid(ovoidA, ovoidB)

        // Perform collision detection at this interpolated state
        if (obj.collided) {
            console.log('Collision detected at factor:', factor, objectA?.name, objectB?.name);
            return obj; // Mid-frame collision detected
        }
    }

    return { collided: false, normal: null }; // No collision within this frame
};
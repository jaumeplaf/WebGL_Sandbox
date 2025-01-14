//Global structures
let Screen = {
    width 	: 0,
    height 	: 0,
    ratio   : 0,
    canvas 	: null,
    context : null,
    buffer 	: null
}
let rt = {
    display : document.getElementById('rtDisplay'),
    renderButton : document.getElementById('rtButton'),
    renderKey : 'Enter',
    theta : Math.PI,
    phi : -Math.PI/2.0,
    scene : null,
    camera : null,
    P0 : null,
    incX : null,
    incY : null,
    objects : [],
    lights : [],
    defaultColor : [1, 0, 1],
    bgColor : ACTIVE_SCENE.input.fogColor,
    maxDepth : 2
}
let hitResult = {
    t : 0,
    normal: [0, 1, 0],
	point: [0, 0, 0],
	surfaceId: "",
	type : "",
	material : null,
	specular : false,
	specularCoeff : null
}

function initHandlers()
{
    getScene();

    Screen.canvas = document.getElementById('rtCanvas');
    if(Screen.canvas === null){
        alert("Canvas not found");
        return;
    }
    Screen.context = Screen.canvas.getContext('2d');
    if(Screen.context === null){
        alert("Couldn't get context");
        return;
    }
    Screen.height = Screen.canvas.height;
    Screen.width = Screen.canvas.width;
    Screen.ratio = Screen.height / Screen.width; //?
    Screen.buffer = Screen.context.createImageData(Screen.width, Screen.height);

    rt.renderButton.addEventListener('click', function() {
        const startTime = performance.now();
        render();
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        updateRtDisplay(renderTime);
    });

    document.addEventListener('keydown', function(event) {
        if(event.key === rt.renderKey) {
            const startTime = performance.now();
            render();
            const endTime = performance.now();
            const renderTime = endTime - startTime;
            updateRtDisplay(renderTime);
        }
    });
}

function getScene()
{
    rt.scene = ACTIVE_SCENE; //Get scene from wglEngine
    rt.camera = rt.scene.camera; //Can access .fov, .position, .forwardVec, .upVec, .rightVec    
    rt.camera.getDirectionVectors(); //Update camera direction vectors
    rt.objects = rt.scene.meshActors; //Can access rt.objects[i].meshObject.material, .getPosition(), .getScale()
    rt.objects = rt.objects.filter(object => { //Remove objects that are not spheres, planes or triangles from the intersectable objects list
        const tag = object.meshObject.tags[0];
        return tag === "sphere" || tag === "plane" || tag === "triangle";
    });
    rt.lights = rt.scene.lights;
}

function updateRtDisplay(time) //Update render time display
{ 
    rt.display.textContent = "Last render took " + time.toFixed(2) + " ms";
}

function render() //Start rendering
{ 
    rt.incX = calcIncrement(rt.camera, Screen, 0);
    rt.incY = calcIncrement(rt.camera, Screen, 1);
    rt.P0 = calcP0(rt.incX, rt.incY, rt.camera, Screen);

    rayTracing();

    Screen.context.putImageData(Screen.buffer, 0, 0);
}

function calcIncrement(cam, scr, n)
{
    let t = (rt.camera.fov * Math.PI / 180);
    let w = 2*Math.tan(t/2);
    let h = w*scr.ratio;
    let aux = w / scr.width;
    switch(n)
    {
        case 0:
            let x = vec3.create();
            vec3.scale(x, cam.rightVec, aux);
            return x;
        case 1:
            let y = vec3.create();
            vec3.scale(y, cam.upVec, aux);
            return y;
        default:
            throw new Error("Invalid axis, should be 'x' or 'y'");
    }
}

function calcP0(incX, incY, cam, scr)
{
    let P = vec3.create();
    vec3.subtract(P, cam.position, cam.forwardVec); //screen center
    let hX = vec3.create();
    vec3.scale(hX, incX, ((scr.width - 1) / 2)); //half width
    let hY = vec3.create();
    vec3.scale(hY, incY, ((scr.height - 1) / 2)); //half height
    let aux = vec3.create();
    vec3.subtract(aux, P, hX); //middle left
    let res = vec3.create();
    return vec3.add(res, aux, hY); //top left
}

function rayTracing()
{
    for(let x = 0; x < Screen.width; x++){
        for(let y = 0; y < Screen.height; y++){
            let rayDir = computeRay(x, y);
            let color = [1, 0, 1];
            color = intersectScene(rayDir, 0);
            plot(x, y, color);
        }
    }
}

function computeRay(x, y)
{
    let scX = vec3.create();
    vec3.scale(scX, rt.incX, x);
    let scY = vec3.create();
    vec3.scale(scY, rt.incY, y);
    let pX = vec3.create();
    vec3.add(pX, rt.P0, scX);
    let pY = vec3.create();
    vec3.subtract(pY, pX, scY);
    let ray = vec3.create();
    vec3.subtract(ray, pY, rt.camera.position);
    let norm = vec3.create();
    vec3.normalize(norm, ray);
    return norm;
}

function intersectScene(rayDir, depth)
{
    let hit = computeFirstHit(rayDir);

    if(hit){
        if(hit.t !== null){
            let light = computeLight(hit, rayDir, depth)

            if(hit.specular && depth < rt.maxDepth){
                let r = computeReflection(hit, rayDir);
                let newHitPoint = vec3.create();
                let mult = vec3.create();
                vec3.multiply(mult, vec3.fromValues(0.001, 0.001, 0.001), r)
                vec3.add(newHitPoint, hit.point, mult);
                let col = intersectScene(r, depth + 1);
                let vCol = vec3.fromValues(col[0], col[1], col[2]);
                let m2 = vec3.create();
                vec3.multiply(m2, vec3.fromValues(hit.specularCoeff, hit.specularCoeff, hit.specularCoeff), vCol);
                let l2 = vec3.create();
                vec3.add(l2, light, m2);
                light = l2;
            }
            //return [light[0], light[1], light[2]];
            return rt.defaultColor;
        }
    }
    return rt.bgColor;
}

function computeLight(hit, ray, depth)
{
    return rt.defaultColor;
}

function computeShadowing(hit, ray, center, surfaceId)
{
    hit = null;
}

function computeReflection(hit, rayDir)
{
    let n = hit.normal;

    let m1 = vec3.create();
    vec3.multiply(m1, vec3.fromValues(2, 2, 2), n)
    let a = m1;
    let b = vec3.dot(rayDir, n);
    let m2 = vec3.create();
    vec3.multiply(m2, a, vec3.fromValues(b, b, b));
    let c = m2;

    let result = vec3.create();
    vec3.subtract(result, rayDir, c);
    let norm = vec3.create();
    vec3.normalize(norm, result);
    return norm;
}

function computeFirstHit(rayDir)
{
    let minT = null;
    for(let obj of rt.objects){
        rtObject(obj, obj.id);
        let hit = intersect(obj, rayDir);
        if(hit !== null && hit.t != null){
            if(minT === null || hit.t < minT.t){
                minT = hit;
            }
        }
        else{
            console.log("No hit");
        }
    }
    return minT;
}

function intersect(obj, rayDir)
{
    switch(obj.meshObject.tags[0]){
        case "sphere":
            return intersectSphere(obj, rayDir);
        case "plane":
            return intersectPlane(obj, rayDir);
        case "triangle":
            return intersectTriangle(obj, rayDir);
        default:
            return null;
    }
}

function intersectSphere(sphere, rayDir)
{
    let a = vec3.dot(rayDir, rayDir);

    let sRad = sphere.getUniformScale() / 2; //Sphere radius
    let sPos = sphere.getPosition();
    let sCenter = vec3.fromValues(sPos[0], sPos[1], sPos[2]); //Sphere center
    let cCenter = vec3.fromValues(rt.camera.position[0], rt.camera.position[1], rt.camera.position[2]); //Camera position

    let diff = vec3.create();
    vec3.subtract(diff, cCenter, sCenter); //Vector from camera to sphere center
    let mult = vec3.dot(rayDir, diff); 
    let b = 2 * mult;

    let diffTot = vec3.dot(diff, diff);
    let c = diffTot - Math.pow(sRad, 2);

    let discrim = Math.pow(b, 2) - (4 * a * c);
    if(discrim < 0) return null;
    let t1 = (-b + Math.sqrt(discrim)) / (2 * a);
    let t2 = (-b - Math.sqrt(discrim)) / (2 * a);
    let t = 0;

    if(t1 > 0 || t2 > 0){
        if(t1 < t2 && t1 > 0) t = t1;
        else if(t2 > 0) t = t2;
        else t = null;
    }
    
    let point = null;
    let normal = null;
    if(t !== null){
        point = vec3.create();
        let m1 = vec3.create();
        vec3.multiply(m1, vec3.fromValues(t, t, t), rayDir);
        vec3.add(point, cCenter, m1);
        let aux = vec3.create();
        vec3.subtract(aux, point, sCenter);
        let aux2 = vec3.create();
        normal = vec3.divide(aux2, aux, vec3.fromValues(sRad, sRad, sRad));
    }

    let hit = {... hitResult };
    hit.t = t;
    hit.normal = normal;
    hit.point = point;
    hit.surfaceId = sphere.id;
    hit.type = sphere.meshObject.tags[0];
    hit.material = rtMaterial(sphere.meshObject.material);
    hit.specular = hit.material.spec;
    hit.specularCoeff = hit.material.specCoef;

    return hit;
}

function intersectPlane(obj, rayDir)
{
    let hit = {... hitResult };
    let pNorm = obj.getPlaneNormal(); //Plane normal
    let pPos = obj.getPosition(); //Plane center
    let d = vec3.dot(pNorm, pPos) * -1; //Plane equation
    let numer = (-d) - vec3.dot(pNorm, rt.camera.position);
    let denom = vec3.dot(pNorm, rayDir);
    let t = numer / denom;
    let point = vec3.create();
    let m1 = vec3.create();
    vec3.multiply(m1, vec3.fromValues(t, t, t), rayDir);
    vec3.add(point, rt.camera.position, m1);

    if(t >= 0) hit.t = t;
    else hit.t = null;

    hit.normal = pNorm;
    hit.point = point;
    hit.surfaceId = obj.id;
    hit.type = obj.meshObject.tags[0];
    hit.material = rtMaterial(obj.meshObject.material);
    hit.specular = hit.material.spec;
    hit.specularCoeff = hit.material.specCoef;

    return hit;
}

function intersectTriangle(obj, rayDir)
{
    let hit = {... hitResult };
    const limit = 0.00001;

    let vertices = obj.meshObject.vertices;
    let v0 = vec3.fromValues(vertices[0], vertices[1], vertices[2]);
    let v1 = vec3.fromValues(vertices[3], vertices[4], vertices[5]);
    let v2 = vec3.fromValues(vertices[6], vertices[7], vertices[8]);

    let e1 = vec3.create();
    vec3.subtract(e1, v1, v0);
    let e2 = vec3.create();
    vec3.subtract(e2, v2, v0);

    let h = vec3.cross(rayDir, e2);
    let a = vec3.dot(e1, h);

    if(a > -limit && a < limit) return null;

    let f = 1 / a;
    let s = vec3.create();
    vec3.subtract(s, rt.camera.position, v0);
    let u = f * vec3.dot(s, h);

    if(u < 0 || u > 1) return null;

    let q = vec3.cross(s, e1);
    let v = f * vec3.dot(rayDir, q);

    if(v < 0 || u + v > 1) return null;

    let t = f * vec3.dot(e2, q);

    if(t < limit) return null;

    let point = vec3.create();
    let m1 = vec3.create();
    vec3.multiply(m1, vec3.fromValues(t, t, t), rayDir)
    vec3.add(point, rt.camera.position, m1);
    let normal = vec3.cross(e1, e2);
    let norm = vec3.create();
    vec3.normalize(norm, normal);

    hit.t = Math.abs(t);
    hit.normal = norm;
    hit.point = point;
    hit.surfaceId = obj.id;
    hit.type = obj.meshObject.tags[0];
    hit.material = rtMaterial(obj.meshObject.material);
    hit.specular = hit.material.spec;
    hit.specularCoeff = hit.material.specCoef;

    return hit;
}

function plot(x, y, color)
{
    let index = (x + y * Screen.buffer.width) * 4;
    Screen.buffer.data[index + 0] = color[0] * 255;
    Screen.buffer.data[index + 1] = color[1] * 255;
    Screen.buffer.data[index + 2] = color[2] * 255;
    Screen.buffer.data[index + 3] = 255;

    return index;
}

function main()
{
    //Initialize handlers
    initHandlers();
}

//Run code
main();

//Helper functions
function rtMaterial(material, spec = false, specCoef = 0.5) //Converts wglEngine material to rayTracer material
{
    material.rtCol = material.Ma;
    material.spec = spec;
    material.specCoef = material.spec ? specCoef : null;
    return material;
}

function rtObject(object, id, shadow = true) //Converts wglEngine object to rayTracer object
{
    object.id = id;
    object.shadow = shadow;
}
////////////////////////////////
// RAY TRACING - example 24-25//
////////////////////////////////


//Angles to calculate the position of centre
var theta = Math.PI;
var phi = -Math.PI/2.0;

// Inicialitzem el RayTracing
function inicialitzar(Scene) {

	Screen.canvas = document.getElementById("glcanvas");
	if (Screen.canvas == null)	{
		alert("Invalid element: " + id);
		return;
	}
	Screen.context = Screen.canvas.getContext("2d");
	if(Screen.context == null){
		alert("Could not get context");
		return;
	}
	Screen.width = Screen.canvas.width;
	Screen.height = Screen.canvas.height;
	Screen.buffer = Screen.context.createImageData(Screen.width,Screen.height);

	// Calculem els eixos de la camera
	calcularEixos(Scene);

	// Calculem els increments i P0 (GLOBALS)
	incX = calcularIncrementX(Scene.Camera,Screen);
	incY = calcularIncrementY(Scene.Camera,Screen);
	P0 = calcularP0(incX,incY,Scene.Camera,Screen);
	
	// Executem RayTracing
	rayTracing(Scene, Screen);
	Screen.context.putImageData(Screen.buffer, 0, 0);
};

// Calcular increment de X
function calcularIncrementX(Cam,Scr) {
	var rati = (Scr.height/Scr.width);

	var theta = (Cam.fov * Math.PI / 180);
	var w = 2*Math.tan(theta/2); // Calculem w' = 2*tg(theta/2)
	var h = w*rati; // Calculem h' = w'*rati

	var aux = w/Scr.width; // w'/W
	var incX = vec3.scale(Cam.X,aux); // Calculem increment de X (X * 2*tg(theta/2)/W)

	return incX;
}

// Calcular increment de Y
function calcularIncrementY(Cam,Scr) {
	var rati = (Scr.height/Scr.width);

	var theta = (Cam.fov * Math.PI / 180);
	var w = 2*Math.tan(theta/2); // Calculem w' = 2*tg(theta/2)
	var h = w*rati; // Calculem h' = w'*rati

	var aux = rati*w/Scr.height; // rati*w'/H
	var incY = vec3.scale(Cam.Y,aux); // Calculem increment de Y (Y * 2*tg(theta/2)/W)

	return incY;
}

// Calcular P0
function calcularP0(incX,incY,Cam,Scr) {

	var P = vec3.subtract(Cam.position,Cam.Z); // Calculem P (O - Z)
	var aux = vec3.scale(incX,((Scr.width-1)/2)); // Increment de X * (W-1)/2
	var aux2 = vec3.scale(incY,((Scr.height-1)/2)); // Increment de Y * (H-1)/2
	var aux3 = vec3.subtract(P,aux); // P - Increment de X * (W-1)/2
	var P0 = vec3.add(aux3,aux2); // Calculem P0 (P - Increment de X * (W-1)/2 + Increment de Y * (H-1)/2)

	return P0;
}

// Calcular els eixos de la camera
function calcularEixos(Scene) {
	Scene.Camera.Z = vec3.normalize(vec3.subtract(Scene.Camera.position, Scene.Camera.centre)); // |O - C|
	Scene.Camera.X = vec3.normalize(vec3.cross(Scene.Camera.up, Scene.Camera.Z)); // |up x Z|
	Scene.Camera.Y = vec3.cross(Scene.Camera.Z, Scene.Camera.X); // Z x X
}


function plot(x,y,color){
	var index = (x+y*Screen.buffer.width)*4;
	Screen.buffer.data[index+0] = color[0] * 255;
	Screen.buffer.data[index+1] = color[1] * 255;
	Screen.buffer.data[index+2] = color[2] * 255;
	Screen.buffer.data[index+3] = 255;
	return index;
}

///////////////////////////////////
///// MAIN ALGORITHM //////////////
///////////////////////////////////
// Pintar cada pixel
function rayTracing(Scene, Screen) {
	for(var x = 0; x < Screen.width; x++){
		for (y = 0; y < Screen.height; y++){
			var rDirection = computeRay(incX,incY,P0,Scene.Camera,x,y);
			
			//We set default color
			var color = [0.3,0.4,1];
			//We calculate the intersection with all objects
			color = IntersectScene(Scene, rDirection, Scene.Camera.position, 0);
			plot(x,y,color);
		}
	}
	console.log("Done");
}

//The object type where we save all hit information
var hitInfo = {
	t: 0,
	normal: 0,
	point: 0,
	surfaceId: "",
	type : "",
	material : 0,
	specular : false,
	specularCoeff : null
};

//Function to intersect whole scene
function IntersectScene(scene, ray, origin, depth){
	//We get the first hit information
	var hit = computeFirstHit(scene, ray, origin);
	//Check if it's not undefined neither null
	if (hit){
		if (hit.t !== null){
			//Compute light
			var light = computeLight(scene, hit, ray, depth);
			//Check if surface we hit is specular and if we can proceed (necessary to stop recursivity)
			if (hit.specular && depth < 4){
				//Compute reflected ray
				var d1 = computeReflectionDirection(hit, ray);	//The new ray will be the vector d1 and origin hit.point
				//Get a little bit modified origin point in order to have correct specular behaviour (avoid "self-specularity")
				var newHitPoint = vec3.add(hit.point, vec3.multiply(vec3.fromValues(0.01, 0.01, 0.01), d1));
				//Re-intersect whole scene with new vector and ray
				var color = IntersectScene(scene, d1, newHitPoint, depth + 1);
				//Convert into vec3 from gl-matrix
				var colorVec3 = vec3.fromValues(color[0], color[1], color[2]);
				//We add new specular property to light
				light = vec3.add(light, vec3.multiply(vec3.fromValues(hit.specularCoeff, hit.specularCoeff, hit.specularCoeff), colorVec3));
			}
			return [light[0], light[1], light[2]];
			//return [1.0, 0.0, 0.0];
		}
	}
	return [0.5, 0.5, 0.5];
}

//Function to compute light
function computeLight(scene, hit, ray, depth) {
    var ambientLight = vec3.fromValues(0.1, 0.1, 0.1); // Ambient light contribution
    var lightContribution = vec3.clone(ambientLight);

    for (var light of scene.Lights) {
        var lightDir = vec3.subtract(vec3.create(), light.position, hit.point);
        vec3.normalize(lightDir, lightDir);

        // Check for shadows
        var shadowRay = vec3.clone(lightDir);
        var shadowHit = computeShadowing(scene, shadowRay, hit.point, hit.surfaceId);
        if (shadowHit) {
            continue; // Skip this light if the point is in shadow
        }

        // Diffuse lighting (Lambertian reflectance)
        var diffuseFactor = Math.max(0, vec3.dot(hit.normal, lightDir));
        var diffuse = vec3.multiply(vec3.create(), hit.material.mat_diffuse, light.color);
        vec3.scale(diffuse, diffuse, diffuseFactor);

        // Specular lighting (Phong reflection model)
        var specular = vec3.fromValues(0, 0, 0);
        if (hit.specular) {
            var viewDir = vec3.negate(vec3.create(), ray);
            var reflectDir = computeReflectionDirection(hit, lightDir);
            var specFactor = Math.pow(Math.max(0, vec3.dot(viewDir, reflectDir)), hit.material.alpha[0]);
            specular = vec3.multiply(vec3.create(), hit.material.mat_specular, light.color);
            vec3.scale(specular, specular, specFactor);
        }

        // Add contributions to the light
        vec3.add(lightContribution, lightContribution, diffuse);
        vec3.add(lightContribution, lightContribution, specular);
    }

    return lightContribution;
}

//Function to compute the reflected ray
function computeReflectionDirection(hit, ray){
	var n = vec3.normalize(hit.normal);

	var term1 = vec3.multiply(vec3.fromValues(2, 2, 2), n);
	var term2 = vec3.dot(ray, n);
	var term3 = vec3.multiply(term1, vec3.fromValues(term2, term2, term2));
	return vec3.normalize(vec3.subtract(ray, term3));
}

//Compute shadowing
function computeShadowing(scene, ray, center, surfaceId){
	var hit = null;
	// TO BE IMPLEMENTED
	return hit;
}

//Function to compute the first hit, the nearest shape we interact with
function computeFirstHit(scene, ray, centre){
	var lowestT = null;
	//We iterate through all shapes
	for(var primitive of scene.Shapes){
		//We intersect the whole scene
		var hit = intersect(primitive, ray, centre);
		//Check whether we have a hit or not
		if (hit !== null && hit.t !== null){
			//Check if we haven't found any yet or it has a lower t than the suposed to be the lowest
			if (lowestT === null || hit.t < lowestT.t){
				lowestT = hit;
			}
		}
	}
	return lowestT;
}

//Function that intersects a primitive acording to its type
function intersect(primitive, ray, centre){
	switch (primitive.tipus){
		case "esfera":
			return QuadraticEquationSolver(primitive, centre, ray);
			break;
		case "pla":
			return PlaneIntersection(primitive, centre, ray);
			break;
		case "triangle":
			return TriangleIntersection(primitive, centre, ray);
			break;
	}
}

//Function that solves the quadratic equations related to spheres so as to find the hit information
function QuadraticEquationSolver(sphere, CamCentre, v){
	var a = vec3.dot(v, v);
	
	var SphereCentre = vec3.fromValues(sphere.centre[0], sphere.centre[1], sphere.centre[2]);
	var diff = vec3.subtract(CamCentre, SphereCentre);
	var mult = vec3.dot(v, diff);
	var b = mult * 2;
	
	var diff1 = vec3.subtract(CamCentre, SphereCentre);
	var diffTot = vec3.dot(diff1, diff1);
	var c = diffTot - Math.pow(sphere.radi, 2);
	
	var sqrtPart = Math.pow(b, 2) - (4 * a * c);
	if (sqrtPart < 0)
		return null;
	
	var t1 = (-b + Math.sqrt(sqrtPart)) / (2 * a);
	var t2 = (-b - Math.sqrt(sqrtPart)) / (2 * a);
	var t;
	
	if (t1 > 0 || t2 > 0){
		if ((t1 < t2 && t1 > 0))
			t = t1;
		else if (t2 > 0)
			t = t2;
		else{
			t = null;
		}
	}
	
	var point = null;
	var normal = null;
	if (t !== null){
		point = vec3.add(CamCentre, vec3.multiply(vec3.fromValues(t, t, t), v));
		normal = vec3.divide(vec3.subtract(point, SphereCentre), vec3.fromValues(sphere.radi, sphere.radi, sphere.radi));
	}

	var h = { ...hitInfo };
	h.t = t;
	h.normal = normal;
	h.point = point;
	h.surfaceId = sphere.id;
	h.type = sphere.tipus;
	h.material = sphere.material;
	h.specular = sphere.specular;
	h.specularCoeff = sphere.specularCoeff;

	return h;
}

//Function to get hit information when we intersect a plane
function PlaneIntersection(primitive, centre, v){
	var h = { ...hitInfo };
		
	var d = vec3.dot(primitive.normal, primitive.point) * -1;
	var numerator = (-d) - (vec3.dot(primitive.normal, centre));
	var denominator = vec3.dot(primitive.normal, vec3.normalize(v));
	var t = numerator / denominator;
	var point = vec3.add(centre, vec3.multiply(vec3.fromValues(t, t, t), vec3.normalize(v)));

	if (t >= 0)
		h.t = t;
	else
		h.t = null;
	
	h.normal = primitive.normal;
	h.point = point;
	h.surfaceId = primitive.id;
	h.type = primitive.tipus;
	h.material = primitive.material;
	h.specular = primitive.specular;
	h.specularCoeff = primitive.specularCoeff;
	
	return h;
}

//Function to get hit information when we intersect a triangle
function TriangleIntersection(primitive, centre, ray){

	var h = { ...hitInfo };
	
	var e1 = vec3.subtract(primitive.b, primitive.a);
	var e2 = vec3.subtract(primitive.c, primitive.a);
	
	var h = vec3.cross(ray, e2);
	var a = vec3.dot(e1, h);
	
	if (a > -0.00001 && a < 0.00001)
		return null;
	
	var f = 1 / a;
	var s = vec3.subtract(centre, primitive.a);
	var u = f * vec3.dot(s, h);
	
	if (u < 0.0 || u > 1.0)
		return null;
	
	var q = vec3.cross(s, e1);
	var v = f * vec3.dot(ray, q);
	
	if (v < 0 || v + u > 1.0)
		return null;
	
	var t = f * vec3.dot(e2, q);
	
	if (t < 0.00001)
		return null;
	
	var point = vec3.add(centre, vec3.multiply(vec3.fromValues(t, t, t), ray));
	
	h.t = Math.abs(t);
	h.normal = vec3.normalize(vec3.cross(e1, e2));
	h.point = point;
	h.surfaceId = primitive.id;
	h.type = primitive.tipus;
	h.material = primitive.material;
	h.specular = primitive.specular;
	h.specularCoeff = primitive.specularCoeff;
	
	return h;
}

// Computar el raig
function computeRay(incX,incY,P0,Cam,x,y){
	// Calculem la direccio per a cada pixel
	var aux = vec3.scale(incX,x); // Increment de X * x
	var aux2 = vec3.scale(incY,y); // Increment de Y * y
	var aux3 = vec3.add(P0,aux); // P0 + Increment de X * x
	var aux4 = vec3.subtract(aux3,aux2); // P0 + Increment de X * x - Increment de Y * y
	var ray = vec3.subtract(aux4,Cam.position); // Obtenim raig (P0 + Increment de X * x - Increment de Y * y - O)
	var rayNorm = vec3.normalize(ray); // Normalitzem el raig

	return rayNorm;
}

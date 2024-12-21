class Light
{
    constructor(position, LAmbient, LDiffuse, LSpecular)
    {
        this.scene = ACTIVE_SCENE;
        this.proxyMaterial = new Material(this.scene, "VS_01", "FS_01", false, false, false);
        this.position = position;
        this.modelScale = 10;
        this.La = LAmbient;
        this.Ld = LDiffuse;
        this.Ls = LSpecular;
        
        this.addToScene();
        this.ID = this.scene.lights.length - 1;
    }
    addToScene()
    {
        this.scene.addLight(this);
        if(this.scene.lights.length === 1) updateLightUI(this.scene.lights[parseInt(inLights.value)]);
    }
    setLa(inLa)
    {
        this.La = inLa;
        console.log("NEW La: " + this.La);
        this.proxy.setColor(this.La);
    }

    setLd(inLd)
    {
        this.Ld = inLd;
    }

    setLs(inLs)
    {
        this.Ls = inLs;
    }
    
    addProxy(model)
    {
       this.proxy = new MeshActor(model, this.proxyMaterial);
       this.proxy.setMatrix(this.position[0], this.position[1], this.position[2], this.modelScale);
       this.proxy.setColor(this.La);    
    }

    proxyUpdateColor()
    {
        this.proxy.setColor(this.La);
    }
    
    proxyFaceDirection(object, direction)
    {
        let planeNormal = [0, 1, 0];
        let normDir = vec3.create();
        vec3.normalize(normDir, direction);

        let dotVal = vec3.dot(planeNormal, normDir);
        let angle = Math.acos(dotVal) * 180 / Math.PI;

        let axis = vec3.create();
        vec3.cross(axis, planeNormal, normDir);
        vec3.normalize(axis, axis);

        object.setRotation(angle, axis);
    }
}

class PointLight extends Light
{
    constructor(position, LAmbient, LDiffuse, LSpecular)
    {
        super(position, LAmbient, LDiffuse, LSpecular); 
        this.proxyMesh = new MeshObject(Lightbulb01, this.proxyMaterial);
        this.addProxy(this.proxyMesh);
    }
}

class SpotLight extends Light
{
    constructor(position, LAmbient, LDiffuse, LSpecular, inDirection = [0, -1, 0], inAngle = 30.0)
    {
        super(position, LAmbient, LDiffuse, LSpecular);
        this.direction = inDirection;
        this.angle = inAngle;
        this.proxyMesh = new MeshObject(Spotlight01, this.proxyMaterial);
        this.addProxy(this.proxyMesh);
        this.proxyFaceDirection(this.proxy, this.direction);
    }
}

class AreaLight extends Light
{
    constructor(position, LAmbient, LDiffuse, LSpecular, inDirection = [0, -1, 0], inWidth = 4.0, inHeight = 2.0)
    {
        super(position, LAmbient, LDiffuse, LSpecular);
        this.direction = inDirection;
        this.width = inWidth;
        this.height = inHeight;
        this.proxyMesh = new MeshObject(Arealight01, this.proxyMaterial);
        this.addProxy(this.proxyMesh);
        this.proxy.setScale(this.width, this.height, 1);
        this.proxyFaceDirection(this.proxy, this.direction);
    }
}

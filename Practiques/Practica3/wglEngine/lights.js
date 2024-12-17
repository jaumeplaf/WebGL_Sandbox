//TODO: implement lights, look how to pass them to the shader (uniform struct?)

class Light
{
    constructor(position, inLa, inLd, inLs)
    {
        this.position = vec3.create();
        this.La = inLa;
        this.Ld = inLd;
        this.Ls = inLs;
    }
}

class PointLight extends Light
{
    constructor(position, inLa, inLd, inLs)
    {
        super(position, inLa, inLd, inLs);
    }
}

class SpotLight extends Light
{
    constructor(position, inLa, inLd, inLs)
    {
        super(position, inLa, inLd, inLs);
        this.direction = vec3.create();
        this.angle = 0.0;
    }
}

class AreaLight extends Light
{
    constructor(position, inLa, inLd, inLs)
    {
        super(position, inLa, inLd, inLs);
        this.direction = vec3.create();
        this.width = 0.0;
        this.height = 0.0;
    }
}

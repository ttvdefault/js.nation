let Particles = new function() {

    let particleCount;

    let particlesGeom;
    let particleTexture;
    let particleSystem;

    this.setUp = function() {
        particleCount = (($(document).width() * $(document).height()) / (1920 * 1080)) * Config.baseParticleCount;

        particlesGeom = new THREE.Geometry();
        let texLoader = new THREE.TextureLoader();
        particleTexture = texLoader.load("./img/particle.png");
        particleTexture.minFilter = THREE.LinearFilter;

        var pMaterial = new THREE.PointsMaterial({
            color: 0xFF0000,
            opacity: Config.particleOpacity,
            size: 5,
            map: particleTexture,
            blending: THREE.AdditiveBlending,
            transparent: true
        });

        particleSystem = new THREE.Points(particlesGeom, pMaterial);
        particleSystem.sortParticles = true;
        particleSystem.geometry.dynamic = true;

        initializeParticles();

        Scene.glScene.add(particleSystem);

        Callbacks.addCallback(this.updateParticles, Priority.NORMAL);
    }

    this.updateParticles = function() {
        particlesGeom.vertices.forEach(particle => {
           updatePosition(particle);
        });

        particleSystem.geometry.__dirtyVertices = true;
        particleSystem.geometry.verticesNeedUpdate = true;
    }

    let updatePosition = function(particle) {
        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;
        particle.z += 1;
    }

    let initializeParticles = function() {
        for (let i = 0; i < particleCount; i++) {
            let particle = new THREE.Vector3(0, 0, 0);
            resetVelocity(particle);
            particlesGeom.vertices.push(particle);
        }
    }

    let respawnParticle = function(particle) {
        resetPosition(particle);
        resetVelocity(particle);
    }

    let resetPosition = function(particle) {
        particle.x = 0;
        particle.y = 0;
        particle.z = 0;
    }

    let resetVelocity = function(particle) {
        let r = Config.particleFinalRadius * Math.random();
        let theta = MathConstants.TWO_PI * Math.random();
        particle.velocity = new THREE.Vector2(r * Math.cos(theta), r * Math.sin(theta));
    }

}

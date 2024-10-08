function pop(element) {
    let amount = 60;
    const bbox = element.getBoundingClientRect();
    const coords = getGlobalCoordinates(element)
    const x = coords.left + bbox.width / 2;
    const y = coords.top + bbox.height / 2;
    let doc_content = document.querySelector(".content");
    for (let i = 0; i < amount; i++) {
        const particle = document.createElement('particle');
		particle.style.borderRadius = '50%';
        createParticle(particle, doc_content, x, y);
    }
}

function createParticle(particle, doc_content, x, y) {
    let width = Math.floor(Math.random() * 30 + 8);
    let height = width;
    let destinationX = (Math.random() - 0.5) * 300;
    let destinationY = (Math.random() - 0.5) * 300;
    let rotation = Math.random() * 520;
    let delay = Math.random() * 200;
    const hue = Math.random() * 30 + (Math.random() < 0.5 ? 30 : 0);
    const color = `hsl(${hue}, 70%, 50%)`;
    particle.style.boxShadow = `0 0 ${Math.floor(Math.random() * 10 + 10)}px ${color}`;
    particle.style.background = color;
    particle.style.width = `${width}px`;
    particle.style.height = `${height}px`;
    particle.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
    doc_content.appendChild(particle);
    const animation = particle.animate([
        {
            transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(0deg)`,
            opacity: 1
        },
        {
            transform: `translate(-50%, -50%) translate(${x + destinationX}px, ${y + destinationY}px) rotate(${rotation}deg)`,
            opacity: 0
        }
    ], {
        duration: Math.random() * 1000 + 5000,
        easing: 'cubic-bezier(0, .9, .57, 1)',
        delay: delay
    });
    animation.onfinish = function() {
        particle.remove();
    };
}

function getGlobalCoordinates(element) {
    function getOffset(element) {
        let offsetTop = 0;
        let offsetLeft = 0;
        while (element) {
            offsetTop += element.offsetTop;
            offsetLeft += element.offsetLeft;
            element = element.offsetParent;
        }
        return { top: offsetTop, left: offsetLeft };
    }
    const elementOffset = getOffset(element);
    const top = elementOffset.top;
    const left = elementOffset.left;
    return {
        top: top,
        left: left
    };
}
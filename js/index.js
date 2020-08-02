const data = [],
    box1 = document.querySelector('.box'),
    box2 = document.querySelector('.box.white'),
    box3 = document.querySelector('.guess .box'),
    white = document.querySelector('#white'),
    black = document.querySelector('#black'),
    guess = document.querySelector('#guess'),
    diagram = document.querySelector('#diagram'),
    [slider1, slider2] = document.querySelectorAll('input[type=range]'),
    randomColor = () => {
        color = {
            'r': Math.random(),
            'g': Math.random(),
            'b': Math.random()
        };

        box1.style.backgroundColor = box2.style.backgroundColor = box3.style.backgroundColor = `rgb(${color.r * 255}, ${color.g * 255}, ${color.b * 255})`;
    },
    chooseColor = (c) => {
        data.push({
            'input': color,
            'output': [c]
        });

        if (guess.disabled) {
            guess.removeAttribute('disabled');
            guess.removeAttribute('title');
        }

        box3.innerHTML = '';
        randomColor();
        handleSliders();
    },
    handleSliders = () => {
        net = new brain.NeuralNetwork({
            'hiddenLayers': Array(Number(slider1.value)).fill(Number(slider2.value))
        });

        updateUI();
    },
    updateUI = () => {
        try {
            net.train(data);
            diagram.innerHTML = brain.utilities.toSVG(net);
            diagram.append(`Total # nodes: ${Number(slider1.value) * Number(slider2.value)}`);
        } catch (err) { }
    };

let color,
    net;

white.addEventListener('click', chooseColor.bind(window, 1));
black.addEventListener('click', chooseColor.bind(window, 0));
guess.addEventListener('click', () => {
    updateUI()
    const res = net.run(color)[0];

    box3.innerHTML = `(${Math.floor(res * 100)}% sure)<br>`
    box3.innerHTML += res < 0.5 ? 'white' : 'black';
    box3.style.color = res < 0.5 ? 'white' : 'black';
});
slider1.addEventListener('change', handleSliders);
slider2.addEventListener('change', handleSliders);

randomColor();
handleSliders();
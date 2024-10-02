document.addEventListener('DOMContentLoaded', () => {
    const card = document.querySelector('.profile-card');
    const flipButton = document.getElementById('flipButton');
    const flipBackButton = document.getElementById('flipBackButton');

    flipButton.addEventListener('click', () => {
        card.classList.add('is-flipped');
    });

    flipBackButton.addEventListener('click', () => {
        card.classList.remove('is-flipped');
    });

});

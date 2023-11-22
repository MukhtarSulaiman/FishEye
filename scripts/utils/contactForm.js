const closeModalBtn = document.querySelector('.close-modal');
const modal = document.getElementById('contact_modal');

function displayModal() {
    modal.style.display = 'block';
    modal.firstElementChild.children[1].style.display = 'block';
}

function closeModal() {
    if (modal.firstElementChild.childElementCount >= 3) modal.firstElementChild.lastElementChild.remove();
    modal.style.display = 'none';
}

closeModalBtn.addEventListener('click', closeModal);
closeModalBtn.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModal();});
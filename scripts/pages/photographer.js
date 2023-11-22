import { fetchPhotographers } from '../utils/fetchData.js';
import { addingAtributes } from '../utils/addAttributes.js';

const main = document.querySelector('main');
const select = document.querySelector('.select-container>select');

// ----------------------- Gets photograper ----------------------
const getPhotographerData = async () => {
    const photographerId = new URL(document.location.href).searchParams.get('id');
    const ID = parseInt(photographerId);

    const data = await fetchPhotographers();

    const filteredPhotographer = data.photographers.find(photographer => photographer.id === ID);
    const filteredPhotographerMedia = data.media.filter(media => media.photographerId === ID);

    return { filteredPhotographer, filteredPhotographerMedia };
};


// ----------------------- Sets photograper header -----------------------
const setPhotograperHeader = (name, city, country, tagline, portrait) => {
    const photographerHeader = document.querySelector('.photograph-header');

    const picture = `assets/images/photographers/${portrait}`;

    const header = `
        <div class="content">
            <h1>${name}</h1>
            <p>${city}, ${country}</p>
            <p>${tagline}</p>
            <!-- <small>200€/jour</small> -->
        </div>
        <button class="contact_button" onclick="displayModal()" type="button" aria-label="Ouvrir le formulaire de contact" tabindex="2">
            Contactez-moi
        </button>
        <img src="${picture}" alt="${name}">
    `;

    photographerHeader.innerHTML = header;
};


let totalLikes = 0;

// ----------------------- Creates factory pattern -----------------------
const mediaFactory = (object, name, cardIndex) => {
    const media = {
        title: object.title,
        mediaUrl: object.image ? object.image : object.video,
        likes: object.likes,
        id: object.id,

        createMedia: () => {
            totalLikes += media.likes;

            const ExtentionType = media.mediaUrl.split('.')[1];
            const mediaElement = ExtentionType === 'mp4' ?
                `<video tabindex=${5 + cardIndex} aria-label="ouvrir le media ${media.title}" controls><source src="./assets/images/photographersWorks/${name.split(' ')[0]}/${media.mediaUrl}"/></video>`
                : `<img tabindex=${5 + cardIndex} src="./assets/images/photographersWorks/${name.split(' ')[0]}/${media.mediaUrl}" alt="le médial ${media.title}">`;

            return `
                <div class="card" data-index="${cardIndex++}" >        
                    ${mediaElement}
                    <figcaption>
                        <h2 aria-hidden="true">${media.title}</h2>
                        <div>
                            <small aria-label="likes">${media.likes}</small>
                            <i class="fa-solid fa-heart" aria-hidden="true"></i>
                        </div>
                    </figcaption>
                </div>`;
        }
    };
    return media;
};


// ----------------------- Calls factory function -----------------------
const callFactoryFunction = (filteredPhotographerMedia, name) => {
    const photographerMedia = document.querySelector('.galary-wrapper');
    photographerMedia.replaceChildren();

    let cardIndex = 0;
    totalLikes = 0;

    filteredPhotographerMedia.forEach((media) => {
        photographerMedia.innerHTML += mediaFactory(media, name, cardIndex++).createMedia();
    });
};


// ----------------------- Adding likes and pricing info -----------------------
const addTotalLikesAndPricingInfo = (price) => {
    const photographerMedia = document.querySelector('.photograph-total-likes');

    const likesAndPricing = `
        <div class="photograph-likes-pricing">
            <div>
                <span> ${totalLikes} </span> <i class="fa-solid fa-heart" aria-hidden="true"></i>
            </div>
            <span>${price}€ / jour</span>
        </div>`;

    photographerMedia.innerHTML = likesAndPricing;

    const totalMediaLikes = document.querySelector('.photograph-likes-pricing span');

    Array.from(document.querySelectorAll('.galary-wrapper .card i')).map((like) => {
        like.addEventListener('click', () => {
            const small = like.parentElement.firstElementChild;
            const likes = parseInt(small.textContent);
            const parsedTotalMediaLikes = parseInt(totalMediaLikes.textContent);

            const dataListener = like.getAttribute('data-listener');

            if (dataListener === null) {
                like.setAttribute('data-listener', true);

                small.textContent = likes + 1;
                totalMediaLikes.textContent = parsedTotalMediaLikes + 1;

            } else {
                if (dataListener === 'false') {
                    like.setAttribute('data-listener', true);
                    small.textContent = likes + 1;
                    totalMediaLikes.textContent = parsedTotalMediaLikes + 1;

                } else {
                    like.setAttribute('data-listener', false);
                    small.textContent = likes - 1;
                    totalMediaLikes.textContent = parsedTotalMediaLikes - 1;
                }
            }
        });
    });
};

// Customizing select
const customizeSelectElement = () => {
    select.addEventListener('mousedown', (event) => {
        select.parentElement.classList.toggle('select-collapse');
        event.preventDefault();

        const dropdown = document.createElement('ul');
        addingAtributes(dropdown, {
            role: 'listbox',
            tabindex: '0',
            'aria-activedescendant': 'listbox-1'
        });

        let listbox = 1;

        [...select.children].forEach((option) => {
            const dropdownOptions = document.createElement('li');
            dropdownOptions.textContent = option.textContent;
            dropdown.appendChild(dropdownOptions);

            addingAtributes(dropdownOptions, {
                role: 'option',
                id: `listbox-${listbox++}`,
                'aria-selected': listbox === 1 ? 'true' : ''
            });

            dropdownOptions.addEventListener('mousedown', (e) => {
                event.stopPropagation();

                select.value = option.value;
                select.parentElement.value = option.value;
                select.dispatchEvent(new Event('change'));
                select.parentElement.dispatchEvent(new Event('change'));
                dropdown.remove();
                select.parentElement.classList.toggle('select-collapse');
            });
        });

        select.parentElement.appendChild(dropdown);
    });
};


// ----------------------- Sorting media -----------------------
const sortingMedia = (filteredPhotographerMedia, name, price) => {

    filteredPhotographerMedia.sort((a, b) => b.likes - a.likes);

    select.addEventListener('change', (event) => {

        const filterType = event.target.value;

        filteredPhotographerMedia.sort((a, b) => {

            if (filterType === 'popularity') {

                return b.likes - a.likes;

            } else if (filterType === 'title') {

                const titleA = a.title.toLowerCase();
                const titleB = b.title.toLowerCase();

                if (titleA < titleB) return -1;
                if (titleA > titleB) return 1;

            } else if (filterType === 'date') {
                if (new Date(a.date) > new Date(b.date)) return -1;
                if (new Date(a.date) < new Date(b.date)) return 1;
            }
        });

        callFactoryFunction(filteredPhotographerMedia, name);
        addTotalLikesAndPricingInfo(price);
        // eslint-disable-next-line no-use-before-define
        createLightboxElements();
    });
    callFactoryFunction(filteredPhotographerMedia, name);
    addTotalLikesAndPricingInfo(price);

};


// ----------------------- Creating lightbox -----------------------
const createLightboxElements = () => {
    const cards = document.getElementsByClassName('card');

    // Creating elements
    const lightBoxContainer = document.createElement('section');
    const lightBoxContent = document.createElement('div');
    const lightBoxImage = document.createElement('img');
    const lightBoxVideo = document.createElement('video');
    const lightBoxSource = document.createElement('source');
    const lightBoxH2 = document.createElement('h2');
    const lightBoxPrev = document.createElement('i');
    const lightBoxNext = document.createElement('i');
    const lightBoxXMark = document.createElement('i');

    // Adding classes
    lightBoxContainer.classList.add('lightbox');
    lightBoxContent.classList.add('lightbox-content');
    lightBoxImage.classList.add('lightbox-image');
    lightBoxPrev.classList.add('fa', 'fa-angle-left', 'light-box-prev');
    lightBoxNext.classList.add('fa', 'fa-angle-right', 'light-box-next');
    lightBoxXMark.classList.add('fa', 'fa-xmark', 'light-box-remove-btn');

    const lightBoxContainerAttributes = {
        role: 'dialog',
        'aria-modal': 'true'
    };

    const lightBoxContentAttributes = {
        id: 'lightbox-content',
        'aria-label': 'Vue rapprochée du média'
    };

    const lightBoxMediaAttributes = {
        role: 'media',
        'aria-label': 'le média actuel'
    };

    const lightBoxH2Attributes = {
        'aria-hidden': 'true'
    };

    const lightBoxNextAttributes = {
        role: 'button',
        tabindex: '101',
        'aria-controls': 'lightbox-content',
        'aria-label': 'image suivante'
    };

    const lightBoxPrevAttributes = {
        role: 'button',
        tabindex: '100',
        'aria-controls': 'lightbox-content',
        'aria-label': 'image précédente'
    };

    const lightBoxXMarkAttributes = {
        role: 'button',
        tabindex: '102',
        'aria-label': 'fermer la bôite de dialogue'
    };

    // Adding attributes
    addingAtributes(lightBoxContainer, lightBoxContainerAttributes);
    addingAtributes(lightBoxContent, lightBoxContentAttributes);
    addingAtributes(lightBoxImage, lightBoxMediaAttributes);
    addingAtributes(lightBoxVideo, lightBoxMediaAttributes);
    addingAtributes(lightBoxH2, lightBoxH2Attributes);
    addingAtributes(lightBoxNext, lightBoxNextAttributes);
    addingAtributes(lightBoxPrev, lightBoxPrevAttributes);
    addingAtributes(lightBoxXMark, lightBoxXMarkAttributes);

    // Appending child elements
    lightBoxContainer.appendChild(lightBoxContent);
    lightBoxContent.appendChild(lightBoxImage);
    lightBoxContent.appendChild(lightBoxVideo);
    lightBoxContent.appendChild(lightBoxPrev);
    lightBoxContent.appendChild(lightBoxNext);
    lightBoxContent.appendChild(lightBoxXMark);

    main.appendChild(lightBoxContainer);

    let index = 0;

    function showLightBox(currentIndex, mediaType) {
        index = currentIndex;

        if (currentIndex === cards.length) index = 0;
        else if (currentIndex < 0) index = cards.length - 1;

        const mediaLocation = cards[index].children[0];
        const titleLocation = cards[index].children[1].children[0].textContent;

        lightBoxH2.innerHTML = titleLocation;

        const tagName = mediaLocation.tagName === 'IMG' ? 'img' : 'video';

        if (mediaType === 'img' || tagName === 'img') {

            lightBoxVideo.style.display = 'none';
            lightBoxImage.style.display = 'block';

            lightBoxImage.setAttribute('src', mediaLocation.getAttribute('src'));
            // lightBoxImage.setAttribute('alt', titleLocation);

        } else if (mediaType === 'video' || tagName === 'video') {

            lightBoxImage.style.display = 'none';
            lightBoxVideo.style.display = 'block';

            lightBoxVideo.controls = true;
            lightBoxVideo.autoplay = true;

            lightBoxVideo.appendChild(lightBoxSource);
            lightBoxSource.setAttribute('src', mediaLocation.children[0].getAttribute('src'));
        }

        lightBoxContainer.style.display = 'block';
        // lightBoxContent.focus();
        lightBoxContainer.setAttribute('aria-hidden', 'false');
        cards[1].parentNode.setAttribute('aria-hidden', 'true');
    }


    function currentImage(event) {
        const mediaType = event.target.localName;
        const currentIndex = parseInt(event.target.parentElement.getAttribute('data-index'));

        showLightBox(currentIndex, mediaType);
    }

    // Openning lightbox on clikc
    Array.from(cards).forEach((card) => {
        card.children[0].addEventListener('click', currentImage);
        card.children[0].addEventListener('keydown', (event) => {
            if (event.keyCode === 13) currentImage(event);

        });
    });

    // Next and previous buttons area
    function sliderImage(currentIndex) { showLightBox(index + currentIndex); }

    function prevImage() { sliderImage(-1); }
    function nextImage() { sliderImage(1); }

    lightBoxPrev.addEventListener('click', prevImage);
    lightBoxNext.addEventListener('click', nextImage);

    // Closing lightBox
    function closeLightbox(event) {
        lightBoxContainer.style.display = 'none';
        lightBoxContainer.setAttribute('aria-hidden', 'true');
        cards[1].parentNode.setAttribute('aria-hidden', 'false');
    }

    lightBoxXMark.addEventListener('click', closeLightbox);
    lightBoxXMark.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') closeLightbox();
    });

    // Keyboard events
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeLightbox();
            // eslint-disable-next-line no-undef
            closeModal();
        } else if (event.key === 'ArrowLeft') prevImage();
        else if (event.key === 'ArrowRight') nextImage();
    });
};


// ----------------------- Handles form inuts -----------------------
const handleFormSubmit = (photograperName) => {
    const formContact = document.getElementById('form-contact');
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    const headerElement = formContact.parentElement.firstElementChild;
    const formTitleContent = headerElement.firstElementChild;

    formTitleContent.textContent += ` ${photograperName}`;

    formContact.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = {
            [firstName.name]: firstName.value,
            [lastName.name]: lastName.value,
            [email.name]: email.value,
            [message.name]: message.value
        };

        // const formData = new FormData(formContact, document.querySelector('.contact_button'));

        const isFormEmpty = !Object.values(formData).every(value => !!value);
        if (isFormEmpty) return '';

        console.log(formData);

        event.target.reset();
        formContact.style.display = 'none';

        const confirmationMessage = document.createElement('p');
        confirmationMessage.textContent = 'Merci pour votre message. La personne prendra contact avec vous dès que possible :)';
        confirmationMessage.style.cssText = 'text-align: center; font-size: 1.3rem; margin-top: 2rem;';

        headerElement.parentElement.appendChild(confirmationMessage);
    });
};


// ----------------------- inits photograper -----------------------
const initPhotographer = async () => {
    const { filteredPhotographer, filteredPhotographerMedia } = await getPhotographerData();

    const { id, name, city, country, tagline, price, portrait } = filteredPhotographer;

    setPhotograperHeader(name, city, country, tagline, portrait);
    customizeSelectElement();
    sortingMedia(filteredPhotographerMedia, name, price);
    createLightboxElements();
    handleFormSubmit(name);
};
initPhotographer();

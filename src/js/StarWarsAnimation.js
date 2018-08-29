import { checkSWFontCompatibility } from './extras/auxiliar';
import { appendKeyframesRule } from './extras/utils';
import escapeHtml from './extras/escapeHtml';

class StarWarsAnimation {
  constructor() {
    this.animationContainer = document.querySelector('#animationContainer');
    this.animation = null;

    const animation = this.animationContainer.querySelector('.starwarsAnimation');
    this.animationCloned = animation.cloneNode(true);

    this.reset();
  }

  reset() {
    const animation = this.animationContainer.querySelector('.starwarsAnimation');
    if (animation) {
      this.animationContainer.removeChild(animation);
    }

    const cloned = this.animationCloned.cloneNode(true);
    this.animation = cloned;
  }

  load(opening) {
    // animation shortcut
    const { animation } = this;

    // INTRO TEXT
    const introHtml = escapeHtml(opening.intro)
      .replace(/\n/g, '<br>');

    animation.querySelector('#intro').innerHTML = introHtml;

    // EPISODE
    animation.querySelector('#episode').textContent = opening.episode;

    // EPISODE TITLE
    const titleContainer = animation.querySelector('#title');
    titleContainer.textContent = opening.title;
    if (checkSWFontCompatibility(opening.title)) {
      titleContainer.classList.add('SWFont');
    }

    // TEXT
    const escapedText = escapeHtml(opening.text);

    const paragraphs = escapedText
      .trim()
      .split('\n')
      .join('</p><p>');

    const breakLineBetweenPs = paragraphs
      .split('<p></p>')
      .join('<br/>');

    const finalHtml = `<p>${breakLineBetweenPs}</p>`;
    const textContainer = animation.querySelector('#text');
    textContainer.innerHTML = finalHtml;

    // TEXT CENTER ALIGNMENT
    textContainer.style.textAlign = opening.center ? 'center' : ''; // empty will not override the justify default rule

    // LOGO
    const starwarsDefaultText = 'star\nwars';
    const logoSvgContainer = animation.querySelector('.logoSvg');
    const logoDefaultContainer = animation.querySelector('#logoDefault');

    // logo can't be empty
    const logoText = opening.logo ? opening.logo : starwarsDefaultText;
    // is default logo
    if (logoText.toLowerCase() === starwarsDefaultText) {
      logoSvgContainer.style.display = 'none';
      logoDefaultContainer.style.display = 'block';

      return;
    }

    const logoTextSplit = logoText.split('\n');
    const word1 = logoTextSplit[0];
    const word2 = logoTextSplit[1] || '';

    const wordContainers = logoSvgContainer.querySelectorAll('text');
    wordContainers[0].textContent = word1;
    wordContainers[1].textContent = word2;

    // calculate the svg viewBox using the number of characters of the longest world in the logo.
    const logoSize = word1.length > word2.length ? word1 : word2;
    const viewbox = `0 0 ${logoSize.length * 200} 500`;
    logoSvgContainer.setAttribute('viewBox', viewbox);

    logoSvgContainer.style.display = 'block';
    logoDefaultContainer.style.display = 'none';
  }

  play() {
    const DEFAULT_LENGTH = 1977;
    const ANIMATION_CONSTANT = 0.04041570438799076;
    const FINAL_POSITION = 20;

    this.animationContainer.appendChild(this.animation);

    // adjust animation speed
    const titlesContainer = this.animation.querySelector('#titles > div');
    if (titlesContainer.offsetHeight > DEFAULT_LENGTH) {
      const exceedSize = titlesContainer.offsetHeight - DEFAULT_LENGTH;
      const animationFinalPosition = FINAL_POSITION - (exceedSize * ANIMATION_CONSTANT);
      appendKeyframesRule('titlesAnimation', `100% { top: ${animationFinalPosition}% }`);
    }
  }
}

export default StarWarsAnimation;

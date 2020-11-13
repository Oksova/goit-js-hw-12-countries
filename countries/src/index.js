import './styles.css';
import getRefs from './get-refs';

import debounce from 'lodash.debounce';

import { info, error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

import countryApi from '../src/fetchCountries.js';
import countryList from '../src/templates/countryList.hbs';
import countryCard from '../src/templates/countryCard.hbs';

const refs = getRefs();

let countryToSearch = '';

refs.inputEl.addEventListener('input', debounce(onSearch, 500));

function onSearch() {
  clearSearch();
  countryToSearch = refs.inputEl.value;
  console.log(countryToSearch);

  countryApi(countryToSearch)
    .then(renderCountryCard)
    .catch(err => console.log(err));
}

function renderCountryCard(countries) {
  if (countries.length === 1) {
    clearSearch();
    markupCountries(countryCard, countries);
  } else if (countries.length > 1 && countries.length <= 10) {
    clearSearch();
    markupCountries(countryList, countries);
  } else if (countries.length > 10) {
    outputInfo(
      error,
      'To many matches found. Please enter a more specific query!',
    );
  } else {
    outputInfo(info, 'No matches found!');
  }
  console.log(renderCountryCard);
}

function outputInfo(typeInfo, text) {
  typeInfo({
    text: `${text}`,
    delay: 1000,
    closerHover: true,
  });
}

function markupCountries(template, countries) {
  const markUp = template(countries);
  refs.cardEl.insertAdjacentHTML('beforeend', markUp);
  console.log(markupCountries);
}

function clearSearch() {
  refs.cardEl.innerHTML = '';
}

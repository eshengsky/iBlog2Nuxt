import Vue from 'vue';
import { library, config } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
    faClock
} from '@fortawesome/free-regular-svg-icons';
import {
    faMapSigns,
    faSearch
} from '@fortawesome/free-solid-svg-icons';
config.autoAddCss = false;
library.add(faClock, faMapSigns, faSearch);
Vue.component('font-awesome-icon', FontAwesomeIcon);

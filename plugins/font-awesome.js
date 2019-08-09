import Vue from 'vue';
import { library, config } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
    faClock,
    faPaperPlane
} from '@fortawesome/free-regular-svg-icons';
import {
    faMapSigns,
    faSearch
} from '@fortawesome/free-solid-svg-icons';
import {
    faMarkdown
} from '@fortawesome/free-brands-svg-icons'
config.autoAddCss = false;
library.add(faClock, faMapSigns, faSearch, faMarkdown, faPaperPlane);
Vue.component('font-awesome-icon', FontAwesomeIcon);

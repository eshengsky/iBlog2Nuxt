import Vue from 'vue';
import { library, config } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
    faClock,
    faPaperPlane,
    faTrashAlt
} from '@fortawesome/free-regular-svg-icons';
import {
    faMapSigns,
    faSearch,
    faReply,
    faPenNib,
    faCommentDots,
    faUser,
    faPencilAlt
} from '@fortawesome/free-solid-svg-icons';
import {
    faMarkdown
} from '@fortawesome/free-brands-svg-icons'
config.autoAddCss = false;
library.add(faClock, faMapSigns, faSearch, faMarkdown, faPaperPlane, faTrashAlt, faReply, faPenNib, faCommentDots, faUser, faPencilAlt);
Vue.component('font-awesome-icon', FontAwesomeIcon);

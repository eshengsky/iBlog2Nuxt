import Vue from 'vue';
import { library, config } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
    faClock,
    faTrashAlt,
    faPaperPlane,
    faFileAlt,
    faSave,
    faQuestionCircle,
    faEye,
    faComments,
    faUser as farUser,
    faEnvelope
} from '@fortawesome/free-regular-svg-icons';
import {
    faMapSigns,
    faSearch,
    faReply,
    faPenNib,
    faCommentDots,
    faUser,
    faPencilAlt,
    faPlus,
    faExternalLinkAlt,
    faUndo,
    faHistory,
    faTimes,
    faTrashAlt as fasTrashAlt,
    faLink,
    faSignOutAlt,
    faKey
} from '@fortawesome/free-solid-svg-icons';
import {
    faMarkdown
} from '@fortawesome/free-brands-svg-icons'
config.autoAddCss = false;
library.add(
    faClock,
    faMapSigns,
    faSearch,
    faMarkdown,
    faPaperPlane,
    faTrashAlt,
    fasTrashAlt,
    faReply,
    faPenNib,
    faCommentDots,
    faUser,
    faPencilAlt,
    faPlus,
    faExternalLinkAlt,
    faUndo,
    faSave,
    faHistory,
    faFileAlt,
    faTimes,
    faQuestionCircle,
    faComments,
    faEye,
    farUser,
    faEnvelope,
    faLink,
    faSignOutAlt,
    faKey
);
Vue.component('font-awesome-icon', FontAwesomeIcon);


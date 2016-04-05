import Minq from 'minq';
import {EventEmitter} from 'events';

Minq.connect('mongodb://localhost/pptshelf')
    .then(r => {
        GLOBAL.db = r;
    })
    .catch(e => console.error(e.message));
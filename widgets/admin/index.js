export {Login} from './login';

export function initState(widgetContext) {
    global.ReactMaterialize = widgetContext.get('ReactMaterialize');
}
export * from './login';
export * from './navbar';
export * from './settings';

export function initState(widgetContext) {
    global.ReactMaterialize = widgetContext.get('ReactMaterialize');
}
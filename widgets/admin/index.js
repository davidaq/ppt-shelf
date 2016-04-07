export * from './login';
export * from './navbar';
export * from './settings';
export * from './users';
export * from './file';
export * from './pptstatus';
export * from './contents';
export * from './ContentEditor';

export function initState(widgetContext) {
    global.ReactMaterialize = widgetContext.get('ReactMaterialize');
    exports.resetFileAreaId();
}
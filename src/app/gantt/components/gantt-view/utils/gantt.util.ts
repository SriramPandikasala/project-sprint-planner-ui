export function isChildTask(task) {
    return !!task?.parent;
}

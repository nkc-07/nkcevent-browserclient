var simplemde = new SimpleMDE({
    renderingConfig: {
        markedOptions: {
            sanitize: true
        }
    },
    element: $("#markdown-editor")[0]
});

simplemde.codemirror.on('beforeChange', (instance, changes) => {
    if (simplemde.value().length >= 1000 &&
        changes.origin !== "+delete" &&
        changes.origin !== "setValue" // value()で再帰禁止用
    ) {
        changes.cancel();
        simplemde.value(simplemde.value().slice(0, 1000)); // コピペの場合、変化が見えないので1000文字文のみ前から置き換える
    }
});
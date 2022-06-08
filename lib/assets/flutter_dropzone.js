if (typeof FlutterDropzone === 'undefined') {
    class FlutterDropzone {
        constructor(container, onLoaded, onError, onHover, onDrop, onDropMultiple, onLeave) {
            this.onError = onError;
            this.onHover = onHover;
            this.onDrop = onDrop;
            this.onDropMultiple = onDropMultiple;
            this.onLeave = onLeave;
            this.dropMIME = null;
            this.dropOperation = 'copy';

            container.addEventListener('dragover', this.dragover_handler.bind(this));
            container.addEventListener('dragleave', this.dragleave_handler.bind(this));
            container.addEventListener('drop', this.drop_handler.bind(this));

            if (onLoaded != null) onLoaded();
        }

        async getFile(fileEntry) {
            try {
                return await new Promise((resolve, reject) => fileEntry.file(resolve, reject));
            } catch (err) {
                console.log(err);
            }
        }

        updateHandlers(onLoaded, onError, onHover, onDrop, onDropMultiple, onLeave) {
            this.onError = onError;
            this.onHover = onHover;
            this.onDrop = onDrop;
            this.onDropMultiple = onDropMultiple;
            this.onLeave = onLeave;
            this.dropMIME = null;
            this.dropOperation = 'copy';
        }

        filesHandle(fileEntry, files) {
            if (fileEntry.isFile) {
                this.getFile(fileEntry).then(file => files.push(file));
            } else if (fileEntry.isDirectory) {
                let directoryReader = fileEntry.createReader()
                directoryReader.readEntries((entries) => {
                    for (var j = 0; j < entries.length; j++) {
                        this.filesHandle(entries[j], files);
                    }
                });
            }
        }

        dragover_handler(event) {
            event.preventDefault();
            event.dataTransfer.dropEffect = this.dropOperation;
            if (this.onHover != null) this.onHover(event);
        }

        dragleave_handler(event) {
            event.preventDefault();
            if (this.onLeave != null) this.onLeave(event);
        }

        drop_handler(event) {
            event.preventDefault();

            var files = [];
            let items = event.dataTransfer.items;

            for (var j = 0; j < items.length; j++) {
                let item = items[j].webkitGetAsEntry();

                if (item) {
                    this.filesHandle(item, files);
                }
            }

            setTimeout(() => {
                if (this.onDropMultiple != null) {
                    if (files.length > 0) this.onDropMultiple(event, files);
                }
            }, 100);
        }

        setMIME(mime) {
            this.dropMIME = mime;
        }

        setOperation(operation) {
            this.dropOperation = operation;
        }
    }

    var flutter_dropzone_web = {
        setMIME: function(container, mime) {
            container.FlutterDropzone.setMIME(mime);
            return true;
        },

        setOperation: function(container, operation) {
            container.FlutterDropzone.setOperation(operation);
            return true;
        },

        setCursor: function(container, cursor) {
            container.style.cursor = cursor;
            return true;
        },

        create: function(container, onLoaded, onError, onHover, onDrop, onDropMultiple, onLeave) {
            if (container.FlutterDropzone === undefined)
                container.FlutterDropzone = new FlutterDropzone(container, onLoaded, onError, onHover, onDrop, onDropMultiple, onLeave);
            else
                container.FlutterDropzone.updateHandlers(onLoaded, onError, onHover, onDrop, onDropMultiple, onLeave);
        },
    };

    window.dispatchEvent(new Event('flutter_dropzone_web_ready'));
}
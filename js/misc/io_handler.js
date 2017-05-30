let IoHandler = new function() {

    const KEY_ENTER = 13;
    const KEY_ESC = 27;
    const KEY_SPACE = 32;
    const KEY_F_UPPER = 70;
    const KEY_F_LOWER = 102;

    let dragging = Array();
    let dragElements = Array();
    let dragCallbacks = Array();

    this.setUp = function() {
        $("#db-view").on("click", ".row-title", function() {
            if ($(this).find("input").length == 0) {
                GuiWrapper.toggleTextField($(this));
            }
        });

        $("#db-view").on("click", ".row-artist", function() {
            if ($(this).find("input").length == 0) {
                GuiWrapper.toggleTextField($(this));
            }
        });

        $("#db-view").on("blur", ".db-edit-input", function() {
            GuiWrapper.toggleTextField($(this).parent());
        });

        $(document).keypress(event => {
            if (event.which == KEY_ENTER) {
                let focused = $(document.activeElement);
                if (focused.hasClass("db-edit-input")) {
                    GuiWrapper.toggleTextField(focused.parent());
                }
                else if (event.which == KEY_F_UPPER || event.which == KEY_F_LOWER) {
                    if (!GuiWrapper.isOpen) {
                        Background.flipImage();
                    }
                }
            }
        });

        $(document).keydown(event => {
            if (event.which == KEY_ESC) {
                if (GuiWrapper.isOpen) {
                    GuiWrapper.closeGui();
                }
            } else if (event.which == KEY_SPACE) {
                if (!$(document.activeElement).hasClass("db-edit-input")) {
                    AudioWrap.togglePlaying();
                }
            }
        });

        $("#field-artist").on("input", function() {
            $("#gui-artist").html($(this).val());
        });

        $("#field-title").on("input", function() {
            $("#gui-title").html($(this).val());
        });

        $("body").mousemove(function (e) {
            Object.keys(dragging).forEach(k => {
                if (dragging[k]) {
                    let element = dragElements[k];
                    let callback = dragCallbacks[k];
                    callback((e.clientX - element.position().left - parseInt(element.css("margin-left"))) / element.innerWidth());
                }
            });
        });

        $("body").mouseup(e => {
            Object.keys(dragging).forEach(k => {
                if (dragging[k]) {
                    dragging[k] = false;
                }
            });
        });

        $("body").mouseenter(e => {
            if ((e.buttons & 0x1) == 0) {
                Object.keys(dragging).forEach(k => {
                    dragging[k] = false;
                });
            }
        });
    }

    this.addDragListener = function(element, callback) {
        element.mousedown(function(e) {
            dragging[element.id] = true;
            dragElements[element.id] = element;
            dragCallbacks[element.id] = callback;
        });

        element.click(function(e) {
            callback(e.offsetX / $(this).width());
        });
    }

}

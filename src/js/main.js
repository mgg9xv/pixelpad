var pixelpad = function(){

    console.log('Starting pixelpad...');

    // Initialize state
    var state = {
        drawing: false,
        gridSize: 16,
        paintRGBA: 'rgba(0,128,255,0.5)',
        showFullMenu: false
    };

    // Initializing functions
    setupPixelGrid(state.gridSize);
    resizePixelGrid();
    updatePaintPreview();

    // Updates the paint/paint preview component when color or opacity changes
    function updatePaintPreview() {

        var paintColor = document.getElementById('paint-color-input').value;
        var paintOpacity = document.getElementById('paint-opacity-input').value;

        state.paintRGBA = 'rgba(' + hexToR(paintColor) +
            ',' + hexToG(paintColor) +
            ',' + hexToB(paintColor) +
            ',' + paintOpacity / 100 + ')';

        document.getElementById('paint-preview').style.backgroundColor = state.paintRGBA;
    }

    // Animates the menu sidebar to open or close
    function changeMenuState () {

        var controlSection = document.getElementById('control-section');
        var gridSection = document.getElementById('grid-section');

        toggleClass(controlSection, 'control-section-visible');
        toggleClass(gridSection, 'grid-section-visible');
    }

    // Resets the pixel grid by changing remvong the pixels
    function resetPixelGrid(){
        document.getElementById('grid-table').innerHTML = '';
        var gridSize = document.getElementById('grid-size-input').value;
        state.gridSize = gridSize;
        setupPixelGrid(gridSize);
    }

    // Setup all the pixels in the grid based on the grid size given
    function setupPixelGrid(gridSize){
        for ( var i = 0; i < gridSize; i++) {
            var tableRow = document.createElement('TR');
            document.getElementById('grid-table').appendChild(tableRow);
            for ( var j = 0; j < gridSize; j++) {
                var pixelId = "x" + j + "y" + i;
                var tableCell = document.createElement('TD');
                tableCell.id = pixelId;
                tableCell.className = 'pixel';
                tableCell.style.backgroundColor = 'rgba(255,255,255,1)';
                document.querySelector('tr:last-child').appendChild(tableCell);
            }
        }
    }

    // Gets the image that is drawn on the canvas
    function getCanvasImage(){

        // Setup an HTML canvas that isn't added to DOM but used to create a png
        // that the user downloads
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        var pixels = state.gridSize;
        canvas.width = pixels;
        canvas.height = pixels;

        // Get canvas imageData so that we can loop through it
        var imgData = ctx.getImageData(0,0,pixels,pixels);
        var data = imgData.data;

        for( var i = 0; i < data.length; i += 4){

            // Get the background-color css attribute of each grid cell
            var rgba = [];
            var pixel_index = (i / 4);
            var tableCell = document.querySelectorAll('tr > td')[pixel_index];
            var backgroundColor = tableCell.style.backgroundColor;

            // Parse out RGB value from the background-color attribute
            if( backgroundColor.indexOf('rgba') === -1) {
                backgroundColor = backgroundColor.replace("rgb(", '');
                backgroundColor = backgroundColor.replace(")",'');
                backgroundColor = backgroundColor.replace(/,/g,'');
                rgba = backgroundColor.split(' ');
                rgba.push(1);
            } else {
                backgroundColor = backgroundColor.replace("rgba(", '');
                backgroundColor = backgroundColor.replace(")",'');
                backgroundColor = backgroundColor.replace(/,/g,'');
                rgba = backgroundColor.split(' ');
            }

            // Set the canvas pixel data to match the grid cell color
            data[i] = parseInt(rgba[0]); // red
            data[i+1] = parseInt(rgba[1]); // green
            data[i+2] = parseInt(rgba[2]); // blue
            data[i+3] = rgba[3] * 255; // opacity
        }

        // Set image data for the canvas image to be downloaded
        imgData.data = data;
        ctx.putImageData(imgData,0,0);
        var previewImage = canvas.toDataURL();
        var previewImageElement = document.getElementById('preview-image');
        previewImageElement.setAttribute('src', previewImage);

        return previewImage;
    }

    // Downloads the pixelpad image as a png file
    function downloadImage(link){

        var previewImage = getCanvasImage();
        link.href = previewImage;

        // Get file name to save image under
        var fileName = document.getElementById('file-name-input').value;
        link.download = fileName ? fileName : 'favicon.ico';
    }

    // Resizes the pixel grid to fit nicely inside of the #grid-section
    function resizePixelGrid(){
        var width = document.getElementById('grid-section').clientWidth;
        var height = document.getElementById('grid-section').clientHeight;

        var gridContainerElement = document.getElementById('grid-container');
        if( height < width) {
            var newHeight = height - (height * 0.05) + "px";
            var newWidth = height - (height * 0.05) + "px";
            gridContainerElement.style.height = newHeight;
            gridContainerElement.style.width = newWidth;
        } else {
            gridContainerElement.style.height = width - (width * 0.05) + "px";
            gridContainerElement.style.width = width - (width * 0.05) + "px";
        }
    }

    // Toggle grid lines based on grid-toggle checkbox
    function toggleGridLines(){
        if( this === document || document.getElementById('grid-toggle').value === "1") {
            $('table, th, td ').css('border','1px solid black');
        } else {
            $('table, th, td ').css('border','none');
        }
    }

    // Toggle
    function toggleFullToolMenu(){
        if( this === document || state.showFullMenu ) {
            var secondaryTools = document.getElementById('secondary-tools');
            var maskingLayer = document.getElementById('masking-layer');
            state.showFullMenu = false;
            removeClass(secondaryTools, 'visible');
            removeClass(maskingLayer, 'visible');
        } else {
            var secondaryTools = document.getElementById('secondary-tools');
            var maskingLayer = document.getElementById('masking-layer');
            state.showFullMenu = true;
            addClass(secondaryTools, 'visible');
            addClass(maskingLayer, 'visible');
        }
    }

    // Toggle class
    function toggleClass(element, classToBeToggled){
        var elementClasses = element.className;
        var classRegex = new RegExp('\\b' + classToBeToggled + '\\b');
        var elementHasClass = elementClasses.match(classRegex);
        if (elementHasClass) {
            element.className = elementClasses.replace(classRegex, '');
        } else {
            element.className = elementClasses + " " + classToBeToggled;
        }
    }

    // Add class
    function addClass(element, classToBeAdded){
        var elementClasses = element.className;
        var classRegex = new RegExp('\\b' + classToBeAdded + '\\b');
        var elementDoeNotHaveClass = !(elementClasses.match(classRegex));
        if (elementDoeNotHaveClass) {
            element.className = elementClasses + " " + classToBeAdded;
        }
    }

    // Remove class
    function removeClass(element, classToBeRemoved){
        var elementClasses = element.className;
        var classRegex = new RegExp('\\b' + classToBeRemoved + '\\b');
        var elementHasClass = elementClasses.match(classRegex);
        if (elementHasClass) {
            element.className = elementClasses.replace(classRegex, '');
        }
    }

    // Taken from http://www.javascripter.net/faq/hextorgb.htm
    function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16);}
    function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16);}
    function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16);}
    function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h;}

    // Event listening function calls
    window.onresize =  resizePixelGrid;
    $('#control-section-button').on('click', changeMenuState);
    $('#paint-color-input').on('change', updatePaintPreview);
    $('#paint-opacity-input').on('change', updatePaintPreview);
    $('#grid-toggle').on('change', toggleGridLines);
    $('#reset-grid-button').on('click', resetPixelGrid);
    $('#download-button').on('click', function(){downloadImage(this);});
    $('#full-menu-button').on('click', toggleFullToolMenu);
    $('#mask-level').on('click', toggleFullToolMenu);

    // Painting functions
    $(document).on('mousedown touchstart','.pixel', function(event){
        event.preventDefault();
        $(this).css('background-color', state.paintRGBA);
        state.drawing = true;
    });
    $(document).on('mouseover','.pixel', function(event){
        event.preventDefault();
        if (state.drawing) {
            $(this).css('background-color', state.paintRGBA);
        }
    });
    $(document).on('touchmove', '.pixel', function(event){
        event.preventDefault();
        var touchedlement = document.elementFromPoint(event.originalEvent.touches[0].clientX, event.originalEvent.touches[0].clientY);
        if($(touchedlement).hasClass('pixel')){
            $(touchedlement).css('background-color', state.paintRGBA);
        }
    });
    $(document).on('mouseup touchend', '.pixel', function(event){
        event.preventDefault();
        state.drawing = false;
        getCanvasImage();
    });
};

if ( document.readyState = 'complete'|| (document.readyState = 'loading' && !document.documentElement.doScroll )) {
    pixelpad();
} else {
    document.addEventListener('DOMContentLoaded', pixelpad );
}
//Utilities library

function hexToRgba(hexColor, alpha){
    //converts #000000 + float alpha to [r,g,b,a]
    hexColor = hexColor.replace('#','');
    
    let r = parseInt(hexColor.substring(0, 2), 16) / 255;
    let g = parseInt(hexColor.substring(2, 4), 16) / 255;
    let b = parseInt(hexColor.substring(4, 6), 16) / 255;
    
    return [r, g, b, alpha];
}
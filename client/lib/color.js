class Color {
  static rgbToHsl({ r, g, b}) {
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
  
    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
  
    return { h, s, l };
  }

  static hslToRgb({ h, s, l }) {
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }

  static toHexByte(num) {
    const hex = num.toString(16);
  
    return hex.length == 2 ? hex : `0${hex}`;
  };

  static isHexChar(char) {
    const code = char.toUpperCase().charCodeAt(0);

    return (code >= 48 && code <= 57) || (code >= 64 && code <= 70); 
  }

  static isColorFormat(string) {
    return (
      string.length === 7 &&
      string[0] === '#' &&
      [ ...string.slice(1) ].every(char => Color.isHexChar(char))
    );
  }

  static Black() {
    return new Color({ r: 0, g: 0, b: 0 });
  }

  static White() {
    return new Color({ r: 255, g: 255, b: 255 });
  }

  constructor(args={ h: 0, s: 0, l: 0 }) {
    if ('r' in args && 'g' in args && 'b' in args) {
      this.hsl = Color.rgbToHsl(args);
    } else if ('h' in args && 's' in args && 'l' in args) {
      this.hsl = args;
    } else {
      throw new Error('Color needs to have at least r,g,b or h,s,l values.');
    }
  }

  clone() {
    return new Color(this.hsl);
  }

  get rgb() {
    return Color.hslToRgb(this.hsl);
  }

  set rgb({ r, g, b }) {
    this.hsl = Color.rgbToHsl({ r, g, b});
  }

  static fromHex(hexString) {
    const color = new Color();

    color.hex = hexString;

    return color;
  } 

  get hex() {
    const { r, g, b } = this.rgb;

    return `#${Color.toHexByte(r)}${Color.toHexByte(g)}${Color.toHexByte(b)}`;
  }

  set hex(hexString) {
    if (!Color.isColorFormat(hexString)) {
      throw new Error("String is not in color format.");
    }
  
    const r = Number.parseInt(hexString.slice(1, 3), 16);
    const g = Number.parseInt(hexString.slice(3, 5), 16);
    const b = Number.parseInt(hexString.slice(5, 7), 16);

    this.rgb = { r, g, b };
  }

  apply(fn) {
    fn(this);

    return this;
  }

  rotate(radians) {
    const amount = radians / (2 * Math.PI);

    this.hsl = { ...this.hsl, h: (this.hsl.h + amount) % 1 };

    return this;
  }

}

export {
  Color
};

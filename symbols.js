var faceReplacement = '\u2687'; // Replacement character for faces 
var renderAsText = '\uFE0E'; // VARIATION SELECTOR-15 'text style'
var renderAsImage = '\uFE0F'; // VARIATION SELECTOR-16 'emoji style'
var zeroSymbol = "0".charCodeAt(0);
var nineSymbol = "9".charCodeAt(0);

Number.prototype.inRange = function(min, max) {
	return this >= min && this <= max;
}

String.prototype.isFace = function () {
	if (this.length >= 2) {
		var firstCode = this.charCodeAt(0);
		var secondCode = this.charCodeAt(1);
		return (firstCode == 0xD83E && (secondCode.inRange(0xDD10, 0xDD17) || secondCode.inRange(0xDD20, 0xDD2F) || secondCode.inRange(0xDD70, 0xDD7A) || secondCode.inRange(0xDDD0, 0xDDD4)))
			|| (firstCode.inRange(0xD83D, 0xDBFF) && secondCode.inRange(0xDE00, 0xDE44));
	}
	return false;
}

String.prototype.isSquareWithDigit = function () {
	return this.length == 3 && this.charCodeAt(0).inRange(zeroSymbol, nineSymbol) && this.charCodeAt(1) == 0xFE0F && this.charCodeAt(2) == 0x20E3;
}

String.prototype.isHeart = function () {
	return this.length == 2 && this.charCodeAt(0) == 0xD83D && (this.charCodeAt(1) == 0xDDA4 || this.charCodeAt(1).inRange(0xDC93, 0xDC9F));
}

function getSymbols(string) {
	var unistring = Unistring(string.normalize());
	var output = [];
	for (var i = 0; i < unistring.length; i++) {
		var cluster = unistring.clusterAt(i);
		if (cluster.indexOf(renderAsImage) >= 0) {
			if (cluster.isSquareWithDigit()) {
				cluster = cluster.charAt(0);
			} else {
				cluster = cluster.replace(renderAsImage, renderAsText);
			}
		} else if (cluster.isFace()) {
			cluster = faceReplacement;
		} else if (cluster.isHeart()) {
			cluster = cluster + renderAsText;
		}
		output.push(cluster);
	}
	return output;
}
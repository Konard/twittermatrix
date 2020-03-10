var faceReplacement = '\u2687'; // Replacement character for faces 
var renderAsText = '\uFE0E'; // VARIATION SELECTOR-15 'text style'
var renderAsImage = '\uFE0F'; // VARIATION SELECTOR-16 'emoji style'

Number.prototype.inRange = function(min, max)
{
	return this >= min && this <= max;
}

function getSymbols(string)
{
	var index = 0;
	var length = string.length;
	var output = [];
	for (; index < length; index++)
	{
		if ((index + 1) < length)
		{
			var charCode = string.charCodeAt(index);
			if (charCode == 0xFE0F)
			{
				output.push(renderAsText);
				continue;
			}
			if (charCode.inRange(0x0900, 0x097F) || charCode.inRange(0xA8E0, 0xA8FF)) // Devanagari support
			{
				var startIndex = index;
				var nextChar = string.charAt(index + 1);
				while(/\p{M}/gu.test(nextChar))
				{
					index++;
					if ((index + 1) < length)
						nextChar = string.charAt(index + 1);
					else
						break;
				}
				output.push(string.slice(startIndex, index + 1));
				continue;
			}
			if (charCode.inRange(0xD83D, 0xDBFF)) // Override for EMOJI
			{
				charCode = string.charCodeAt(index + 1);
				if (charCode.inRange(0xDE00, 0xDE4F))
				{
					output.push(faceReplacement);
					index++;
					continue;
				}
			}
			if (charCode == 0xD83E) // Override for EMOJI
			{
				charCode = string.charCodeAt(index + 1);
				if (charCode.inRange(0xDD10, 0xDD2F))
				{
					output.push(faceReplacement);
					index++;
					continue;
				}
			}
			if (charCode.inRange(0xD800, 0xDBFF)) // Multi-character symbols (eg. UTF-32)
			{
				charCode = string.charCodeAt(index + 1);
				if (charCode.inRange(0xDC00, 0xDFFF))
				{
					output.push(string.slice(index, index + 2));
					index++;
					continue;
				}
			}
		}
		output.push(string.charAt(index));
	}
	return output;
}
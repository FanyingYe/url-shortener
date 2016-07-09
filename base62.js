module.exports = (function (Base62) {

	var charSet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var base = charSet.length;

	Base62.encode = function(num){
		var encoded = '';
		while (num){
			var remainder = num % base;
			num = Math.floor(num / base);
			encoded = charSet[remainder].toString() + encoded;
		}
		return encoded;
	};

	Base62.decode = function(str){
		var decoded = 0;
		str.forEach(function(character, index){
			decoded += Base62.characterSet.indexOf(character) * Math.pow(62, index);
		});
		return decoded;
	};

	return Base62;
}({}));
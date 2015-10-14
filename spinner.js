function Spinner(spiinerDom, contentDom) {
	this.start = function () {
		spiinerDom.style.display = 'block'
		contentDom.style.visibility = 'hidden'
	}

	this.stop = function () {
		spiinerDom.style.display = 'none'
		contentDom.style.visibility = 'visible'
	}
}
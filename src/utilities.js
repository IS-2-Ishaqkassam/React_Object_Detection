import { log } from "@tensorflow/tfjs-core/dist/log"
import { saveAs } from "file-saver"

function dataURLtoBlob(dataURL) {
	let array, binary, i, len
	binary = atob(dataURL.split(",")[1])
	array = []
	i = 0
	len = binary.length
	while (i < len) {
		array.push(binary.charCodeAt(i))
		i++
	}
	return new Blob([new Uint8Array(array)], {
		type: "image/png",
	})
}

export const drawRect = (video, canvas, detections, ctx) => {
	let cupwidth = ""
	let cupheight = ""
	// Loop through each prediction
	detections.forEach((prediction) => {
		let image = ""
		// Extract boxes and classes
		const [x, y, width, height] = prediction["bbox"]
		const text = prediction["class"]

		if (prediction["class"] == "cell phone") {
			cupwidth = prediction["bbox"][2]
			cupheight = prediction["bbox"][3]
			console.log("Writing", prediction["class"], prediction["bbox"])
			console.log("ctx", ctx)

			ctx.drawImage(video, 0, 0, canvas.current.width, canvas.current.height)
			image = canvas.current.toDataURL("image/jpeg")
			console.log("image is ", image)

			const blob = dataURLtoBlob(image)

			const file = new File([blob], "image.jpeg", {
				type: blob.type,
			})
			console.log(file)

			const payload = new FormData()
			payload.append("file", file, "image.jpeg")

			try {
				fetch("https://127.0.0.1:5000/predict", {
					method: "POST",
					body: payload,
				}).then((response) => {
					console.log("response", response)
				})
			} catch (e) {
				console.log("error", e)
			}

			// var png = dataURItoBlob( image )
			// console.log('Writing', png);
			// const png = canvas.current.toBlob((blob) => {
			// 	// saveAs(image, "image.png")
			// })
		}
		// Set styling
		const color = Math.floor(Math.random() * 16777215).toString(16)
		ctx.strokeStyle = "#" + color
		ctx.font = "18px Arial"

		// Draw rectangles and text
		ctx.beginPath()
		ctx.fillStyle = "#" + color
		ctx.fillText(text, x, y)
		ctx.rect(x, y, width, height)
		ctx.stroke()
	})
}

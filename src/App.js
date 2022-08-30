// Import dependencies
import React, { useRef, useState, useEffect } from "react"
import * as tf from "@tensorflow/tfjs"
import * as cocossd from "@tensorflow-models/coco-ssd"
import Webcam from "react-webcam"
import "./App.css"
import { drawRect } from "./utilities"
import axios from "axios"

function App() {
	const webcamRef = useRef(null)
	const canvasRef = useRef(null)

	let cupwidth = ""
	let cupheight = ""

	// Main function
	const runCoco = async () => {
		const net = await cocossd.load()
		console.log("Handpose model loaded.")
		//  Loop and detect hands
		setInterval(() => {
			detect(net)
		}, 5000)
	}

	const detect = async (net) => {
		// Check data is available
		if (
			typeof webcamRef.current !== "undefined" &&
			webcamRef.current !== null &&
			webcamRef.current.video.readyState === 4
		) {
			// Get Video Properties
			const video = webcamRef.current.video
			// const video = './Cars.mp4';
			const videoWidth = webcamRef.current.video.videoWidth
			const videoHeight = webcamRef.current.video.videoHeight

			// Set video width
			webcamRef.current.video.width = videoWidth
			webcamRef.current.video.height = videoHeight

			// Set canvas height and width
			canvasRef.current.width = videoWidth
			canvasRef.current.height = videoHeight

			// Make Detections
			const obj = await net.detect(video)

			const ctx = canvasRef.current.getContext("2d")
			drawRect(video, canvasRef, obj, ctx)
			obj.forEach((prediction) => {
				let image = ""
				// Extract boxes and classes
				const [x, y, width, height] = prediction["bbox"]
				const text = prediction["class"]

				
				// Set styling
			})

		}
	}

	useEffect(() => {
		runCoco()
	}, [])

	return (
		<div className="App">
			<header className="App-header">
				<Webcam
					ref={webcamRef}
					muted={true}
					style={{
						position: "absolute",
						marginLeft: "auto",
						marginRight: "auto",
						left: 0,
						right: 0,
						textAlign: "center",
						zindex: 9,
						width: 640,
						height: 480,
					}}
				/>

				<canvas
					ref={canvasRef}
					style={{
						position: "absolute",
						marginLeft: "auto",
						marginRight: "auto",
						left: 0,
						right: 0,
						textAlign: "center",
						zindex: 8,
						width: 640,
						height: 480,
					}}
				/>
			</header>
		</div>
	)
}

export default App

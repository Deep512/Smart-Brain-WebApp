import React from "react";
import "./FaceRecognition.css";

class FaceRecognition extends React.Component {
	render() {
		const { imageUrl } = this.props;
		return (
			<div className="center ma">
				<div className="absolute mt2" id="addbox">
					<img
						id="inputImage"
						src={imageUrl}
						alt={"face"}
						width="500px"
						height="auto"
					/>
					{this.props.boxes.map((box) => {
						console.log(box);
						return (
							<div
								className="bounding-box"
								style={{
									top: box.topRow,
									right: box.rightCol,
									bottom: box.bottomRow,
									left: box.leftCol,
								}}
							></div>
						);
					})}
				</div>
			</div>
		);
	}
}

export default FaceRecognition;

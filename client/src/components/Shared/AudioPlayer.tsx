import React, { ReactNode } from "react";
import ReactPlayer from "react-player";

interface Props {
  children?: ReactNode;
  url: string;
}

const AudioPlayer = ({ url }: Props) => (
  <div>
    <ReactPlayer url={url} height="30px" width="300px" controls={true} />
  </div>
);

export default AudioPlayer;

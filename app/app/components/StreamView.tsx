"use client";
import React, { useEffect, useRef, useState } from "react";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import { LogOut, ChevronUp, ChevronDown, Play, Share2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast, ToastContainer } from "react-toastify";
import { Appbar } from "../components/Appbar";
import { urlRegex } from "../lib/utils";
//@ts-ignore
import YoutubePlayer from "youtube-player";

interface Video {
  id: string;
  type: string;
  url: string;
  extractedId: string;
  title: string;
  smallImage: string;
  bigImage: string;
  active: boolean;
  userId: string;
  upvotes: number;
  haveUpvoted: boolean;
}
type Props = {
  playVideo: boolean;
  currentVideo: Video | null;
  playNextLoader: boolean;
  playNext: () => void;
};

const REFRESH_INTERVAL_MS = 10 * 1000;

export default function StreamView({
  creatorId,
  playVideo = false,
}: {
  creatorId: string;
  playVideo: boolean;
}) {
  const [inputLink, setInputLink] = useState("");
  const [queue, setQueue] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(false);
  const [nextLoader, setNextLoader] = useState(false);
  const videoPlayerRef = useRef<HTMLDivElement>();

  async function refreshStreams() {
    const res = await fetch(`/api/Streams/?creatorId=${creatorId}`, {
      credentials: "include",
    });
    const json = await res.json();
    console.log("json = ", json);
    setQueue(
      json.streams.sort((a: any, b: any) => (a.upvotes < b.upvotes ? 1 : -1))
    );
    setCurrentVideo((video) => {
      if (video?.id === json.activeStream?.currentStream?.id) {
        return video;
      }
      return json.activeStream.currentStream;
    });
  }

  useEffect(() => {
    refreshStreams();
    const interval = setInterval(() => {
      //refreshStreams();
    }, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!videoPlayerRef.current) {
      return;
    }

    let player = YoutubePlayer(videoPlayerRef.current);
    player.loadVideoById(currentVideo?.extractedId);

    player.playVideo();
    function eventHandler(event: any) {
      if (event.data === 0) {
        playNext();
      }
    }
    player.on("stateChange", eventHandler);
    return () => {
      player.destroy();
    };
  }, [currentVideo, videoPlayerRef]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/Streams/", {
      method: "POST",
      body: JSON.stringify({
        creatorId,
        url: inputLink,
      }),
    });
    setQueue([...queue, await res.json()]);
    setLoading(false);
    setInputLink("");
  };

  const handleVote = (id: string, isUpvote: boolean) => {
    setQueue(
      queue
        .map((video) =>
          video.id === id
            ? {
                ...video,
                /*upvotes: isUpvote ? video.upvotes + 1 : video.upvotes - 1,*/
                upvotes:
                  typeof video.upvotes === "number"
                    ? isUpvote
                      ? video.upvotes + 1
                      : video.upvotes - 1
                    : isUpvote
                    ? 1
                    : 0,
                haveUpvoted: !video.haveUpvoted,
              }
            : video
        )
        .sort((a, b) => b.upvotes - a.upvotes)
    );
    fetch(`/api/Streams/${isUpvote ? "upvote" : "downvote"}`, {
      method: "POST",
      body: JSON.stringify({
        streamId: id,
      }),
    });
  };
  const playNext = async () => {
    if (queue.length > 0) {
      try {
        setNextLoader(true);
        const data = await fetch("/api/Streams/next", {
          method: "GET",
        });
        const json = await data.json();
        setCurrentVideo(json.stream);
        setQueue((q) => q.filter((x) => x.id !== json.stream?.id));
      } catch (e) {
        console.log(e);
      }
      setNextLoader(false);
    }
  };

  useEffect(() => {
    if (!videoPlayerRef.current || !currentVideo) {
      return;
    }
    let player = YoutubePlayer(videoPlayerRef.current);

    // 'loadVideoById' is queued until the player is ready to receive API calls.
    player.loadVideoById(currentVideo.extractedId);

    // 'playVideo' is queue until the player is ready to received API calls and after 'loadVideoById' has been called.
    player.playVideo();
    function eventHandler(event: any) {
      console.log(event);
      console.log(event.data);
      if (event.data === 0) {
        playNext();
      }
    }
    player.on("stateChange", eventHandler);
    return () => {
      player.destroy();
    };
  }, [currentVideo, videoPlayerRef]);

  const handleShare = () => {
    //shareableLink is current url + creatorId
    const shareableLink = `${window.location.hostname}/creator/${creatorId}`;
    navigator.clipboard.writeText(shareableLink).then(
      () => {
        toast.success("Link copied to clipboard", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      },
      (err) => {
        console.log("Could not copy text: ", err);
        toast.error("Failed to copy link. Please try again later", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    );
  };
  return (
    <div className="flex flex-col min-h-screen bg-[rgb(10,10,10)] text-gray-200">
      <Appbar></Appbar>
      <div className="max-w-4xl mx-auto p-4 space-y-6 w-full">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Song Voting Queue</h1>
          <Button
            onClick={handleShare}
            className="bg-purple-700 hover:bg-purple-800 text-white"
          >
            <Share2Icon className="mr-2 h-4 w-4"></Share2Icon>
            Share
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-2">
          <Input
            type="text"
            placeholder="Paste Youtube link here"
            value={inputLink}
            onChange={(e) => setInputLink(e.target.value)}
            className="bg-gray-900 text-white border-gray-700 placeholder-gray-500"
          ></Input>
          <Button
            disabled={loading}
            onClick={handleSubmit}
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-800"
          >
            {loading ? "Loading...." : "Add to Queue"}
          </Button>
        </form>
        {inputLink && inputLink.match(urlRegex) && !loading && (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4">
              <LiteYouTubeEmbed
                title={currentVideo?.title || ""}
                id={currentVideo?.url.split("?v=")[1] || ""}
              ></LiteYouTubeEmbed>
            </CardContent>
          </Card>
        )}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Now Playing</h2>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4">
              {currentVideo ? (
                <div>
                  {playVideo ? (
                    //@ts-ignore
                    <div ref={videoPlayerRef} className="w-full"></div>
                  ) : (
                    <>
                      <img
                        src={currentVideo.bigImage}
                        title={currentVideo.title}
                        className="w-full h-72 object-cover rounded"
                      ></img>
                      <p className="mt-2 text-center font-semibold text-white">
                        {currentVideo.title}
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <p className="text-center py-8 text-gray-400">
                  No video Playing
                </p>
              )}
            </CardContent>
          </Card>
          {playVideo && (
            <Button
              disabled={nextLoader}
              onClick={playNext}
              className="w-full bg-purple-700 hover:bg-purple-800 text-white"
            >
              <Play className="mr-2 h-4 w-4"></Play>
              {nextLoader ? "Loading.." : "Play Next"}
            </Button>
          )}
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Upcoming Songs</h2>
          {queue.map((video) => (
            <Card key={video.id} className="bg-gray-900 border-gray-800">
              <CardContent className="pt-4 flex items-center space-x-4">
                <img
                  src={video.smallImage}
                  alt={`Thumbnail for ${video.title}`}
                  className="w-30 h-20 object-cover rounded"
                ></img>
                <div className="flex-grow">
                  <h3 className="font-semibold text-white">
                    {" "}
                    {typeof video.title === "string"
                      ? video.title
                      : "Untitled Video"}
                  </h3>
                  <div className="flex items-center space-x-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleVote(video.id, video.haveUpvoted ? false : true)
                      }
                      className="flex items-center space-x-1 bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                    >
                      {video.haveUpvoted ? (
                        <ChevronDown className="h-4 w-4"></ChevronDown>
                      ) : (
                        <ChevronUp className="h-4 w-4"></ChevronUp>
                      )}
                      {video.haveUpvoted ? (video.upvotes ? 1 : 0) : 0}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      ></ToastContainer>
    </div>
  );
}

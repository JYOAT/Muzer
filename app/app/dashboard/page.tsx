"use client";

import React, { useEffect, useState } from "react";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import { Share2, LogOut, ChevronUp, ChevronDown, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast, ToastContainer } from "react-toastify";
import { Appbar } from "../components/Appbar";
import { urlRegex } from "../lib/utils";
import StreamView from "../components/StreamView";

const creatorId = "84653aa8-72dc-431c-995b-b90697ad986c";
export default function Component() {
  return <StreamView creatorId={creatorId} playVideo={true}></StreamView>;
}

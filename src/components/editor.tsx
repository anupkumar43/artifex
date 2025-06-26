"use client";

import { useEffect, useRef, useState } from "react";
import Dropzone from "./dropzone";
import Style from "./style";
import { removeBackground } from "@imgly/background-removal";
import { Button } from "./ui/button";
import { IoMdArrowBack } from "react-icons/io";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { inter, domine } from "../app/fonts";
import { getPresignedUrl } from "~/app/actions/aws";
import { generate } from "~/app/actions/generate";

const presets = {
  style1: {
    fontSize: 100,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 1)",
    opacity: 1,
  },
  style2: {
    fontSize: 100,
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 1)",
    opacity: 1,
  },
  style3: {
    fontSize: 100,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.8)",
    opacity: 0.8,
  },
};

const Editor = ({ children }: { children: React.ReactNode }) => {
  const [selectedStyle, setSelectedStyle] = useState("style1");
  const [loading, setLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [processedImageSrc, setProcessedImageSrc] = useState<string | null>(
    null,
  );
  const [canvasReady, setCanvasReady] = useState(false);
  const [text, setText] = useState("POV");
  const [font, setFont] = useState("arial");

  const setSelectedImage = async (file?: File) => {
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const src = e.target?.result as string;
        setImageSrc(src);

        const blob = await removeBackground(src);
        const processedUrl = URL.createObjectURL(blob);
        setProcessedImageSrc(processedUrl);
        setCanvasReady(true);
        setLoading(false);
      };
      reader.readAsDataURL(file);
      await generate();
    }
  };

  useEffect(() => {
    if (canvasReady) {
      drawCompositeImage();
    }
  }, [canvasReady]);

  const drawCompositeImage = () => {
    if (!canvasRef.current || !canvasReady || !imageSrc || !processedImageSrc)
      return;

    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bgImg = new Image();

    bgImg.onload = () => {
      canvas.width = bgImg.width;
      canvas.height = bgImg.height;

      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

      let preset = presets[selectedStyle as keyof typeof presets];
      let fontSize = 100;
      let selectFont = "arial";
      if (font === "inter") selectFont = inter.style.fontFamily;
      else if (font === "domine") selectFont = domine.style.fontFamily;

      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `${preset.fontWeight} ${fontSize}px ${selectFont}`;

      const textWidth = ctx.measureText(text).width;
      const scale = (canvas.width * 0.9) / textWidth;
      fontSize *= scale;
      ctx.font = `${preset.fontWeight} ${fontSize}px ${selectFont}`;
      ctx.fillStyle = preset.color;
      ctx.globalAlpha = preset.opacity;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.fillText(text, 0, 0);
      ctx.restore();
      ctx.globalAlpha = 1;

      const fgImg = new Image();
      fgImg.onload = () => {
        ctx.drawImage(fgImg, 0, 0, canvas.width, canvas.height);
      };
      fgImg.src = processedImageSrc;
    };

    bgImg.src = imageSrc;
  };

  const handleDownload = async () => {
    if (!canvasRef.current) return;

    const link = document.createElement("a");
    link.download = "image.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();

    canvasRef.current.toBlob(async (blob) => {
      if (!blob) return;
      try {
        const uploadUrl = await getPresignedUrl();
        await fetch(uploadUrl, {
          method: "PUT",
          body: blob,
          headers: {
            "Content-Type": "image/png",
          },
        });
        console.log("Uploaded to S3");
      } catch (err) {
        console.error("Upload error", err);
      }
    }, "image/png");
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-start px-4 pt-10 pb-10">
      {imageSrc ? (
        loading ? (
          <div className="flex h-32 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-dashed border-gray-800" />
          </div>
        ) : (
          <div className="flex w-full max-w-2xl flex-col items-center gap-6">
            <div className="w-full">
              <button
                onClick={() => {
                  setImageSrc(null);
                  setProcessedImageSrc(null);
                  setCanvasReady(false);
                  window.location.reload(); // 🔄 Force refresh to display new image
                }}
                className="text-muted-foreground hover:text-foreground mb-4 flex items-center gap-2 text-sm"
              >
                <IoMdArrowBack />
                <span>Go back</span>
              </button>
              <canvas
                ref={canvasRef}
                className="bg-muted max-h-[80vh] w-full rounded-lg"
              />
            </div>

            <Card className="w-full">
              <CardHeader>
                <CardTitle>Edit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="text">Text</Label>
                  <Input
                    id="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Text in thumbnail"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="font">Font</Label>
                  <Select
                    value={font}
                    onValueChange={(value) => setFont(value)}
                  >
                    <SelectTrigger id="font">
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="arial">Arial</SelectItem>
                      <SelectItem value="inter">Inter</SelectItem>
                      <SelectItem value="domine">Domine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button onClick={handleDownload}>Download</Button>
                <Button onClick={drawCompositeImage}>Update</Button>
              </CardFooter>
            </Card>
          </div>
        )
      ) : (
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Hi there
          </h1>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Want to edit your Picture?
          </h1>
          <p className="text-muted-foreground mt-2 leading-7">
            See one of the templates below
          </p>

          {/* Updated layout wrapper for templates and Dropzone */}
          <div className="mt-10 flex flex-col items-center justify-center gap-10">
            <div className="flex flex-col items-center gap-6 md:flex-row">
              <Style
                image="/style1.png"
                selectStyle={() => setSelectedStyle("style1")}
                isSelected={selectedStyle === "style1"}
              />
              <Style
                image="/style2.png"
                selectStyle={() => setSelectedStyle("style2")}
                isSelected={selectedStyle === "style2"}
              />
              <Style
                image="/style3.png"
                selectStyle={() => setSelectedStyle("style3")}
                isSelected={selectedStyle === "style3"}
              />
            </div>

            <Dropzone setSelectedImage={setSelectedImage} />
          </div>

          <div className="mt-8">{children}</div>
        </div>
      )}
    </div>
  );
};

export default Editor;

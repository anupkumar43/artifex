"use client";

import { useEffect, useRef, useState } from "react";
import Dropzone from "~/components/dropzone";
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
import Style from "./style";

const presets = {
  style1: { fontSize: 100, fontWeight: "bold", color: "#ffffff", opacity: 1 },
  style2: { fontSize: 100, fontWeight: "bold", color: "#000000", opacity: 1 },
  style3: { fontSize: 100, fontWeight: "bold", color: "#ffffff", opacity: 0.8 },
};

const ThumbnailCreator = ({ children }: { children: React.ReactNode }) => {
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
        const processed = URL.createObjectURL(blob);
        setProcessedImageSrc(processed);
        setCanvasReady(true);
        setLoading(false);
      };
      reader.readAsDataURL(file);
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

    const bg = new Image();
    bg.onload = () => {
      canvas.width = bg.width;
      canvas.height = bg.height;

      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
      const preset = presets[selectedStyle as "style1"];

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      let selectFont = "arial";
      if (font === "inter") selectFont = inter.style.fontFamily;
      if (font === "domine") selectFont = domine.style.fontFamily;

      ctx.font = `${preset.fontWeight} 100px ${selectFont}`;
      const textWidth = ctx.measureText(text).width;
      const scale = (canvas.width * 0.9) / textWidth;
      ctx.font = `${preset.fontWeight} ${100 * scale}px ${selectFont}`;

      ctx.fillStyle = preset.color;
      ctx.globalAlpha = preset.opacity;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.fillText(text, 0, 0);
      ctx.globalAlpha = 1;
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      const fg = new Image();
      fg.onload = () => {
        ctx.drawImage(fg, 0, 0, canvas.width, canvas.height);
      };
      fg.src = processedImageSrc;
    };
    bg.src = imageSrc;
  };

  const handleDownload = async () => {
    if (canvasRef.current) {
      const link = document.createElement("a");
      link.download = "thumbnail.png";
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  return (
    <>
      {imageSrc ? (
        <div className="flex w-full max-w-2xl flex-col items-center gap-6">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-dashed border-gray-500" />
            </div>
          ) : (
            <>
              {" "}
              <div className="w-full">
                <button
                  onClick={() => {
                    setImageSrc(null);
                    setProcessedImageSrc(null);
                    setCanvasReady(false);
                  }}
                  className="text-muted-foreground hover:text-foreground mb-4 flex items-center gap-2 text-sm"
                >
                  <IoMdArrowBack />
                  <span>Go back</span>
                </button>
                <canvas
                  ref={canvasRef}
                  className="bg-muted w-full rounded-lg"
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
                      placeholder="Enter text for thumbnail"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="bg-muted text-foreground"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="font">Font</Label>
                    <Select
                      value={font}
                      onValueChange={(value) => setFont(value)}
                    >
                      <SelectTrigger id="font">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
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
            </>
          )}
        </div>
      ) : (
        <div className="mt-10 flex flex-col gap-10">
          <div className="space-y-2 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              Hi there
            </h1>
            <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              Want to add text to your pic?
            </h2>
            <p className="text-muted-foreground">
              Select a style and upload an image to start designing.
            </p>
          </div>

          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
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

          <div className="mt-8">{children}</div>
        </div>
      )}
    </>
  );
};

export default ThumbnailCreator;
